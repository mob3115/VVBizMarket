import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Packages to bundle INTO the server output (not externalized)
// Everything else is treated as external and must be in node_modules
const BUNDLE_INCLUDE = [
  "@supabase/supabase-js",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "memorystore",
  "pg",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  // Clean dist
  await rm(path.join(root, "dist"), { recursive: true, force: true });

  // 1. Build client (Vite)
  console.log("▶ Building client...");
  await viteBuild();
  console.log("✓ Client built");

  // 2. Build server (esbuild → CJS for Vercel)
  console.log("▶ Building server...");
  const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !BUNDLE_INCLUDE.includes(dep));

  await esbuild({
    entryPoints: [path.join(root, "server/index.ts")],
    platform: "node",
    target: "node18",
    bundle: true,
    format: "cjs",
    outfile: path.join(root, "dist/index.cjs"),
    external: externals,
    define: {
      "import.meta.dirname": "__dirname",
      "import.meta.url": JSON.stringify("file:///app/server/index.ts"),
    },
    minify: false, // Keep readable for easier debugging
    logLevel: "info",
  });
  console.log("✓ Server built");
}

buildAll().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
