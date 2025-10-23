import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

async function ensureDirectories() {
  const folders = ["logs", "_state"];

  await Promise.all(
    folders.map((folder) => fs.mkdir(path.join(rootDir, folder), { recursive: true }))
  );
}

async function readConfig() {
  const configPath = path.join(rootDir, "site-config.json");
  const raw = await fs.readFile(configPath, "utf8");
  return JSON.parse(raw);
}

try {
  await ensureDirectories();
  const config = await readConfig();

  console.log("AI kit bootstrapped for", config.project_name);
  console.log("Repository:", config.repository?.url ?? "<unknown>");
  console.log("Primary build command:", config.build?.command ?? "npm run build");
} catch (error) {
  console.error("Failed to bootstrap AI kit:", error);
  process.exitCode = 1;
}
