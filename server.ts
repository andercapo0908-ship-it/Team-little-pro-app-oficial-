import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/gemini/suggest-workout", async (req, res) => {
    try {
      const { goal, muscleGroup } = req.body;
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Sugira 3 nomes criativos e motivadores para um treino de personal trainer com foco em ${goal} para o grupo muscular ${muscleGroup}. Retorne apenas os nomes separados por vírgula.`,
      });
      const names = response.text?.split(',') || [];
      res.json({ names: names.map(n => n.trim()).filter(Boolean) });
    } catch (error: any) {
      console.error("Gemini Workout Suggestion Error:", error);
      res.status(500).json({ error: error.message, fallback: ["Treino Personalizado"] });
    }
  });

  app.post("/api/gemini/analyze-evolution", async (req, res) => {
    try {
      const { history } = req.body;
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analise a evolução deste aluno baseado nestes dados de peso e medidas: ${JSON.stringify(history)}. Retorne um resumo motivador em 3 frases.`,
      });
      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini Evolution Analysis Error:", error);
      res.status(500).json({ error: error.message, fallback: "Continue focado! Seus resultados virão com consistência." });
    }
  });

  app.post("/api/gemini/coach-chat", async (req, res) => {
    try {
      const { messages, profile } = req.body;
      const ai = getGeminiClient();
      
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `Você é o "Coach Little Pro AI", o assistente virtual inteligente e ultra-motivado do TEAM LITTLE PRO.
          Seu tom é: Energético, Profissional, Direto e levemente "hardcore" (estilo musculação de alta performance).
          Sua missão é:
          1. Sanar dúvidas técnicas sobre exercícios, biomecânica e nutrição.
          2. Motivar o atleta em momentos de desânimo.
          3. Sugerir ajustes baseados na filosofia Little Pro: Constância e Foco.
          
          Perceba que você está falando com ${profile?.name || "um atleta"} do time.
          Mantenha as respostas concisas, use emojis de academia e termine sempre com um grito de motivação curto como "FOCO!", "PRA CIMA!" ou "NO LIMITS!".
          Sempre fale em Português do Brasil.
          Se perguntarem sobre pagamentos ou problemas técnicos graves, peça para falarem com o coach humano no WhatsApp.`
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Coach Chat Error:", error);
      res.status(500).json({ error: error.message, fallback: "Ops! Deu um curto aqui no meu processador. Verifique sua conexão e tente novamente!" });
    }
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
