import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { MemoryStorage } from "./memory-storage";
import { seedMemoryStorage } from "./memory-seed";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Lightweight health endpoint for uptime checks
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

(async () => {
  // Initialize in-memory storage with default data
  const memoryStorage = new MemoryStorage();
  await seedMemoryStorage(memoryStorage);

  const server = await registerRoutes(app, memoryStorage);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('[error]', err);
    res.status(status).json({ message });
    // Do not throw to keep the server alive
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // Start listening immediately so the preview can connect
  const port = 5000;
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });

  // Initialize frontend middleware (Vite in dev, static in prod) without blocking server startup
  const env = app.get("env");
  log(`Environment: ${env}`);
  (async () => {
    try {
      if (env === "development") {
        await setupVite(app, server);
        log("Vite dev middleware initialized", "vite");
      } else {
        serveStatic(app);
        log("Static serving initialized", "express");
      }
    } catch (e: any) {
      console.error("Failed to initialize frontend middleware:", e);
      // Fallback: minimal online page so the preview can connect
      app.use("*", (_req, res) => {
        res.status(200).set({ "Content-Type": "text/html" }).end(`<!doctype html><html><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><title>Server Online</title><link rel=\"canonical\" href=\"/\" /></head><body style=\"font-family:system-ui;padding:24px\"><main><h1>Server online</h1><p>Frontend build is not available yet. Health: <a href=\"/healthz\">/healthz</a></p></main></body></html>`);
      });
    }
  })();
})();