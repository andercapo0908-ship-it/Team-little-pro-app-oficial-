export const GeminiService = {
  async suggestWorkoutName(goal: string, muscleGroup: string): Promise<string[]> {
    try {
      const response = await fetch("/api/gemini/suggest-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, muscleGroup }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.names || ["Treino Personalizado"];
    } catch (error) {
      console.error("Gemini Service Client Error:", error);
      return ["Treino Personalizado"];
    }
  },

  async analyzeEvolution(history: any[]): Promise<string> {
    try {
      const response = await fetch("/api/gemini/analyze-evolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.analysis || "Continue focado! Seus resultados virão com consistência.";
    } catch (error) {
      console.error("Gemini Service Client Error:", error);
      return "Continue focado! Seus resultados virão com consistência.";
    }
  }
};
