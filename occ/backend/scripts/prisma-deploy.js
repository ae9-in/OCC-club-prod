const { spawnSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const backendRoot = path.resolve(__dirname, "..");
const migrationsDir = path.resolve(backendRoot, "prisma", "migrations");
const prismaCli = path.resolve(backendRoot, "node_modules", "prisma", "build", "index.js");

function runPrisma(args) {
  return spawnSync(process.execPath, [prismaCli, ...args], {
    cwd: backendRoot,
    stdio: "pipe"
  });
}

function writeOutput(result) {
  if (result.error) {
    process.stderr.write(`${result.error.message}\n`);
  }
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}

function listMigrationNames() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(migrationsDir, entry.name, "migration.sql")))
    .map((entry) => entry.name)
    .sort();
}

function baselineExistingDatabase() {
  const migrationNames = listMigrationNames();
  if (migrationNames.length === 0) {
    console.warn("No local migration SQL files were found to baseline.");
    return 1;
  }

  console.warn("Existing database has no Prisma migration history. Marking checked-in migrations as applied...");

  for (const migrationName of migrationNames) {
    const result = runPrisma(["migrate", "resolve", "--applied", migrationName]);
    writeOutput(result);
    if (result.status !== 0) {
      return result.status ?? 1;
    }
  }

  return 0;
}

const migrateResult = runPrisma(["migrate", "deploy"]);
writeOutput(migrateResult);

if (migrateResult.status === 0) {
  process.exit(0);
}

const stdout = migrateResult.stdout ? String(migrateResult.stdout) : "";
const stderr = migrateResult.stderr ? String(migrateResult.stderr) : "";
const combined = `${stdout}\n${stderr}`;

const shouldFallback =
  combined.includes("P3005") ||
  combined.includes("The database schema is not empty") ||
  combined.includes("No migration found in prisma/migrations");

if (!shouldFallback) {
  process.exit(migrateResult.status ?? 1);
}

const baselineStatus = baselineExistingDatabase();
if (baselineStatus !== 0) {
  process.exit(baselineStatus);
}

const retryResult = runPrisma(["migrate", "deploy"]);
writeOutput(retryResult);
process.exit(retryResult.status ?? 1);
