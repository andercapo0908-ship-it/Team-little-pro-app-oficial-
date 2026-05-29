import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Explicit PWA routes to ensure correct mime-types and prevent SPA HTML fallback redirects
  app.get("/manifest.json", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = path.join(process.cwd(), isProd ? 'dist' : 'public', 'manifest.json');
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.sendFile(filePath);
  });

  app.get("/sw.js", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = path.join(process.cwd(), isProd ? 'dist' : 'public', 'sw.js');
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.sendFile(filePath);
  });

  app.get("/app_icon.png", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = path.join(process.cwd(), isProd ? 'dist' : 'public', 'app_icon.png');
    res.sendFile(filePath);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
