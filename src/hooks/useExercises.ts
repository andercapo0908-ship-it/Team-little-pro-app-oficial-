import { useState, useEffect, useMemo } from "react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { LibraryExercise } from "../types";
import { exerciseService } from "../services/exerciseService";
import { translateTerm } from "../utils/translations";

export function useExercises() {
  const [exercises, setExercises] = useState<LibraryExercise[]>(() => {
    return exerciseService.getCachedExercises();
  });
  const [loading, setLoading] = useState(exercises.length === 0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    return exerciseService.getFavorites();
  });

  useEffect(() => {
    const q = query(collection(db, "exercises"), orderBy("name", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => {
          const ex = d.data() as LibraryExercise;
          // Apply automatic translation fallback for target group / equipment if needed
          return {
            ...ex,
            id: d.id,
            muscleGroup: translateTerm(ex.muscleGroup),
            equipment: translateTerm(ex.equipment)
          };
        });
        setExercises(data);
        exerciseService.setCachedExercises(data);
        setLoading(false);
      },
      (err) => {
        console.error("Exercises sync error in hook:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const toggleFavorite = (exerciseId: string) => {
    const updated = favorites.includes(exerciseId)
      ? favorites.filter((id) => id !== exerciseId)
      : [...favorites, exerciseId];
    setFavorites(updated);
    exerciseService.saveFavorites(updated);
  };

  // Precomputed search index for instant searching
  const searchIndex = useMemo(() => {
    return exercises.map((ex) => ({
      ...ex,
      searchText: `${ex.name} ${ex.muscleGroup} ${ex.equipment} ${ex.difficulty} ${ex.description || ""}`.toLowerCase(),
      isFavorite: favorites.includes(ex.id)
    }));
  }, [exercises, favorites]);

  return {
    exercises,
    searchIndex,
    loading,
    favorites,
    toggleFavorite,
    isFavorite: (exerciseId: string) => favorites.includes(exerciseId)
  };
}
