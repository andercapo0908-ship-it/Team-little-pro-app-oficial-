import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GeminiService = {
  async suggestWorkoutName(goal: string, muscleGroup: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Sugira 3 nomes criativos e motivadores para um treino de personal trainer com foco em ${goal} para o grupo muscular ${muscleGroup}. Retorne apenas os nomes separados por vírgula.`,
      });
      return response.text?.split(',') || [];
    } catch (error) {
      console.error("Gemini Error:", error);
      return ["Treino Personalizado"];
    }
  },

  async analyzeEvolution(history: any[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analise a evolução deste aluno baseado nestes dados de peso e medidas: ${JSON.stringify(history)}. Retorne um resumo motivador em 3 frases.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Continue focado! Seus resultados virão com consistência.";
    }
  }
};
