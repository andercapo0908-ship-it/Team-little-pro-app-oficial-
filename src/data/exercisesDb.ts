// Biblioteca de Exercícios Completa do Team Little
// Organizada em 11 categorias principais representando 179 exercícios profissionais.
// Inclui dados biomecânicos detalhados, metas de execução e dicas por exercício.

export interface ExerciseDetails {
  id: string;
  name: string;
  muscleGroup: string;
  subGroup?: string;
  equipment: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  videoUrl: string;
  description: string;
  primaryTarget: string;
  secondaryTargets: string[];
  recommendedSets: number;
  recommendedReps: string;
  recommendedRest: string;
  commonErrors: string[];
  technicalTips: string[];
  variations: string[];
  relatedExercises: string[];
  contraindications: string[];
  tempo: string;
  breathing: string;
  
  // Premium properties
  youtubeUrl: string;
  caloriesBurned: number;
  muscleMap: string;
  trainerNotes: string[];
  exerciseDuration: string;
  timerEnabled: boolean;
  voiceInstructions: boolean;
  audioGuide: string;
}

// Raw list definition for compact and token-saving structure
const RAW_EXERCISES_DATA: { name: string; group: string; sub?: string; equip: string; diff: "Iniciante" | "Intermediário" | "Avançado" }[] = [
  // --- PEITO (15) ---
  { name: "Supino Reto Barra", group: "Peito", equip: "Barra", diff: "Intermediário" },
  { name: "Supino Inclinado Barra", group: "Peito", equip: "Barra", diff: "Intermediário" },
  { name: "Supino Declinado Barra", group: "Peito", equip: "Barra", diff: "Intermediário" },
  { name: "Supino Reto Halteres", group: "Peito", equip: "Halteres", diff: "Iniciante" },
  { name: "Supino Inclinado Halteres", group: "Peito", equip: "Halteres", diff: "Intermediário" },
  { name: "Crucifixo Reto", group: "Peito", equip: "Halteres", diff: "Iniciante" },
  { name: "Crucifixo Inclinado", group: "Peito", equip: "Halteres", diff: "Intermediário" },
  { name: "Crossover Alto", group: "Peito", equip: "Polia", diff: "Intermediário" },
  { name: "Crossover Médio", group: "Peito", equip: "Polia", diff: "Intermediário" },
  { name: "Crossover Baixo", group: "Peito", equip: "Polia", diff: "Avançado" },
  { name: "Peck Deck", group: "Peito", equip: "Máquina", diff: "Iniciante" },
  { name: "Flexão Tradicional", group: "Peito", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Flexão Aberta", group: "Peito", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Flexão Inclinada", group: "Peito", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Flexão Explosiva", group: "Peito", equip: "Peso do Corpo", diff: "Avançado" },

  // --- COSTAS (20) ---
  { name: "Puxada Frontal", group: "Costas", equip: "Polia", diff: "Iniciante" },
  { name: "Puxada Aberta", group: "Costas", equip: "Polia", diff: "Iniciante" },
  { name: "Puxada Fechada", group: "Costas", equip: "Polia", diff: "Iniciante" },
  { name: "Pulldown", group: "Costas", equip: "Polia", diff: "Intermediário" },
  { name: "Barra Fixa", group: "Costas", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Barra Fixa Supinada", group: "Costas", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Remada Curvada", group: "Costas", equip: "Barra", diff: "Intermediário" },
  { name: "Remada Cavalinho", group: "Costas", equip: "Barra", diff: "Intermediário" },
  { name: "Remada Baixa", group: "Costas", equip: "Polia", diff: "Iniciante" },
  { name: "Remada Unilateral", group: "Costas", equip: "Halteres", diff: "Iniciante" },
  { name: "Remada Máquina", group: "Costas", equip: "Máquina", diff: "Iniciante" },
  { name: "Remada T-Bar", group: "Costas", equip: "Máquina", diff: "Intermediário" },
  { name: "Levantamento Terra", group: "Costas", equip: "Barra", diff: "Avançado" },
  { name: "Terra Romeno", group: "Costas", equip: "Barra", diff: "Intermediário" },
  { name: "Pullover", group: "Costas", equip: "Halteres", diff: "Intermediário" },
  { name: "Rack Pull", group: "Costas", equip: "Barra", diff: "Avançado" },
  { name: "Remada Pronada", group: "Costas", equip: "Halteres", diff: "Iniciante" },
  { name: "Remada Neutra", group: "Costas", equip: "Polia", diff: "Iniciante" },
  { name: "Pull-up", group: "Costas", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Chin-up", group: "Costas", equip: "Peso do Corpo", diff: "Avançado" },

  // --- BÍCEPS (12) ---
  { name: "Rosca Direta", group: "Bíceps", equip: "Barra", diff: "Iniciante" },
  { name: "Rosca Alternada", group: "Bíceps", equip: "Halteres", diff: "Iniciante" },
  { name: "Rosca Martelo", group: "Bíceps", equip: "Halteres", diff: "Iniciante" },
  { name: "Rosca Scott", group: "Bíceps", equip: "Barra", diff: "Intermediário" },
  { name: "Rosca Concentrada", group: "Bíceps", equip: "Halteres", diff: "Iniciante" },
  { name: "Rosca Inversa", group: "Bíceps", equip: "Barra", diff: "Intermediário" },
  { name: "Rosca Spider", group: "Bíceps", equip: "Barra", diff: "Avançado" },
  { name: "Rosca 21", group: "Bíceps", equip: "Barra", diff: "Intermediário" },
  { name: "Rosca Polia", group: "Bíceps", equip: "Polia", diff: "Iniciante" },
  { name: "Rosca Banco Inclinado", group: "Bíceps", equip: "Halteres", diff: "Intermediário" },
  { name: "Rosca Cross Body", group: "Bíceps", equip: "Halteres", diff: "Intermediário" },
  { name: "Rosca Máquina", group: "Bíceps", equip: "Máquina", diff: "Iniciante" },

  // --- TRÍCEPS (12) ---
  { name: "Tríceps Pulley", group: "Tríceps", equip: "Polia", diff: "Iniciante" },
  { name: "Tríceps Corda", group: "Tríceps", equip: "Polia", diff: "Iniciante" },
  { name: "Tríceps Barra", group: "Tríceps", equip: "Polia", diff: "Iniciante" },
  { name: "Tríceps Francês", group: "Tríceps", equip: "Halteres", diff: "Intermediário" },
  { name: "Tríceps Testa", group: "Tríceps", equip: "Barra", diff: "Intermediário" },
  { name: "Tríceps Coice", group: "Tríceps", equip: "Halteres", diff: "Intermediário" },
  { name: "Paralelas", group: "Tríceps", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Mergulho Banco", group: "Tríceps", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Tríceps Máquina", group: "Tríceps", equip: "Máquina", diff: "Iniciante" },
  { name: "Tríceps Unilateral", group: "Tríceps", equip: "Polia", diff: "Intermediário" },
  { name: "Extensão Acima da Cabeça", group: "Tríceps", equip: "Polia", diff: "Intermediário" },
  { name: "Tríceps Invertido", group: "Tríceps", equip: "Polia", diff: "Iniciante" },

  // --- OMBROS (15) ---
  { name: "Desenvolvimento Militar", group: "Ombros", equip: "Barra", diff: "Intermediário" },
  { name: "Desenvolvimento Halteres", group: "Ombros", equip: "Halteres", diff: "Intermediário" },
  { name: "Arnold Press", group: "Ombros", equip: "Halteres", diff: "Avançado" },
  { name: "Elevação Lateral", group: "Ombros", equip: "Halteres", diff: "Iniciante" },
  { name: "Elevação Frontal", group: "Ombros", equip: "Halteres", diff: "Iniciante" },
  { name: "Crucifixo Invertido", group: "Ombros", equip: "Halteres", diff: "Intermediário" },
  { name: "Face Pull", group: "Ombros", equip: "Polia", diff: "Iniciante" },
  { name: "Remada Alta", group: "Ombros", equip: "Barra", diff: "Iniciante" },
  { name: "Desenvolvimento Máquina", group: "Ombros", equip: "Máquina", diff: "Iniciante" },
  { name: "Elevação Lateral Polia", group: "Ombros", equip: "Polia", diff: "Intermediário" },
  { name: "Elevação Frontal Polia", group: "Ombros", equip: "Polia", diff: "Iniciante" },
  { name: "Y Raise", group: "Ombros", equip: "Halteres", diff: "Intermediário" },
  { name: "Cuban Press", group: "Ombros", equip: "Barra", diff: "Avançado" },
  { name: "Push Press", group: "Ombros", equip: "Barra", diff: "Avançado" },
  { name: "Handstand Push-up", group: "Ombros", equip: "Peso do Corpo", diff: "Avançado" },

  // --- PERNAS (25) ---
  // Quadriceps (10)
  { name: "Agachamento Livre", group: "Pernas", sub: "Quadríceps", equip: "Barra", diff: "Intermediário" },
  { name: "Agachamento Frontal", group: "Pernas", sub: "Quadríceps", equip: "Barra", diff: "Avançado" },
  { name: "Agachamento Smith", group: "Pernas", sub: "Quadríceps", equip: "Máquina", diff: "Intermediário" },
  { name: "Leg Press 45°", group: "Pernas", sub: "Quadríceps", equip: "Máquina", diff: "Iniciante" },
  { name: "Leg Press Horizontal", group: "Pernas", sub: "Quadríceps", equip: "Máquina", diff: "Iniciante" },
  { name: "Hack Machine", group: "Pernas", sub: "Quadríceps", equip: "Máquina", diff: "Intermediário" },
  { name: "Cadeira Extensora", group: "Pernas", sub: "Quadríceps", equip: "Máquina", diff: "Iniciante" },
  { name: "Passada", group: "Pernas", sub: "Quadríceps", equip: "Halteres", diff: "Iniciante" },
  { name: "Afundo", group: "Pernas", sub: "Quadríceps", equip: "Halteres", diff: "Iniciante" },
  { name: "Bulgarian Split Squat", group: "Pernas", sub: "Quadríceps", equip: "Halteres", diff: "Avançado" },
  // Posterior (5)
  { name: "Mesa Flexora", group: "Pernas", sub: "Posterior", equip: "Máquina", diff: "Iniciante" },
  { name: "Flexora Sentado", group: "Pernas", sub: "Posterior", equip: "Máquina", diff: "Iniciante" },
  { name: "Stiff", group: "Pernas", sub: "Posterior", equip: "Barra", diff: "Intermediário" },
  { name: "Terra Romeno", group: "Pernas", sub: "Posterior", equip: "Barra", diff: "Intermediário" },
  { name: "Good Morning", group: "Pernas", sub: "Posterior", equip: "Barra", diff: "Avançado" },
  // Panturrilhas (4)
  { name: "Panturrilha Sentado", group: "Pernas", sub: "Panturrilhas", equip: "Máquina", diff: "Iniciante" },
  { name: "Panturrilha em Pé", group: "Pernas", sub: "Panturrilhas", equip: "Máquina", diff: "Iniciante" },
  { name: "Panturrilha Leg Press", group: "Pernas", sub: "Panturrilhas", equip: "Máquina", diff: "Iniciante" },
  { name: "Panturrilha Smith", group: "Pernas", sub: "Panturrilhas", equip: "Máquina", diff: "Intermediário" },
  // Avancados (6)
  { name: "Pistol Squat", group: "Pernas", sub: "Avançados", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Jump Squat", group: "Pernas", sub: "Avançados", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Box Jump", group: "Pernas", sub: "Avançados", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Sissy Squat", group: "Pernas", sub: "Avançados", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Walking Lunge", group: "Pernas", sub: "Avançados", equip: "Halteres", diff: "Intermediário" },
  { name: "Step-up", group: "Pernas", sub: "Avançados", equip: "Halteres", diff: "Iniciante" },

  // --- GLÚTEOS (10) ---
  { name: "Elevação Pélvica", group: "Glúteos", equip: "Barra", diff: "Intermediário" },
  { name: "Hip Thrust", group: "Glúteos", equip: "Barra", diff: "Intermediário" },
  { name: "Glute Bridge", group: "Glúteos", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Coice Polia", group: "Glúteos", equip: "Polia", diff: "Intermediário" },
  { name: "Coice Máquina", group: "Glúteos", equip: "Máquina", diff: "Iniciante" },
  { name: "Agachamento Sumô", group: "Glúteos", equip: "Halteres", diff: "Iniciante" },
  { name: "Abdução Máquina", group: "Glúteos", equip: "Máquina", diff: "Iniciante" },
  { name: "Abdução Polia", group: "Glúteos", equip: "Polia", diff: "Intermediário" },
  { name: "Avanço Caminhando", group: "Glúteos", equip: "Halteres", diff: "Intermediário" },
  { name: "Frog Pump", group: "Glúteos", equip: "Peso do Corpo", diff: "Iniciante" },

  // --- ABDÔMEN (15) ---
  { name: "Abdominal Tradicional", group: "Abdômen", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Abdominal Infra", group: "Abdômen", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Abdominal Oblíquo", group: "Abdômen", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Bicicleta", group: "Abdômen", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Russian Twist", group: "Abdômen", equip: "Halteres", diff: "Intermediário" },
  { name: "Prancha", group: "Abdômen", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Prancha Lateral", group: "Abdômen", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Prancha Dinâmica", group: "Abdômen", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Elevação de Pernas", group: "Abdômen", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Mountain Climber", group: "Abdômen", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Canivete", group: "Abdômen", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "V-Up", group: "Abdômen", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Hollow Hold", group: "Abdômen", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Crunch Máquina", group: "Abdômen", equip: "Máquina", diff: "Iniciante" },
  { name: "Abdominal Polia", group: "Abdômen", equip: "Polia", diff: "Intermediário" },

  // --- CARDIO (15) ---
  { name: "Caminhada", group: "Cardio", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Corrida", group: "Cardio", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Sprint", group: "Cardio", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Bicicleta", group: "Cardio", equip: "Máquina", diff: "Iniciante" },
  { name: "Elíptico", group: "Cardio", equip: "Máquina", diff: "Iniciante" },
  { name: "Escada", group: "Cardio", equip: "Máquina", diff: "Intermediário" },
  { name: "Remo", group: "Cardio", equip: "Máquina", diff: "Intermediário" },
  { name: "Corda", group: "Cardio", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Burpee", group: "Cardio", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Polichinelo", group: "Cardio", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "High Knees", group: "Cardio", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Jumping Squat", group: "Cardio", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Battle Rope", group: "Cardio", equip: "Elástico", diff: "Intermediário" },
  { name: "Ski Erg", group: "Cardio", equip: "Máquina", diff: "Avançado" },
  { name: "Air Bike", group: "Cardio", equip: "Máquina", diff: "Avançado" },

  // --- FUNCIONAL (20) ---
  { name: "Kettlebell Swing", group: "Funcional", equip: "Kettlebell", diff: "Intermediário" },
  { name: "Farmer Walk", group: "Funcional", equip: "Halteres", diff: "Iniciante" },
  { name: "Bear Crawl", group: "Funcional", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Thruster", group: "Funcional", equip: "Halteres", diff: "Avançado" },
  { name: "Wall Ball", group: "Funcional", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Sled Push", group: "Funcional", equip: "Máquina", diff: "Avançado" },
  { name: "Sled Pull", group: "Funcional", equip: "Máquina", diff: "Avançado" },
  { name: "Turkish Get Up", group: "Funcional", equip: "Kettlebell", diff: "Avançado" },
  { name: "Clean", group: "Funcional", equip: "Barra", diff: "Avançado" },
  { name: "Snatch", group: "Funcional", equip: "Barra", diff: "Avançado" },
  { name: "Jump Lunge", group: "Funcional", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Box Step", group: "Funcional", equip: "Halteres", diff: "Iniciante" },
  { name: "Agility Ladder", group: "Funcional", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Sprint Curto", group: "Funcional", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Sprint Resistido", group: "Funcional", equip: "Elástico", diff: "Avançado" },
  // Duplicate Cardio items that double as functional structure as requested
  { name: "Burpee Funcional", group: "Funcional", equip: "Peso do Corpo", diff: "Avançado" },
  { name: "Box Jump Funcional", group: "Funcional", equip: "Peso do Corpo", diff: "Intermediário" },
  { name: "Battle Rope Funcional", group: "Funcional", equip: "Elástico", diff: "Intermediário" },
  { name: "Push Press Funcional", group: "Funcional", equip: "Barra", diff: "Intermediário" },
  { name: "Deadlift Funcional", group: "Funcional", equip: "Barra", diff: "Avançado" },

  // --- ALONGAMENTOS & MOBILIDADE (20) ---
  { name: "Alongamento Peitoral", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Costas", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Ombros", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Bíceps", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Tríceps", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Quadríceps", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Posterior", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Panturrilha", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Glúteos", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Lombar", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Cervical", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Torácico", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Punhos", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Quadril", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Adutores", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Abdutores", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Isquiotibiais", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Alongamento Corpo Inteiro", group: "Alongamento", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Mobilidade Tornozelo", group: "Mobilidade", equip: "Peso do Corpo", diff: "Iniciante" },
  { name: "Mobilidade Ombros", group: "Mobilidade", equip: "Peso do Corpo", diff: "Iniciante" }
];

// Helper mapping to generate fully formatted elite-level metadata dynamically for the 179 items
export const DEFAULT_EXERCISES: ExerciseDetails[] = RAW_EXERCISES_DATA.map((item, index) => {
  const id = `el_${item.group.toLowerCase().substring(0, 3)}_${index + 1}`;
  
  // Custom smart descriptions, errors and suggestions per muscle group
  let primaryTarget = item.sub || item.group;
  let secondaryTargets: string[] = [];
  let description = `Execução perfeita de ${item.name}. Ideal para ganho de tônus, força e estabilização articular através do recrutamento ótimo de fibras musculares.`;
  let commonErrors = [
    "Compensação postural com outros grupos musculares",
    "Falta de controle na descida ou fase excêntrica",
    "Uso de carga excessiva comprometendo a mecânica articular"
  ];
  let technicalTips = [
    "Ative o core antes de iniciar a série.",
    "Respire de forma controlada soltando o ar na fase concêntrica (de maior esforço).",
    "Mantenha os ombros relaxados e a coluna neutra o tempo todo."
  ];
  let variations = [`${item.name} com pausa de 2s`, `${item.name} unilateral`];
  let relatedExercises: string[] = [];
  let contraindications = ["Indivíduos com lesões graves agudas", "Ausência de liberação médica para esforços elevados"];
  let breathing = "Solte o ar na descida e inspire na subida.";
  let tempo = "3010"; // Excêntrica, Iso, Concêntrica, Iso

  if (item.group === "Peito") {
    primaryTarget = "Peitoral Maior";
    secondaryTargets = ["Deltoide Anterior", "Tríceps Braquial"];
    description = `Posicione as escápulas em adução e depressão. Ative o peitoral empurrando o peso com controle, sem estender os cotovelos totalmente no topo para proteger a articulação.`;
    commonErrors = ["Bater a barra no peito de forma explosiva", "Retirar as escápulas do banco aumentando risco articular nos ombros", "Elevar excessivamente os cotovelos gerando estresse no manguito rotador"];
    technicalTips = ["Imagine que está apertando as escápulas com um prendedor atrás", "Empurre o peso pelo calcanhar das mãos", "Mantenha o punho sempre verticalizado"];
    variations = [`${item.name} com halteres`, `${item.name} na polia`];
    breathing = "Inspire ao descer a carga (excêntrica) e expire ao empurrar (concêntrica).";
  } else if (item.group === "Costas") {
    primaryTarget = "Latíssimo do Dorso";
    secondaryTargets = ["Trapézio", "Romboide", "Bíceps Braquial"];
    description = `Inicie o movimento de puxada ou remada pelas escápulas. Puxe o peso em direção ao corpo direcionando os cotovelos para baixo e para trás, garantindo contração máxima dos dorsais.`;
    commonErrors = ["Utilizar excesso de impulso do tronco (gangorra)", "Iniciar a força pelos braços em vez das costas", "Curvar a lombar nos exercícios de remada curvada"];
    technicalTips = ["Foque na adução das escápulas", "Segure os pesos como se fossem apenas ganchos, puxe pelo cotovelo", "Mantenha o peito sempre aberto e o abdômen contraído"];
    variations = [`${item.name} unilateral`, `${item.name} com pegada inversa`];
    breathing = "Expire ao puxar o peso (concêntrica) e inspire ao retornar (excêntrica).";
  } else if (item.group === "Bíceps") {
    primaryTarget = "Bíceps Braquial";
    secondaryTargets = ["Braquial", "Braquiorradial"];
    description = `Estabilize o cotovelo ao lado do corpo. Flexione o antebraço concentrando a tensão no bíceps e faça uma descida lenta valorizando o trabalho de alongamento das fibras.`;
    commonErrors = ["Projetar os cotovelos para frente", "Balançar o tronco gerando embalo", "Não estender totalmente o cotovelo no ponto inicial"];
    technicalTips = ["Mantenha os cotovelos colados e travados na lateral do tronco", "Aperte o bíceps por 1 segundo no topo da contração", "Evite segurar a barra com excesso de força nos punhos"];
    variations = [`${item.name} com halteres martelo`, `${item.name} na polia`];
    breathing = "Expire ao dobrar o cotovelo (concêntrica) e inspire ao estender (excêntrica).";
  } else if (item.group === "Tríceps") {
    primaryTarget = "Tríceps Braquial";
    secondaryTargets = ["Ancôneo", "Deltoide Posterior"];
    description = `Estenda o braço de forma isolada, gerando contração intensa na parte posterior do braço. Retorne à posição inicial mantendo o controle.`;
    commonErrors = ["Abrir excessivamente os cotovelos para fora", "Utilizar ombros para empurrar o peso", "Movimentar os ombros para cima e para baixo"];
    technicalTips = ["Sinta o tríceps queimar no ponto de extensão máxima", "Foque na ativação das três cabeças do tríceps", "Punhos alinhados com o antebraço"];
    variations = [`${item.name} unilateral com cabo`, `${item.name} na polia pegada invertida`];
    breathing = "Expire ao estender totalmente o braço (concêntrica) e inspire ao retornar (excêntrica).";
  } else if (item.group === "Ombros") {
    primaryTarget = "Deltoide Lateral";
    secondaryTargets = ["Deltoide Anterior", "Deltoide Posterior", "Trapézio"];
    description = `Eleve os braços mantendo uma ligeira flexão de cotovelos, ativando principalmente os deltoides. Evite subir demais para não sobrecarregar as articulações dos ombros.`;
    commonErrors = ["Elevar os ombros em direção às orelhas", "Curvar o tronco para trás nos desenvolvimentos", "Balançar o corpo para dar impulso"];
    technicalTips = ["Imagine que está afastando as mãos para as laterais, em vez de apenas subir", "Estabilize a musculatura do pescoço mantendo o olhar reto", "Ative firmemente os glúteos e abdômen no agachamento ou elevação"];
    variations = [`${item.name} na polia`, `${item.name} inclinado no banco`];
    breathing = "Expire durante a fase de elevação ou empuxo e inspire na descida.";
  } else if (item.group === "Pernas") {
    primaryTarget = item.sub === "Quadríceps" ? "Quadríceps Femoral" : item.sub === "Posterior" ? "Isquiotibiais" : "Gastrocnêmio";
    secondaryTargets = ["Glúteo Máximo", "Eretores da Espinha", "Sóleo"];
    description = `Mantenha a base firme e o peso distribuído no calcanhar e meio do pé. Agache com controle direcionando o quadril para trás e mantendo o peito elevado.`;
    commonErrors = ["Valgo dinâmico (joelhos caindo para dentro)", "Curvatura excessiva da coluna lombar (retroversão pélvica)", "Tirar os calcanhares do chão no ponto mais baixo"];
    technicalTips = ["Empurre o chão com os pés para subir", "Aponte os joelhos na mesma direção da ponta dos pés", "Mantenha o peito estufado e ombros para trás"];
    variations = [`${item.name} com halteres`, `${item.name} unilateral`];
    breathing = "Inspire ao descer (excêntrica) e expire ao empurrar o chão de volta (concêntrica).";
  } else if (item.group === "Glúteos") {
    primaryTarget = "Glúteo Máximo";
    secondaryTargets = ["Glúteo Médio", "Isquiotibiais", "Eretores da Espinha"];
    description = `Realize a extensão de quadril, contraindo os glúteos ao máximo na fase de pico. Mantenha a lombar estabilizada para que o trabalho ocorra isoladamente nas nádegas.`;
    commonErrors = ["Hiperestender a lombar no topo do movimento", "Não contrair os glúteos no pico de contração", "Fazer o exercício rápido demais sem amplitude"];
    technicalTips = ["Mantenha o queixo ligeiramente colado para baixo para travar as costelas", "Aperte os glúteos como se estivesse esmagando uma moeda no topo", "Calcanhares empurrando ativamente o solo"];
    variations = [`${item.name} unilateral`, `${item.name} com banda elástica`];
    breathing = "Expire na fase de subida ou extensão e inspire ao retornar à base.";
  } else if (item.group === "Abdômen") {
    primaryTarget = "Reto Abdominal";
    secondaryTargets = ["Oblíquos do Abdômen", "Transverso do Abdômen"];
    description = `Aproxime as costelas do quadril gerando flexão e contração na parede abdominal. Concentre a força no core e realize o retorno lentamente resistindo à gravidade.`;
    commonErrors = ["Puxar a cabeça com as mãos forçando o pescoço", "Subir usando a musculatura flexora do quadril", "Prender a respiração de forma prolongada (Valsalva exagerada)"];
    technicalTips = ["Inicie esvaziando o pulmão para facilitar a contração no abdômen", "Sinta cada vértebra saindo e retornando ao solo", "Mantenha o olhar diagonal fixo"];
    variations = [`${item.name} segurando carga`, `${item.name} com rotação`];
    breathing = "Deixe o ar sair totalmente na contração (concêntrica) e inspire ao alongar (excêntrica).";
  } else if (item.group === "Cardio" || item.group === "Funcional") {
    primaryTarget = "Sistema Cardiovascular";
    secondaryTargets = ["Core", "Membros Inferiores", "Membros Superiores"];
    description = `Movimente-se de maneira coordenada mantendo ritmo alto de respiração e frequência cardíaca elevada para queima de gordura e condicionamento físico supremo.`;
    commonErrors = ["Executar de forma descontrolada gerando batidas de impacto nas articulações", "Falta de postura no tronco", "Ritmo incoerente levando a cansaço prematuro"];
    technicalTips = ["Mantenha a passada suave e cadenciada", "Ative o abdômen para amortecer o impacto em cada salto", "Use calçados ideais e hidrate-se com frequência"];
    variations = [`${item.name} intervalado`, `${item.name} ritmo estável`];
    breathing = "Mantenha um ciclo respiratório profundo e constante adequado ao esforço.";
  } else { // Alongamento / Mobilidade
    primaryTarget = "Tecidos Mole / Articular";
    secondaryTargets = ["Estabilizadores"];
    description = `Alongue o grupo muscular de forma progressiva, mantendo a postura de alongamento por pelo menos 15-30 segundos sem balançar de forma brusca para aumentar a elasticidade e prevenir espasmos.`;
    commonErrors = ["Forçar além do limite causando dor intensa", "Fazer saltos rápidos no alongamento (balanço)", "Curvar as costas incorretamente"];
    technicalTips = ["Respire fundo e tente avançar na amplitude a cada expiração", "Sinta o alongamento leve a moderado, nunca dor severa", "Mantenha o alinhamento ósseo perfeito durante a pose"];
    variations = [`${item.name} dinâmico`, `${item.name} passivo`];
    breathing = "Foque em respirações completas, longas e profundas para relaxar o sistema nervoso.";
  }

  // Dynamic premium calculated values 
  const caloriesBurnedValue = item.group === "Cardio" ? 150 : item.group === "Funcional" ? 120 : 65;
  const youtubeUrlValue = `https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(item.name)}`;
  const muscleMapValue = `Ativação principal em ${primaryTarget} com suporte sinérgico de ${secondaryTargets.join(", ")}.`;
  const trainerNotesValue = [
    `Execução de nível ${item.diff}. Mantenha foco absoluto na cadência de ritmo ${tempo}.`,
    "Evite pressa nas transições e mantenha a estabilidade do core."
  ];
  const exerciseDurationValue = item.group === "Cardio" || item.group === "Alongamento" || item.group === "Mobilidade" ? "45s" : "30s";

  return {
    id,
    name: item.name,
    muscleGroup: item.group,
    subGroup: item.sub,
    equipment: item.equip,
    difficulty: item.diff,
    videoUrl: "",
    description,
    primaryTarget,
    secondaryTargets,
    recommendedSets: item.diff === "Iniciante" ? 3 : item.diff === "Intermediário" ? 4 : 5,
    recommendedReps: item.group === "Alongamento" || item.group === "Mobilidade" ? "30s" : item.diff === "Iniciante" ? "12-15" : item.diff === "Intermediário" ? "10-12" : "8-10",
    recommendedRest: item.group === "Alongamento" || item.group === "Mobilidade" ? "30s" : item.group === "Cardio" ? "30s-60s" : "60s-90s",
    commonErrors,
    technicalTips,
    variations,
    relatedExercises: [],
    contraindications,
    tempo,
    breathing,
    
    // Premium fields
    youtubeUrl: youtubeUrlValue,
    caloriesBurned: caloriesBurnedValue,
    muscleMap: muscleMapValue,
    trainerNotes: trainerNotesValue,
    exerciseDuration: exerciseDurationValue,
    timerEnabled: true,
    voiceInstructions: true,
    audioGuide: `Iniciando ${item.name}. Prepare o corpo, mantenha o foco em ${primaryTarget} e execute com cadência de quatro segundos por repetição.`
  };
});
