#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalRemoteIdentity } from "./log-metadata.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const portfolioRoot = path.resolve(path.dirname(scriptPath), "..");
const sourceCwd = process.env.PWD || process.cwd();

const args = process.argv.slice(2);
const noEdit = args.includes("--no-edit");
const titleArgs = args.filter((arg) => arg !== "--no-edit");

function shell(command, commandArgs, cwd) {
  try {
    return execFileSync(command, commandArgs, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

function readJson(filePath) {
  if (!existsSync(filePath)) return null;

  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleCase(value) {
  return value
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function yamlString(value) {
  return JSON.stringify(value);
}

function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function today() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Phoenix",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(new Date());
}

const gitRoot = shell("git", ["rev-parse", "--show-toplevel"], sourceCwd) || sourceCwd;
const repoPackage = readJson(path.join(gitRoot, "package.json"));
const repoName = repoPackage?.name || path.basename(gitRoot);
const repoTitle = titleCase(repoName.replace(/^@[^/]+\//, ""));
const remoteUrl = shell("git", ["config", "--get", "remote.origin.url"], gitRoot);
const remoteIdentity = canonicalRemoteIdentity(remoteUrl);
const currentBranch = shell("git", ["branch", "--show-current"], gitRoot);
const currentCommit = shell("git", ["rev-parse", "--short", "HEAD"], gitRoot);
const date = today();
const title = titleArgs.length > 0 ? titleArgs.join(" ") : `${repoTitle} Log`;
const slug = `${date}-${slugify(title) || "log"}`;
const draftDir = path.join(portfolioRoot, ".log-drafts", slug);
const attachmentDir = path.join(draftDir, "attachments");
const notePath = path.join(draftDir, `${slug}.md`);
const publicAttachmentPath = `/attachments/logs/${slug}/`;

if (existsSync(notePath)) {
  console.error(`Log already exists: ${notePath}`);
  process.exit(1);
}

mkdirSync(draftDir, { recursive: true });
mkdirSync(attachmentDir, { recursive: true });

const frontmatter = [
  "---",
  `title: ${yamlString(title)}`,
  `date: ${date}`,
  `project: ${yamlString(repoTitle)}`,
  `repo: ${yamlString(repoName)}`,
  remoteIdentity ? `remote: ${yamlString(remoteIdentity)}` : null,
  currentBranch ? `branch: ${yamlString(currentBranch)}` : null,
  currentCommit ? `commit: ${yamlString(currentCommit)}` : null,
  "tags: []",
  "summary: \"\"",
  "draft: true",
  `attachmentDir: ${yamlString(publicAttachmentPath)}`,
  "attachments: []",
  "---"
].filter(Boolean);

const body = [
  "",
  "## Context",
  "",
  "- ",
  "",
  "## Log",
  "",
  "- ",
  "",
  "## Artifacts",
  "",
  `- Add files to \`attachments/\`; after review, move them to \`public${publicAttachmentPath}\` and reference them from \`${publicAttachmentPath}\`.`,
  ""
];

writeFileSync(notePath, `${frontmatter.join("\n")}\n${body.join("\n")}`, "utf8");

console.log(`Created ${notePath}`);
console.log(`Attachments ${attachmentDir}`);
console.log("Review the draft before moving it into tracked content.");

if (!noEdit) {
  const editor = process.env.VISUAL || process.env.EDITOR || "nvim";
  const result = spawnSync(`${editor} ${shellQuote(notePath)}`, {
    shell: true,
    stdio: "inherit"
  });
  process.exit(result.status ?? 0);
}
