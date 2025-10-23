import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const logDir = path.join(rootDir, "logs");
const logFile = path.join(logDir, "agent-run.log");

async function appendLogEntry() {
  await fs.mkdir(logDir, { recursive: true });

  const entry = {
    timestamp: new Date().toISOString(),
    agent: process.env.AI_AGENT ?? "unknown",
    status: process.env.AI_AGENT_STATUS ?? "unspecified",
    run_id: process.env.GITHUB_RUN_ID ?? null,
    workflow: process.env.GITHUB_WORKFLOW ?? null
  };

  await fs.appendFile(logFile, `${JSON.stringify(entry)}\n`, "utf8");
  console.log(`Logged agent run for ${entry.agent} -> ${logFile}`);
}

appendLogEntry().catch((error) => {
  console.error("Failed to write agent run log:", error);
  process.exitCode = 1;
});
