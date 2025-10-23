#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const manifestPath = path.join(rootDir, "agents", "manifest.json");
const logDir = path.join(rootDir, "logs");
const logFile = path.join(logDir, "agent-run.log");

function parseArgs(argv) {
  const options = {
    agent: process.env.AI_AGENT ?? "all",
    execute: (process.env.AI_AGENT_EXECUTE ?? "false").toLowerCase() === "true",
    listOnly: false,
    help: false
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--list") {
      options.listOnly = true;
      continue;
    }

    if (arg === "--execute") {
      options.execute = true;
      continue;
    }

    if (arg.startsWith("--agent=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("--agent requires a value");
      }
      options.agent = value;
      continue;
    }

    if (!arg.startsWith("--") && options.agent === "all") {
      options.agent = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  options.agent = options.agent.trim() || "all";
  return options;
}

async function loadManifest() {
  const raw = await fs.readFile(manifestPath, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.agents)) {
    throw new Error("Manifest must include an `agents` array");
  }
  return data.agents;
}

function selectAgents(agents, agentExpression) {
  if (agentExpression === "all") {
    return agents.filter((agent) => agent.status !== "disabled");
  }

  const requestedNames = agentExpression
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (requestedNames.length === 0) {
    throw new Error("No agent names provided");
  }

  const byName = new Map(agents.map((agent) => [agent.name, agent]));
  const selected = [];

  for (const name of requestedNames) {
    if (!byName.has(name)) {
      throw new Error(`Unknown agent: ${name}`);
    }
    selected.push(byName.get(name));
  }

  return selected;
}

async function runCommand(agent, command) {
  const cwd = path.isAbsolute(agent.working_directory ?? "")
    ? agent.working_directory
    : path.join(rootDir, agent.working_directory ?? ".");

  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
  });
}

async function appendLog(entry) {
  await fs.mkdir(logDir, { recursive: true });
  await fs.appendFile(logFile, `${JSON.stringify(entry)}\n`, "utf8");
}

function describeAgent(agent) {
  return {
    name: agent.name,
    status: agent.status,
    command: agent.command,
    triggers: agent.triggers ?? []
  };
}

async function listAgents(agents) {
  const table = agents.map((agent) => describeAgent(agent));
  console.table(table);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(`Usage: node ai/scripts/run-agent.mjs [options]\n\n` +
      `Options:\n` +
      `  --agent=name[,name]  Agent(s) to run (default all active).\n` +
      `  --execute            Run the configured commands instead of dry-run logging.\n` +
      `  --list               List available agents and exit.\n` +
      `  --help               Show this message.\n`);
    return;
  }

  const agents = await loadManifest();

  if (options.listOnly) {
    await listAgents(agents);
    return;
  }

  const selectedAgents = selectAgents(agents, options.agent);
  if (selectedAgents.length === 0) {
    console.log("No agents selected.");
    return;
  }

  console.log(`Running ${selectedAgents.length} agent(s) -> ${selectedAgents.map((agent) => agent.name).join(", ")}`);
  if (!options.execute) {
    console.log("Dry run mode: set --execute or AI_AGENT_EXECUTE=true to run commands.\n");
  }

  let failures = 0;

  for (const agent of selectedAgents) {
    const start = Date.now();
    let status = "skipped";
    let notes = "";

    const command = typeof agent.command === "string" && agent.command.trim() !== ""
      ? agent.command.trim()
      : null;

    if (agent.status === "disabled") {
      notes = "Agent disabled";
    } else if (!command) {
      notes = "No command configured";
    } else if (agent.status !== "active") {
      notes = `Agent status is '${agent.status}' (skipping)`;
    } else if (!options.execute) {
      status = "dry-run";
      notes = "Command not executed (dry run)";
    } else {
      try {
        console.log(`\n→ Executing ${agent.name}: ${command}`);
        await runCommand(agent, command);
        status = "success";
        notes = "Command completed";
      } catch (error) {
        status = "failed";
        notes = error.message;
        failures += 1;
      }
    }

    if (status === "skipped" && !notes) {
      notes = "Skipped due to configuration";
    }

    const entry = {
      timestamp: new Date().toISOString(),
      agent: agent.name,
      requested: options.agent,
      status,
      command,
      executed: status === "success",
      duration_ms: Date.now() - start,
      notes
    };

    await appendLog(entry);

    console.log(`Status for ${agent.name}: ${status}${notes ? ` (${notes})` : ""}`);
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Failed to run agents:", error);
  process.exitCode = 1;
});
