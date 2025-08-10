import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import react from "@vitejs/plugin-react";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
  };

  const rootDir = path.resolve(__dirname, "..", "client");

  const vite = await createViteServer({
    root: rootDir,
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "..", "client", "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
        "@assets": path.resolve(__dirname, "..", "attached_assets"),
      },
    },
    configFile: false,
    customLogger: {
      ...viteLogger,
      // Don't kill the process on error; surface it in logs so preview can report it
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    log(`Serving static assets from ${distPath}`);
    return;
  }

  log(`No build found at ${distPath}. Using minimal fallback until a build is created.`);
  // Minimal fallback page to keep preview alive
  app.use("*", (_req, res) => {
    res
      .status(200)
      .set({ "Content-Type": "text/html" })
      .end(`<!doctype html><html lang=\"pt-br\"><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><title>Servidor online</title><meta name=\"description\" content=\"Servidor online aguardando build do cliente\"><link rel=\"canonical\" href=\"/\" /></head><body style=\"font-family:system-ui;padding:24px\"><main><h1>Servidor online</h1><p>Build do frontend não encontrado. Tente novamente em instantes.</p><p>Saúde: <a href=\"/healthz\">/healthz</a></p></main></body></html>`);
  });
}
