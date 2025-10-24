#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const logFilePath = path.join(rootDir, "logs", "agent-run.log");
const manifestPath = path.join(rootDir, "agents", "manifest.json");

function parseArgs(argv) {
  const options = {
    agentFilter: null,
    statusFilter: null,
    since: null,
    limit: 20,
    json: false,
    help: false,
    summary: false,
    summaryPath: null
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (arg === "--summary") {
      options.summary = true;
      continue;
    }

    if (arg.startsWith("--summary=")) {
      options.summary = true;
      const value = (arg.split("=")[1] ?? "").trim();
      if (value) {
        options.summaryPath = value;
      }
      continue;
    }

    if (arg.startsWith("--limit=")) {
      const value = Number.parseInt(arg.split("=")[1], 10);
      if (!Number.isFinite(value)) {
        throw new Error("--limit requires a numeric value");
      }
      options.limit = value;
      continue;
    }

    if (arg.startsWith("--agent=")) {
      const value = arg.split("=")[1] ?? "";
      const names = value
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      if (!names.length) {
        throw new Error("--agent requires at least one name");
      }
      options.agentFilter = new Map(
        names.map((name) => [name.toLowerCase(), name])
      );
      continue;
    }

    if (arg.startsWith("--status=")) {
      const value = arg.split("=")[1] ?? "";
      const statuses = value
        .split(",")
        .map((status) => status.trim().toLowerCase())
        .filter(Boolean);
      if (!statuses.length) {
        throw new Error("--status requires at least one status value");
      }
      options.statusFilter = new Set(statuses);
      continue;
    }

    if (arg.startsWith("--since=")) {
      const value = arg.split("=")[1] ?? "";
      if (!value) {
        throw new Error("--since requires a value");
      }
      options.since = parseSince(value);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function parseSince(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("--since requires a value");
  }

  const relativeMatch = trimmed.match(/^(\d+)([mhd])$/i);
  if (relativeMatch) {
    const amount = Number.parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2].toLowerCase();
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Invalid relative duration: ${value}`);
    }
    const unitMultipliers = {
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
    };
    return Date.now() - amount * unitMultipliers[unit];
  }

  const timestamp = Date.parse(trimmed);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid date for --since: ${value}`);
  }
  return timestamp;
}

async function readManifest() {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const data = JSON.parse(raw);
    if (data && Array.isArray(data.agents)) {
      return data.agents;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`[agent-report] Failed to read manifest: ${error.message}`);
    }
  }
  return [];
}

async function readLogEntries() {
  try {
    await fs.access(logFilePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const entries = [];
  const stream = createReadStream(logFilePath, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    try {
      const entry = JSON.parse(trimmed);
      entries.push(entry);
    } catch (error) {
      console.warn(`[agent-report] Skipping malformed log entry: ${error.message}`);
    }
  }

  return entries;
}

function parseTimestamp(value) {
  const timestamp = Date.parse(value ?? "");
  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatIso(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return "—";
  }
  try {
    return new Date(timestamp).toISOString();
  } catch {
    return "—";
  }
}

function formatDuration(value) {
  if (value === null || value === undefined) {
    return "—";
  }
  const duration = Number(value);
  if (!Number.isFinite(duration) || duration < 0) {
    return "—";
  }
  if (duration < 1000) {
    return `${Math.round(duration)} ms`;
  }
  const seconds = duration / 1000;
  if (seconds < 60) {
    const precision = seconds >= 10 ? 0 : 1;
    return `${seconds.toFixed(precision)} s`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    const precision = minutes >= 10 ? 0 : 1;
    return `${minutes.toFixed(precision)} min`;
  }
  const hours = minutes / 60;
  const precision = hours >= 10 ? 0 : 1;
  return `${hours.toFixed(precision)} h`;
}

function findAgentKey(summaryMap, candidate) {
  const target = candidate.toLowerCase();
  for (const key of summaryMap.keys()) {
    if (key.toLowerCase() === target) {
      return key;
    }
  }
  return null;
}

function ensureAgent(summaryMap, agentName, manifestMeta) {
  const existingKey = findAgentKey(summaryMap, agentName);
  if (existingKey) {
    const existing = summaryMap.get(existingKey);
    if (manifestMeta) {
      if (existing.manifestStatus === null || existing.manifestStatus === undefined) {
        existing.manifestStatus = manifestMeta.status ?? null;
      }
      if (!existing.configuredCommand && manifestMeta.command) {
        existing.configuredCommand = manifestMeta.command;
      }
    }
    return existing;
  }

  const summary = {
    agent: agentName,
    manifestStatus: manifestMeta?.status ?? null,
    configuredCommand: manifestMeta?.command ?? null,
    runs: 0,
    statusCounts: {},
    lastRun: null,
    lastStatus: null,
    lastNotes: "",
    lastCommand: manifestMeta?.command ?? null,
    durationMs: null
  };
  summaryMap.set(agentName, summary);
  return summary;
}

function buildSummary(entries, manifestAgents, options) {
  const summaryMap = new Map();
  const totals = {
    runs: entries.length,
    statusCounts: {}
  };

  const manifestByFilter = manifestAgents;
  for (const agent of manifestByFilter) {
    ensureAgent(summaryMap, agent.name, agent);
  }

  for (const entry of entries) {
    const agentName = typeof entry.agent === "string" && entry.agent.trim() ? entry.agent : "unknown";
    const statusKey = typeof entry.status === "string" && entry.status.trim()
      ? entry.status.toLowerCase()
      : "unknown";

    const agentSummary = ensureAgent(summaryMap, agentName, null);
    agentSummary.runs += 1;
    agentSummary.statusCounts[statusKey] = (agentSummary.statusCounts[statusKey] || 0) + 1;
    totals.statusCounts[statusKey] = (totals.statusCounts[statusKey] || 0) + 1;

    if (entry.command && !agentSummary.configuredCommand) {
      agentSummary.configuredCommand = entry.command;
    }

    const timestamp = parseTimestamp(entry.timestamp);
    if (timestamp !== null && (!agentSummary.lastRun || timestamp > agentSummary.lastRun)) {
      agentSummary.lastRun = timestamp;
      agentSummary.lastStatus = statusKey;
      agentSummary.lastNotes = typeof entry.notes === "string" ? entry.notes : "";
      agentSummary.lastCommand = entry.command || agentSummary.configuredCommand || null;
      agentSummary.durationMs = Number.isFinite(entry.duration_ms) ? entry.duration_ms : null;
    }
  }

  if (options.agentFilter) {
    for (const [lowerName, originalName] of options.agentFilter.entries()) {
      if (!findAgentKey(summaryMap, originalName)) {
        ensureAgent(summaryMap, originalName, null);
      }
    }
  }

  return {
    totals,
    perAgent: Array.from(summaryMap.values())
  };
}

function filterEntries(entries, options) {
  return entries.filter((entry) => {
    const agentName = typeof entry.agent === "string" ? entry.agent : "";
    const statusKey = typeof entry.status === "string" ? entry.status.toLowerCase() : "";
    const timestamp = parseTimestamp(entry.timestamp);

    if (options.agentFilter && agentName) {
      if (!options.agentFilter.has(agentName.toLowerCase())) {
        return false;
      }
    } else if (options.agentFilter && !agentName) {
      return false;
    }

    if (options.statusFilter && (!statusKey || !options.statusFilter.has(statusKey))) {
      return false;
    }

    if (options.since && (timestamp === null || timestamp < options.since)) {
      return false;
    }

    return true;
  });
}

function formatStatusKey(status) {
  if (!status) {
    return "unknown";
  }
  return status;
}

function formatSummaryRow(row, statusKeys) {
  const output = {
    Agent: row.agent,
    "Manifest status": row.manifestStatus ?? "—",
    Runs: row.runs,
    "Last status": row.lastStatus ? formatStatusKey(row.lastStatus) : "—",
    "Last run": row.lastRun ? formatIso(row.lastRun) : "—",
    "Last duration": formatDuration(row.durationMs),
    "Configured command": row.configuredCommand ?? "—"
  };

  for (const statusKey of statusKeys) {
    output[statusKey] = row.statusCounts[statusKey] ?? 0;
  }

  return output;
}

function formatRecentRow(entry) {
  return {
    Timestamp: entry.timestamp ?? "—",
    Agent: entry.agent ?? "unknown",
    Status: entry.status ?? "unknown",
    Duration: formatDuration(entry.duration_ms),
    Notes: entry.notes ?? "",
    Command: entry.command ?? ""
  };
}

function printSummary(summary) {
  const orderedStatusKeys = collectStatusKeys(summary);

  if (summary.perAgent.length) {
    const sortedRows = summary.perAgent
      .slice()
      .sort((a, b) => {
        const aTime = a.lastRun ?? 0;
        const bTime = b.lastRun ?? 0;
        if (aTime === bTime) {
          return a.agent.localeCompare(b.agent);
        }
        return bTime - aTime;
      });

    console.log("\nPer-agent snapshot:");
    console.table(sortedRows.map((row) => formatSummaryRow(row, orderedStatusKeys)));
  } else {
    console.log("\nNo agent entries matched the provided filters.");
  }

  if (summary.totals.statusCounts && Object.keys(summary.totals.statusCounts).length > 0) {
    console.log("\nOverall status counts:");
    const totalRows = Object.entries(summary.totals.statusCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([status, count]) => ({ Status: status, Runs: count }));
    console.table(totalRows);
  }
}

function printRecentEntries(entries, limit) {
  if (!entries.length) {
    console.log("\nNo log entries to display.");
    return;
  }

  const displayLimit = limit > 0 ? Math.min(limit, entries.length) : entries.length;
  const rows = entries.slice(0, displayLimit).map((entry) => formatRecentRow(entry));
  console.log(`\nRecent runs (showing ${displayLimit}${limit > 0 ? ` of ${entries.length}` : ""}):`);
  console.table(rows);
}

function collectStatusKeys(summary) {
  const statusKeys = new Set(Object.keys(summary.totals.statusCounts));
  for (const row of summary.perAgent) {
    Object.keys(row.statusCounts).forEach((key) => statusKeys.add(key));
  }
  return Array.from(statusKeys).sort();
}

async function writeSummaryMarkdown(summary, entries, options) {
  const statusKeys = collectStatusKeys(summary);
  const lines = [];
  lines.push("# AI Agent Status Report");
  lines.push("");

  const filters = [];
  if (options.agentFilter) {
    filters.push(`Agents: ${Array.from(options.agentFilter.values()).join(", ")}`);
  }
  if (options.statusFilter) {
    filters.push(`Statuses: ${Array.from(options.statusFilter).join(", ")}`);
  }
  if (options.since) {
    filters.push(`Since: ${new Date(options.since).toISOString()}`);
  }
  if (filters.length === 0) {
    filters.push("Agents: all");
  }

  lines.push("Generated on: " + new Date().toISOString());
  lines.push("Filters: " + filters.join(" · "));
  lines.push("");

  if (summary.perAgent.length) {
    lines.push("## Per-agent snapshot");
    const header = [
      "Agent",
      "Manifest status",
      "Runs",
      "Last status",
      "Last run",
      "Last duration",
      "Configured command"
    ].concat(statusKeys.map((status) => status || "unknown"));
    lines.push(`| ${header.join(" | ")} |`);
    lines.push(`| ${header.map(() => "---").join(" | ")} |`);

    const sortedRows = summary.perAgent
      .slice()
      .sort((a, b) => {
        const aTime = a.lastRun ?? 0;
        const bTime = b.lastRun ?? 0;
        if (aTime === bTime) {
          return a.agent.localeCompare(b.agent);
        }
        return bTime - aTime;
      });

    for (const row of sortedRows) {
      const cells = [
        row.agent,
        row.manifestStatus ?? "—",
        String(row.runs),
        row.lastStatus ? formatStatusKey(row.lastStatus) : "—",
        row.lastRun ? new Date(row.lastRun).toISOString() : "—",
        formatDuration(row.durationMs),
        row.configuredCommand ?? "—"
      ];

      for (const statusKey of statusKeys) {
        const value = row.statusCounts[statusKey] ?? 0;
        cells.push(String(value));
      }

      lines.push(`| ${cells.join(" | ")} |`);
    }
    lines.push("");
  } else {
    lines.push("No agent entries matched the provided filters.");
    lines.push("");
  }

  if (summary.totals.statusCounts && Object.keys(summary.totals.statusCounts).length > 0) {
    lines.push("## Overall status counts");
    lines.push("| Status | Runs |");
    lines.push("| --- | --- |");
    const totalRows = Object.entries(summary.totals.statusCounts)
      .sort((a, b) => b[1] - a[1]);
    for (const [status, count] of totalRows) {
      lines.push(`| ${status} | ${count} |`);
    }
    lines.push("");
  }

  const recentEntries = options.limit > 0 ? entries.slice(0, options.limit) : entries;
  if (recentEntries.length) {
    lines.push(`## Recent runs (showing ${recentEntries.length}${options.limit > 0 ? ` of ${entries.length}` : ""})`);
    lines.push("| Timestamp | Agent | Status | Duration | Notes | Command |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const entry of recentEntries) {
      lines.push(
        `| ${entry.timestamp ?? "—"} | ${entry.agent ?? "unknown"} | ${entry.status ?? "unknown"} | ${formatDuration(entry.duration_ms)} | ${entry.notes ?? ""} | ${entry.command ?? ""} |`
      );
    }
    lines.push("");
  }

  let targetPath = options.summaryPath;
  if (targetPath) {
    targetPath = path.isAbsolute(targetPath)
      ? targetPath
      : path.join(process.cwd(), targetPath);
  } else if (process.env.GITHUB_STEP_SUMMARY) {
    targetPath = process.env.GITHUB_STEP_SUMMARY;
  } else {
    targetPath = path.join(rootDir, "_state", "agent-status-summary.md");
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${lines.join("\n")}\n`, "utf8");
  const relative = path.relative(process.cwd(), targetPath) || targetPath;
  console.log(`[agent-report] Summary written to ${relative}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(`Usage: node ai/scripts/report-status.mjs [options]\n\n` +
      `Options:\n` +
      `  --agent=name[,name]   Limit to specific agent(s).\n` +
      `  --status=value[,v]    Filter by status (success, failed, dry-run, etc.).\n` +
      `  --since=<ISO|duration> Filter to runs after a date or relative duration (e.g., 24h, 7d).\n` +
      `  --limit=<number>      Number of recent runs to display (default 20).\n` +
      `  --json                Output JSON instead of formatted tables.\n` +
      `  --summary[=path]      Write a Markdown summary (uses GITHUB_STEP_SUMMARY or ai/_state by default).\n` +
      `  --help                Show this message.\n`);
    return;
  }

  const [manifestAgents, logEntries] = await Promise.all([
    readManifest(),
    readLogEntries()
  ]);

  const filteredManifest = options.agentFilter
    ? manifestAgents.filter((agent) => options.agentFilter.has(agent.name.toLowerCase()))
    : manifestAgents;

  const sortedEntries = logEntries
    .slice()
    .sort((a, b) => {
      const aTime = parseTimestamp(a.timestamp) ?? 0;
      const bTime = parseTimestamp(b.timestamp) ?? 0;
      return bTime - aTime;
    });

  const filteredEntries = filterEntries(sortedEntries, options);

  const summary = buildSummary(filteredEntries, filteredManifest, options);

  if (options.json) {
    const statusKeys = new Set(Object.keys(summary.totals.statusCounts));
    for (const row of summary.perAgent) {
      Object.keys(row.statusCounts).forEach((key) => statusKeys.add(key));
    }

    const jsonOutput = {
      filter: {
        agents: options.agentFilter ? Array.from(options.agentFilter.values()) : null,
        statuses: options.statusFilter ? Array.from(options.statusFilter) : null,
        since: options.since ? new Date(options.since).toISOString() : null,
        limit: options.limit
      },
      summary: {
        totals: summary.totals,
        statusKeys: Array.from(statusKeys).sort(),
        agents: summary.perAgent.map((row) => ({
          agent: row.agent,
          manifestStatus: row.manifestStatus ?? null,
          configuredCommand: row.configuredCommand ?? null,
          runs: row.runs,
          lastStatus: row.lastStatus ?? null,
          lastRun: row.lastRun ? new Date(row.lastRun).toISOString() : null,
          lastNotes: row.lastNotes ?? "",
          lastCommand: row.lastCommand ?? null,
          durationMs: Number.isFinite(row.durationMs) ? row.durationMs : null,
          statusCounts: row.statusCounts
        }))
      },
      entries: (options.limit > 0 ? filteredEntries.slice(0, options.limit) : filteredEntries).map((entry) => ({
        ...entry,
        timestamp: entry.timestamp ?? null
      }))
    };

    if (options.summary) {
      await writeSummaryMarkdown(summary, filteredEntries, options);
    }

    console.log(JSON.stringify(jsonOutput, null, 2));
    return;
  }

  if (!filteredEntries.length && !summary.perAgent.length) {
    if (manifestAgents.length === 0) {
      console.log("No agent manifest entries or log data found.");
    } else {
      console.log("No agent runs matched the provided filters.");
    }
    return;
  }

  printSummary(summary);
  printRecentEntries(filteredEntries, options.limit);

  if (options.summary) {
    await writeSummaryMarkdown(summary, filteredEntries, options);
  }
}

main().catch((error) => {
  console.error("Failed to generate agent status report:", error);
  process.exitCode = 1;
});
