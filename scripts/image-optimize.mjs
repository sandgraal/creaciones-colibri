#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const IMAGE_ROOT = path.join(process.cwd(), "src", "img");
const RASTER_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

function parseArgs(argv) {
  const options = {
    maxRawKB: 200,
    reportPath: null,
    emitJson: false,
    strict: false,
    help: false
  };

  for (const arg of argv) {
    if (arg === "--json") {
      options.emitJson = true;
      continue;
    }

    if (arg === "--strict") {
      options.strict = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg.startsWith("--max-raw-kb=")) {
      const value = Number.parseFloat(arg.split("=")[1]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid value for --max-raw-kb: ${arg}`);
      }
      options.maxRawKB = value;
      continue;
    }

    if (arg.startsWith("--report=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("--report requires a file path");
      }
      options.reportPath = value;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

async function ensureDirectoryExists(filePath) {
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
}

function formatKB(bytes) {
  return Number((bytes / 1024).toFixed(1));
}

async function walkDirectory(root) {
  const queue = [root];
  const files = [];

  while (queue.length > 0) {
    const current = queue.pop();
    let entries;

    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") {
        return files;
      }
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(entryPath);
        continue;
      }

      files.push(entryPath);
    }
  }

  return files;
}

async function collectImageMetadata(imageRoot) {
  const files = await walkDirectory(imageRoot);
  const summary = {
    scanned: [],
    missingWebp: [],
    oversized: []
  };

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(process.cwd(), filePath);

    const stats = await fs.stat(filePath);
    const entry = {
      path: relativePath.replace(/\\/g, "/"),
      bytes: stats.size,
      sizeKB: formatKB(stats.size),
      extension
    };

    summary.scanned.push(entry);
  }

  return summary;
}

function evaluateImages(summary, options) {
  const available = new Set(summary.scanned.map((entry) => entry.path));

  for (const entry of summary.scanned) {
    if (!RASTER_EXTENSIONS.has(entry.extension)) {
      continue;
    }

    const directory = path.dirname(entry.path);
    const baseName = path.basename(entry.path, entry.extension);
    const expectedWebp = path.join(directory, `${baseName}.webp`).replace(/\\/g, "/");

    if (!available.has(expectedWebp)) {
      summary.missingWebp.push({
        path: entry.path,
        suggestedDerivative: expectedWebp
      });
    }

    if (entry.sizeKB > options.maxRawKB) {
      summary.oversized.push({
        path: entry.path,
        sizeKB: entry.sizeKB,
        maxAllowedKB: options.maxRawKB
      });
    }
  }

  summary.missingWebp.sort((a, b) => a.path.localeCompare(b.path));
  summary.oversized.sort((a, b) => b.sizeKB - a.sizeKB);
  summary.scanned.sort((a, b) => a.path.localeCompare(b.path));

  return summary;
}

function printReport(summary, options) {
  const header = "\n🖼️  Image optimization report";
  console.log(header);
  console.log("Scanned files:", summary.scanned.length);
  console.log("Missing webp derivatives:", summary.missingWebp.length);
  console.log("Oversized assets (>", options.maxRawKB, "KB):", summary.oversized.length);

  if (summary.missingWebp.length > 0) {
    console.log("\nFiles missing webp derivatives:\n");
    console.table(summary.missingWebp);
  }

  if (summary.oversized.length > 0) {
    console.log("\nOversized images:\n");
    console.table(summary.oversized);
  }
}

async function writeReport(summary, options) {
  if (!options.reportPath) {
    return;
  }

  const reportAbsolute = path.isAbsolute(options.reportPath)
    ? options.reportPath
    : path.join(process.cwd(), options.reportPath);

  await ensureDirectoryExists(reportAbsolute);
  await fs.writeFile(reportAbsolute, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`\nReport written to ${reportAbsolute}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(`Usage: node scripts/image-optimize.mjs [options]\n\n` +
      `Options:\n` +
      `  --max-raw-kb=<number>  Override the raw size threshold (default 200).\n` +
      `  --report=<path>        Write a JSON report to the provided path.\n` +
      `  --json                 Output the report JSON to stdout.\n` +
      `  --strict               Exit with code 1 if issues are detected.\n` +
      `  --help                 Show this message.\n`);
    return;
  }

  const summary = await collectImageMetadata(IMAGE_ROOT);
  evaluateImages(summary, options);

  if (options.emitJson) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    printReport(summary, options);
  }

  await writeReport(summary, options);

  if (options.strict && (summary.missingWebp.length > 0 || summary.oversized.length > 0)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Failed to run image optimization audit:", error);
  process.exitCode = 1;
});
