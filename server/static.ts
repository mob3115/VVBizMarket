import express, { type Express } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Works in both ESM (import.meta.dirname) and CJS (__dirname after esbuild)
const dir = typeof __dirname !== "undefined"
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: Express) {
  // In the compiled output, static files are at dist/public
  // __dirname in the CJS bundle will be dist/, so public is dist/public
  const distPath = path.resolve(dir, "public");

  if (!fs.existsSync(distPath)) {
    console.warn(`Static files not found at ${distPath} — skipping static serve`);
    return;
  }

  app.use(express.static(distPath, { maxAge: "1y", etag: true }));

  // SPA fallback — all non-API routes serve index.html
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
