export const TRANSLATION_MAP: Record<string, string> = {
  // Muscle Groups
  chest: "Peitoral",
  back: "Costas",
  shoulders: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  quadriceps: "Quadríceps",
  hamstrings: "Posterior",
  glutes: "Glúteo",
  calves: "Panturrilhas",
  abs: "Abdômen",
  core: "Abdômen",
  cardio: "Cardio",

  // Equipments
  dumbbell: "Halteres",
  barbell: "Barra",
  machine: "Máquina",
  cable: "Polia",
  bodyweight: "Peso do Corpo",
  band: "Elástico",
  kettlebell: "Kettlebell",

  // Difficulties
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  pro: "PRO ELITE"
};

export function translateTerm(term: string): string {
  if (!term) return term;
  const normalized = term.toLowerCase().trim();
  return TRANSLATION_MAP[normalized] || term;
}
