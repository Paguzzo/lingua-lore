// Carregar variáveis de ambiente primeiro
import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { MemoryStorage } from "./memory-storage";
import { seedMemoryStorage } from "./memory-seed";
import { emailService } from "./email-service";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
  // Initialize storage with default data
  if (storage instanceof MemoryStorage) {
    await seedMemoryStorage(storage);
  }

  // Initialize email service
  try {
    await emailService.initialize();
  } catch (error) {
    console.error('Failed to initialize email service:', error);
  }

  const server = await registerRoutes(app);

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
  const port = parseInt(process.env.PORT || "3004", 10);
  server.listen(port, "localhost", () => {
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
      
      // Adiciona middleware para lidar com rotas do React Router
      // Este middleware deve ser adicionado APÓS todas as outras rotas
      app.get('*', (req, res, next) => {
        // Se for uma rota de API, deixa passar para os handlers específicos
        if (req.path.startsWith('/api')) {
          return next();
        }
        
        // Para todas as outras rotas, serve o index.html para o React Router lidar
        // Em desenvolvimento, usamos o arquivo index.html na raiz do cliente
        const indexPath = path.resolve(process.cwd(), 'client/index.html');
          
        // Verifica se o arquivo existe antes de tentar enviá-lo
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        } else {
          console.error(`Arquivo não encontrado: ${indexPath}`);
          return res.status(500).send('Erro interno do servidor: arquivo index.html não encontrado');
        }
      });
      
    } catch (e: any) {
      console.error("Failed to initialize frontend middleware:", e);
      // Fallback: minimal online page so the preview can connect
      app.use("*", (_req, res) => {
        res.status(200).set({ "Content-Type": "text/html" }).end(`<!doctype html><html><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><title>Server Online</title><link rel=\"canonical\" href=\"/\" /></head><body style=\"font-family:system-ui;padding:24px\"><main><h1>Server online</h1><p>Frontend build is not available yet. Health: <a href=\"/healthz\">/healthz</a></p></main></body></html>`);
      });
    }
  })();
})();