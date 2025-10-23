const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUTPUT_ROOT = path.join(__dirname, "..", "_site-eleventy");
const TARGET_EXTENSIONS = new Set([".html", ".css", ".js", ".json", ".webmanifest"]);

const formatBytes = bytes => {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const collectFiles = dir => {
  const entries = [];

  if (!fs.existsSync(dir)) {
    return entries;
  }

  const queue = [dir];
  while (queue.length > 0) {
    const current = queue.pop();
    const children = fs.readdirSync(current, { withFileTypes: true });

    for (const child of children) {
      const childPath = path.join(current, child.name);
      if (child.isDirectory()) {
        queue.push(childPath);
        continue;
      }

      const extension = path.extname(child.name).toLowerCase();
      if (!TARGET_EXTENSIONS.has(extension)) {
        continue;
      }

      const contents = fs.readFileSync(childPath);
      const relativePath = path.relative(OUTPUT_ROOT, childPath);

      entries.push({
        path: relativePath,
        extension,
        size: contents.length,
        gzipSize: zlib.gzipSync(contents).length
      });
    }
  }

  return entries;
};

const summarizeByType = files => {
  return files.reduce((accumulator, file) => {
    const stats = accumulator.get(file.extension) || { size: 0, gzipSize: 0, count: 0 };
    stats.size += file.size;
    stats.gzipSize += file.gzipSize;
    stats.count += 1;
    accumulator.set(file.extension, stats);
    return accumulator;
  }, new Map());
};

if (!fs.existsSync(OUTPUT_ROOT)) {
  console.error(
    "\n⚠️  Build output not found. Run `npm run build` before `npm run audit:assets`."
  );
  process.exit(1);
}

const files = collectFiles(OUTPUT_ROOT);

if (files.length === 0) {
  console.log("No matching assets found to audit.");
  process.exit(0);
}

files.sort((a, b) => b.size - a.size);

console.log("\n📦 Asset weight report for `_site-eleventy`\n");
console.log("Largest files (top 10 by size):\n");
const topFiles = files.slice(0, 10);
const fileTable = topFiles.map(file => ({
  file: file.path,
  size: formatBytes(file.size),
  "gzip size": formatBytes(file.gzipSize)
}));
console.table(fileTable);

const summary = summarizeByType(files);
console.log("\nTotals by extension:\n");
const summaryTable = Array.from(summary.entries())
  .sort((a, b) => b[1].size - a[1].size)
  .map(([extension, stats]) => ({
    extension,
    files: stats.count,
    size: formatBytes(stats.size),
    "gzip size": formatBytes(stats.gzipSize)
  }));
console.table(summaryTable);

const totalSize = files.reduce((acc, file) => acc + file.size, 0);
const totalGzipSize = files.reduce((acc, file) => acc + file.gzipSize, 0);
console.log(
  `\nTotal audited assets: ${files.length} files, ${formatBytes(totalSize)} raw / ${formatBytes(totalGzipSize)} gzipped.`
);
console.log(
  "\nUse these baselines with a Lighthouse audit to spot regressions. See docs/operations/performance-audit.md for the full checklist."
);
