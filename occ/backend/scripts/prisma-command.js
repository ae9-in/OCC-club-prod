const { spawnSync } = require("node:child_process");
const path = require("node:path");

const args = process.argv.slice(2);
const isDeploy = args[0] === "deploy";

if (isDeploy) {
  // Redirect 'prisma deploy' to our safe deploy script
  const result = spawnSync("node", [path.resolve(__dirname, "prisma-deploy.js")], {
    stdio: "inherit",
    shell: true
  });
  process.exit(result.status ?? 0);
} else {
  // Pass through other prisma commands
  const prismaBin = path.resolve(__dirname, "..", "node_modules", ".bin", process.platform === "win32" ? "prisma.cmd" : "prisma");
  const result = spawnSync(prismaBin, args, {
    stdio: "inherit",
    shell: true
  });
  process.exit(result.status ?? 0);
}
