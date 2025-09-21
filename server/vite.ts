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
  
  // Rota catch-all para lidar com navegação do React Router em desenvolvimento
  app.get("*", (req, res, next) => {
    const isApiRequest = req.path.startsWith("/api");
    const isStaticAsset = req.path.startsWith("/assets/") || req.path.match(/\.[a-zA-Z0-9]{2,4}$/);

    // Deixa passar requisições de API ou de assets estáticos
    if (isApiRequest || isStaticAsset) {
      return next();
    }

    // Para as demais rotas, serve o index.html da pasta client (sem necessidade de build)
    const indexPath = path.resolve(__dirname, "..", "client", "index.html");
    return res.sendFile(indexPath);
  });
  
  // Rota específica para a API em ambiente de desenvolvimento
  app.use("/api/*", (req, res, next) => {
    if (!req.route) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    next();
  });
  
  // Todas as outras rotas vão para o index.html para o React Router lidar
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
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  const clientPath = path.resolve(__dirname, "..", "client");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Adiciona rota para lidar com todas as requisições não-API em produção
    app.get('*', (req, res, next) => {
      // Se for uma rota de API, deixa passar para os handlers específicos
      if (req.path.startsWith('/api')) {
        return next();
      }
      
      // Para todas as outras rotas, serve o index.html para o React Router lidar
      const indexPath = path.resolve(clientPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      } else {
        console.error(`Arquivo não encontrado: ${indexPath}`);
        return res.status(500).send('Erro interno do servidor: arquivo index.html não encontrado');
      }
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
