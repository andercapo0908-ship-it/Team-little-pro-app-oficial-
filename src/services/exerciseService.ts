import { LibraryExercise } from "../types";

export interface ExerciseStat {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  sets: number;
  date: string;
}

// Local cache key
const EXERCISES_CACHE_KEY = "academic_exercises_cache";
const FAVORITES_CACHE_KEY = "academic_exercises_favorites";
const STATS_CACHE_KEY = "academic_exercises_stats";

export const exerciseService = {
  // Get and set exercises cache
  getCachedExercises(): LibraryExercise[] {
    try {
      const data = localStorage.getItem(EXERCISES_CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao ler cache de exercícios:", e);
      return [];
    }
  },

  setCachedExercises(exercises: LibraryExercise[]): void {
    try {
      localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exercises));
    } catch (e) {
      console.error("Erro ao salvar cache de exercícios:", e);
    }
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao obter favoritos:", e);
      return [];
    }
  },

  saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(FAVORITES_CACHE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Erro ao salvar favoritos:", e);
    }
  },

  // Stats
  getStats(): ExerciseStat[] {
    try {
      const data = localStorage.getItem(STATS_CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao ler estatísticas:", e);
      return [];
    }
  },

  getStatsByExercise(exerciseId: string): ExerciseStat[] {
    const all = this.getStats();
    return all.filter(s => s.exerciseId === exerciseId || s.exerciseName.toLowerCase() === exerciseId.toLowerCase());
  },

  saveStat(stat: Omit<ExerciseStat, "id" | "date">): ExerciseStat {
    const all = this.getStats();
    const newStat: ExerciseStat = {
      ...stat,
      id: "stat_" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0]
    };
    all.push(newStat);
    try {
      localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error("Erro ao salvar estatística:", e);
    }
    return newStat;
  },

  deleteStat(id: string): void {
    const all = this.getStats();
    const filtered = all.filter(s => s.id !== id);
    try {
      localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Erro ao deletar estatística:", e);
    }
  }
};
