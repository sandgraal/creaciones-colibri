#!/usr/bin/env node
/**
 * Run Lighthouse audits against the built Eleventy site and persist reports
 * under docs/operations/performance-reports.
 *
 * This script assumes the site has already been built into `_site-eleventy`.
 * It starts a minimal static file server so Lighthouse can audit the local
 * files, then shells out to the Lighthouse CLI for each target page.
 */

const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const OUTPUT_DIR = path.resolve(__dirname, "..", "_site-eleventy");
const REPORTS_ROOT = path.resolve(
  __dirname,
  "..",
  "docs",
  "operations",
  "performance-reports"
);

const DEFAULT_PORT = Number(process.env.LIGHTHOUSE_PORT) || 8042;
const PATH_PREFIX = (process.env.LIGHTHOUSE_PATH_PREFIX || "/creaciones-colibri").replace(/\/$/, "");

const DEFAULT_TARGETS = [
  { id: "home", label: "Home", path: "" },
  { id: "products", label: "Products listing", path: "products" },
  { id: "bundles", label: "Bundles listing", path: "bundles" },
  { id: "es", label: "Spanish landing", path: "es" }
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const parseTargets = value => {
  if (!value) {
    return DEFAULT_TARGETS;
  }

  return value
    .split(",")
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(entry => {
      const [idPart, pathPart] = entry.split(":");
      const id = (idPart || pathPart || "page").trim();
      const rawPath = (pathPart || idPart || "").trim();
      return {
        id,
        label: id,
        path: rawPath
      };
    });
};

const joinWithPrefix = (prefix, segment) => {
  const cleanedSegment = (segment || "").replace(/^\/+/, "").replace(/\/+$/, "");
  const pieces = [prefix, cleanedSegment].filter(Boolean);
  const joined = pieces.join("/");
  return `/${joined}`.replace(/\/+/g, "/").replace(/\/$/, "/");
};

const ensureDirectory = targetPath => {
  fs.mkdirSync(targetPath, { recursive: true });
};

const formatScore = value => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return Math.round(value * 100);
};

const createSummaryMarkdown = (runDirectory, metadata) => {
  const lines = [];
  lines.push(`# Lighthouse Audit — ${metadata.timestampReadable}`);
  lines.push("");
  lines.push(`- **Base URL:** ${metadata.baseUrl}`);
  lines.push(`- **Path prefix:** \`${metadata.pathPrefix || "/"}\``);
  lines.push(`- **Pages audited:** ${metadata.results.length}`);
  if (metadata.failures.length) {
    lines.push(`- **Warnings:** ${metadata.failures.length} page(s) reported errors.`);
  }
  lines.push("");
  lines.push("| Page | URL | Performance | Accessibility | Best Practices | SEO | Notes |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  metadata.results.forEach(result => {
    const { label, url, scores, error } = result;
    const cells = [
      label,
      url,
      scores.performance ?? "—",
      scores.accessibility ?? "—",
      scores["best-practices"] ?? "—",
      scores.seo ?? "—",
      error ? `⚠️ ${error}` : ""
    ];
    lines.push(`| ${cells.join(" | ")} |`);
  });
  lines.push("");
  lines.push("Reports were generated with `npm run audit:lighthouse`. JSON and HTML artifacts live alongside this summary.");
  fs.writeFileSync(path.join(runDirectory, "summary.md"), lines.join("\n"), "utf8");
};

const resolveFilePath = urlPath => {
  let normalized = decodeURIComponent(urlPath.split("?")[0]);
  if (PATH_PREFIX && PATH_PREFIX !== "/" && normalized.startsWith(PATH_PREFIX)) {
    normalized = normalized.slice(PATH_PREFIX.length);
    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }
  }
  if (!normalized || normalized === "/") {
    normalized = "/index.html";
  } else if (normalized.endsWith("/")) {
    normalized = `${normalized}index.html`;
  }
  const filePath = path.join(OUTPUT_DIR, normalized);
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(OUTPUT_DIR)) {
    return null;
  }
  return safePath;
};

const startStaticServer = (rootDirectory, port) => {
  const server = http.createServer((request, response) => {
    const targetPath = resolveFilePath(request.url || "/");
    if (!targetPath) {
      response.statusCode = 403;
      response.end("Forbidden");
      return;
    }

    fs.readFile(targetPath, (error, data) => {
      if (error) {
        response.statusCode = 404;
        response.end("Not found");
        return;
      }

      const extension = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[extension] || "application/octet-stream";
      response.writeHead(200, { "Content-Type": contentType });
      response.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      server.removeListener("error", reject);
      resolve(server);
    });
  });
};

const findLighthouseCommand = () => {
  const localBinary = path.join(
    __dirname,
    "..",
    "node_modules",
    ".bin",
    process.platform === "win32" ? "lighthouse.cmd" : "lighthouse"
  );
  if (fs.existsSync(localBinary)) {
    return { command: localBinary, args: [] };
  }

  const whichCommand = process.platform === "win32" ? "where" : "which";
  const whichResult = spawnSync(whichCommand, ["lighthouse"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  });
  if (whichResult.status === 0) {
    const candidate = whichResult.stdout.split(/\r?\n/).find(Boolean);
    if (candidate) {
      return { command: candidate.trim(), args: [] };
    }
  }

  const npxCheck = spawnSync("npx", ["--no-install", "lighthouse", "--version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  });
  if (npxCheck.status === 0) {
    return { command: "npx", args: ["--no-install", "lighthouse"] };
  }

  throw new Error(
    "Lighthouse CLI not found. Install it globally with `npm install -g lighthouse` or add it to devDependencies."
  );
};

const runLighthouseCli = (commandInfo, url, format, outputPath) => {
  return new Promise((resolve, reject) => {
    const baseArgs = [
      url,
      `--output=${format}`,
      `--output-path=${outputPath}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--quiet"
    ];
    const args = commandInfo.args.concat(baseArgs);
    const child = spawn(commandInfo.command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", code => {
      if (code !== 0) {
        reject(new Error(`Lighthouse exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

const run = async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    throw new Error(
      "Build output not found. Run `npm run build` before executing the Lighthouse audit."
    );
  }

  const lighthouseCommand = findLighthouseCommand();
  const targets = parseTargets(process.env.LIGHTHOUSE_TARGETS);
  if (!targets.length) {
    throw new Error("No Lighthouse targets specified.");
  }

  const server = await startStaticServer(OUTPUT_DIR, DEFAULT_PORT);
  const baseUrl = new URL(`http://localhost:${DEFAULT_PORT}`);
  console.log(`Serving ${OUTPUT_DIR} at ${baseUrl.href}`);

  const timestampIso = new Date().toISOString();
  const timestampSlug = timestampIso.replace(/[:.]/g, "-");
  const runDirectory = path.join(REPORTS_ROOT, `${timestampSlug}-lighthouse`);
  ensureDirectory(runDirectory);

  const results = [];
  const failures = [];

  try {
    for (const target of targets) {
      const normalizedPath = joinWithPrefix(PATH_PREFIX.replace(/^\/+/, ""), target.path || "");
      const targetUrl = new URL(`${normalizedPath}/`, baseUrl).href;
      console.log(`\n→ Auditing ${target.label || target.id} (${targetUrl})`);

      const jsonPath = path.join(runDirectory, `${target.id}.json`);
      const htmlPath = path.join(runDirectory, `${target.id}.html`);

      try {
        await runLighthouseCli(lighthouseCommand, targetUrl, "json", jsonPath);
        await runLighthouseCli(lighthouseCommand, targetUrl, "html", htmlPath);

        const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        const categories = report.categories || {};
        const scores = {
          performance: formatScore(categories.performance && categories.performance.score),
          accessibility: formatScore(categories.accessibility && categories.accessibility.score),
          "best-practices": formatScore(
            categories["best-practices"] && categories["best-practices"].score
          ),
          seo: formatScore(categories.seo && categories.seo.score)
        };

        results.push({
          id: target.id,
          label: target.label || target.id,
          url: targetUrl,
          scores,
          reports: {
            json: path.relative(REPORTS_ROOT, jsonPath),
            html: path.relative(REPORTS_ROOT, htmlPath)
          }
        });

        console.log(
          `   Scores — Performance: ${scores.performance ?? "n/a"}, Accessibility: ${scores.accessibility ?? "n/a"}, Best Practices: ${scores["best-practices"] ?? "n/a"}, SEO: ${scores.seo ?? "n/a"}`
        );
      } catch (error) {
        const message = error && error.message ? error.message : String(error);
        console.error(`   ⚠️  Lighthouse failed: ${message}`);
        failures.push({ target, message });
        results.push({
          id: target.id,
          label: target.label || target.id,
          url: targetUrl,
          scores: {},
          error: message
        });
      }
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }

  createSummaryMarkdown(runDirectory, {
    timestampReadable: `${timestampIso} (UTC)`,
    baseUrl: baseUrl.href,
    pathPrefix: PATH_PREFIX,
    results,
    failures
  });

  if (failures.length) {
    const error = new Error(
      `${failures.length} Lighthouse audit(s) reported errors. Review the summary for details.`
    );
    error.failures = failures;
    throw error;
  }

  console.log(`\n✅ Lighthouse audits completed. Reports saved to ${runDirectory}`);
  return { runDirectory };
};

run()
  .then(result => {
    if (result && result.runDirectory) {
      console.log(`Summary: ${path.join(result.runDirectory, "summary.md")}`);
    }
  })
  .catch(error => {
    console.error(`\n❌ ${error.message}`);
    if (error.failures) {
      error.failures.forEach(item => {
        const label = item.target && (item.target.label || item.target.id);
        console.error(`   - ${label}: ${item.message}`);
      });
    }
    process.exitCode = 1;
  });
