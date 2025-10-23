#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const products = require("../src/_data/products.js");

function parseArgs(argv) {
  const options = {
    format: "csv",
    outPath: null,
    fields: ["id", "name", "unit", "ingredients"],
    delimiter: ",",
    pretty: false,
    category: null,
    includeHeader: true,
    help: false
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg.startsWith("--format=")) {
      const value = arg.split("=")[1];
      if (!value || !["csv", "json"].includes(value)) {
        throw new Error("--format must be 'csv' or 'json'");
      }
      options.format = value;
      continue;
    }

    if (arg.startsWith("--out=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("--out requires a file path");
      }
      options.outPath = value;
      continue;
    }

    if (arg.startsWith("--fields=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("--fields requires a comma-separated list");
      }
      options.fields = value.split(",").map((field) => field.trim()).filter(Boolean);
      continue;
    }

    if (arg.startsWith("--delimiter=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("--delimiter requires a value");
      }
      options.delimiter = value;
      continue;
    }

    if (arg === "--pretty") {
      options.pretty = true;
      continue;
    }

    if (arg.startsWith("--category=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("--category requires a value");
      }
      options.category = value;
      continue;
    }

    if (arg === "--no-header") {
      options.includeHeader = false;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function getValue(record, pathExpression) {
  return pathExpression.split(".").reduce((value, segment) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    return value[segment];
  }, record);
}

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.join("; ");
  }
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
}

function toCsv(records, fields, delimiter, includeHeader) {
  const escape = (value) => {
    if (value.includes("\"")) {
      value = value.replace(/"/g, '""');
    }
    if (value.includes(delimiter) || value.includes("\n")) {
      return `"${value}"`;
    }
    return value;
  };

  const rows = records.map((record) =>
    fields.map((field) => escape(normalizeValue(record[field]))).join(delimiter)
  );

  if (includeHeader) {
    rows.unshift(fields.join(delimiter));
  }

  return rows.join("\n") + "\n";
}

async function ensureDirectoryExists(filePath) {
  if (!filePath) {
    return;
  }
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
}

function buildRecords(source, fields) {
  return source.map((product) => {
    const entry = {};
    for (const field of fields) {
      entry[field] = normalizeValue(getValue(product, field));
    }
    return entry;
  });
}

async function writeOutput(data, options) {
  if (!options.outPath) {
    process.stdout.write(data);
    return;
  }

  const absolutePath = path.isAbsolute(options.outPath)
    ? options.outPath
    : path.join(process.cwd(), options.outPath);

  await ensureDirectoryExists(absolutePath);
  await fs.writeFile(absolutePath, data, "utf8");
  console.error(`Export written to ${absolutePath}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(`Usage: node scripts/package-render.mjs [options]\n\n` +
      `Options:\n` +
      `  --format=<csv|json>     Output format (default csv).\n` +
      `  --fields=a,b,c          Comma-separated field list (default id,name,unit,ingredients).\n` +
      `  --category=<name>       Filter products by category.\n` +
      `  --out=<path>            Write output to a file.\n` +
      `  --delimiter=<char>      CSV delimiter (default comma).\n` +
      `  --pretty                Pretty-print JSON output.\n` +
      `  --no-header             Omit the header row when writing CSV.\n` +
      `  --help                  Show this message.\n`);
    return;
  }

  const filteredProducts = options.category
    ? products.filter((product) => product.category === options.category)
    : products;

  const records = buildRecords(filteredProducts, options.fields);

  let output;
  if (options.format === "json") {
    output = `${JSON.stringify(records, options.pretty ? 2 : 0)}\n`;
  } else {
    output = toCsv(records, options.fields, options.delimiter, options.includeHeader);
  }

  await writeOutput(output, options);

  console.error(`Processed ${records.length} product(s). Fields: ${options.fields.join(", ")}`);
}

main().catch((error) => {
  console.error("Failed to render packaging export:", error);
  process.exitCode = 1;
});
