import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import { seedDatabase } from "./seed";

// ─── Startup validation ───────────────────────────────────────────────────────
const REQUIRED_ENV = ["DATABASE_URL", "SESSION_SECRET", "SUPABASE_URL", "SUPABASE_SECRET_KEY"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// ─── App setup ────────────────────────────────────────────────────────────────
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger (API routes only)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
    }
  });
  next();
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
let bootstrapPromise: Promise<express.Express> | null = null;

async function bootstrap(): Promise<express.Express> {
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  // Seed only when explicitly requested
  if (process.env.SEED === "true") {
    try {
      await seedDatabase();
    } catch (err) {
      console.error("Seed error:", err);
    }
  }

  // Global error handler
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    const status = (err as any)?.status || (err as any)?.statusCode || 500;
    const message = (err as any)?.message || "Internal Server Error";
    console.error("Unhandled error:", err);
    res.status(status).json({ message });
  });

  // Serve static files in production (Vercel serves them directly, this is for Railway fallback)
  if (process.env.NODE_ENV === "production" && process.env.VERCEL !== "1") {
    const { serveStatic } = await import("./static");
    serveStatic(app);
  }

  return app;
}

// ─── Vercel export ────────────────────────────────────────────────────────────
// Vercel calls this function for every request.
// We lazily bootstrap once and reuse across warm invocations.
export default async function handler(req: Request, res: Response) {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  const expressApp = await bootstrapPromise;
  expressApp(req, res);
}

// ─── Traditional server (Railway / local dev) ─────────────────────────────────
if (process.env.VERCEL !== "1") {
  bootstrap().then(() => {
    // Dev mode: use Vite middleware
    if (process.env.NODE_ENV !== "production") {
      import("./vite").then(({ setupVite }) => {
        const httpServer = createServer(app);
        setupVite(httpServer, app).then(() => {
          const port = parseInt(process.env.PORT || "5000", 10);
          httpServer.listen({ port, host: "0.0.0.0" }, () => {
            console.log(`Dev server running on http://localhost:${port}`);
          });
        });
      });
    } else {
      const { serveStatic } = require("./static");
      serveStatic(app);
      const port = parseInt(process.env.PORT || "5000", 10);
      createServer(app).listen({ port, host: "0.0.0.0" }, () => {
        console.log(`Production server running on port ${port}`);
      });
    }
  });
}
