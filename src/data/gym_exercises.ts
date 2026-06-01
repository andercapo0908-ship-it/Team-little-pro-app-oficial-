import { LibraryExercise } from "../types";

export const PREDEFINED_EXERCISES: Omit<LibraryExercise, "id" | "createdAt">[] = [
  // PEITORAL
  {
    name: "Supino Reto com Barra",
    muscleGroup: "Peitoral",
    equipment: "Barra",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    description: "Exercício fundamental do fisiculturismo clássico desde os anos 90. Promove o desenvolvimento da porção média e esternal do peitoral maior, tríceps e deltoide anterior. Mantenha os calcanhares apoiados firmly no chão, costas arqueadas levemente com as escápulas retraídas, descendo a barra de forma controlada até o terço inferior do peito.",
    lottieFileName: "supino_reto_barra.json"
  },
  {
    name: "Supino Inclinado com Halteres",
    muscleGroup: "Peitoral",
    equipment: "Halteres",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=5CE7_HIdk20",
    description: "Foco principal na porção clavicular (superior) do peitoral maior. A utilização de halteres proporciona maior amplitude de movimento na descida e estabilização articular, reduzindo estresse nos ombros. Controle o ângulo de inclinação entre 30 e 45 graus para reduzir o recrutamento excessivo do deltoide.",
    lottieFileName: "supino_inclinado_halteres.json"
  },
  {
    name: "Crucifixo na Polia (Crossover)",
    muscleGroup: "Peitoral",
    equipment: "Polia",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=x_uL_m_4B4Q",
    description: "Fornece tensão mecânica contínua por todo o arco do movimento, algo impossível com halteres. Foco na adução do braço no plano horizontal. Excelente para isolar as fibras do peitoral maior na porção medial.",
    lottieFileName: "crucifixo_polia_crossover.json"
  },
  {
    name: "Voador / Pec Deck",
    muscleGroup: "Peitoral",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=sqD9N0sPqR0",
    description: "Exercício guiado de isolamento para peitoral maior. Sente-se ereto, segure as manoplas com cotovelos ligeiramente flexionados e realize a adução horizontal dos braços conduzindo-os até que quase se toquem no centro. Excelente estabilização articular para treinos de alta intensidade.",
    lottieFileName: "peck_deck_voador.json"
  },
  {
    name: "Supino Declinado com Barra",
    muscleGroup: "Peitoral",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=tI9M5b707gM",
    description: "Conhecido desde os tempos olímpicos por focar na porção inferior (abdominal/costal) do peitoral maior. Possui menor estresse articular do que o supino inclinado e permite cargas elevadas devido à inclinação mecânica favorável.",
    lottieFileName: "supino_declinado_barra.json"
  },
  {
    name: "Flexão de Braço (Push-up)",
    muscleGroup: "Peitoral",
    equipment: "Peso do Corpo",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=JyCG_5l_f_s",
    description: "Exercício clássico de calistenia para desenvolvimento da força empurradora. Fortalece o peitoral maior, tríceps braquial e deltoide anterior, enquanto exige estabilização do core ativamente por todo o tempo de execução.",
    lottieFileName: "flexao_de_braco.json"
  },

  // COSTAS
  {
    name: "Puxada Alta no Pulley (Lat Pulldown)",
    muscleGroup: "Costas",
    equipment: "Polia",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    description: "Iniciado com destaque na dourada década de 90 para ganhar largura dorsal. Puxe a barra em direção à porção superior do esterno, mantendo o peito estufado e contraindo os cotovelos para baixo e para trás com retração simultânea das escápulas.",
    lottieFileName: "puxada_alta_pulley.json"
  },
  {
    name: "Remada Curvada com Barra",
    muscleGroup: "Costas",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=x7Eof_uGg08",
    description: "Foco no desenvolvimento de espessura das costas e hipertrofia do grande dorsal, trapézio, romboides e eretores da espinha. Flexione levemente os joelhos, incline o tronco à frente a 45 graus com coluna neutra e puxe a barra em direção ao umbigo.",
    lottieFileName: "remada_curvada_barra.json"
  },
  {
    name: "Remada Baixa Sentada na Polia",
    muscleGroup: "Costas",
    equipment: "Polia",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f64",
    description: "Ótimo exercício isolador com estabilização postural. Com cabo no nível abdominal inferior e triângulo acoplado, puxe em direção à cintura esmagando os romboides e o grande dorsal na fase concêntrica máxima, sem balançar o tronco.",
    lottieFileName: "remada_baixa_polia.json"
  },
  {
    name: "Barra Fixa (Pull-Up)",
    muscleGroup: "Costas",
    equipment: "Peso do Corpo",
    difficulty: "Avançado",
    videoUrl: "https://www.youtube.com/watch?v=HRV5YKKaeLA",
    description: "O teste definitivo de força relativa para a cadeia posterior das costas. Trabalha intensamente os dorsais, redondo maior, trapézios inferiores, romboides e o bíceps braquial. Exige alto controle de estabilização do core.",
    lottieFileName: "barra_fixa_pullup.json"
  },
  {
    name: "Levantamento Terra (Deadlift)",
    muscleGroup: "Costas",
    equipment: "Barra",
    difficulty: "Avançado",
    videoUrl: "https://www.youtube.com/watch?v=r4MzxtBKyNE",
    description: "Rei dos exercícios compostos multiarticulares. Estimula toda a cadeia posterior (eretoress da coluna, glúteos, isquiotibiais, trapézios). Comece com a barra colada na canela, trave as escápulas, contraia o abdômen e empurre o solo com os pés.",
    lottieFileName: "levantamento_terra_deadlift.json"
  },
  {
    name: "Pullover na Polia Alta com Barra",
    muscleGroup: "Costas",
    equipment: "Polia",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=uK48C3mH_Dk",
    description: "Exercício de isolamento pro grande dorsal, permitindo ampla flexão de ombro e pico máximo de contração sem envolver o flexor de cotovelo (bíceps). Mantenha o corpo inclinado e os braços retos ou levemente destravados ao tracionar.",
    lottieFileName: "pullover_polia_alta.json"
  },

  // OMBROS
  {
    name: "Desenvolvimento Militar com Barra",
    muscleGroup: "Ombros",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=2yjwXTZ7F_0",
    description: "Prensa vertical icônica para os deltoides anteriores e porção lateral, além de tríceps. Excelente força de sustentação e estabilidade escapular, feito em pé de forma estrita para transferir força de empurrar vertical puro.",
    lottieFileName: "desenvolvimento_militar_barra.json"
  },
  {
    name: "Elevação Lateral com Halteres",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=3Tb_shX23Hk",
    description: "Construtor por excelência do aspecto tridimensional e largura do ombro (porção acromial/lateral do deltoide). Suba os braços até ficarem paralelos ao chão, focando em elevar os cotovelos e não as mãos, com o polegar levemente inclinado para baixo.",
    lottieFileName: "elevacao_lateral_halteres.json"
  },
  {
    name: "Crucifixo Invertido com Halteres",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=9_CWevC9Mvs",
    description: "Para o deltoide posterior (porção espinal), trapézio e romboides. Incline o tronco até que esteja quase paralelo ao chão, abrindo os halteres lateralmente gerando adução escapular posterior estrita.",
    lottieFileName: "crucifixo_invertido_halteres.json"
  },
  {
    name: "Desenvolvimento com Halteres Sentado",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=HzIiNhHhhtA",
    description: "Uma variação estável sentada que permite o treino estrito com sobrecarga progressiva unilateral para o deltoide anterior e lateral. Auxilia na correção de assimetria de forças musculares entre os ombros esquerdo e direito.",
    lottieFileName: "desenvolvimento_halteres.json"
  },

  // BÍCEPS
  {
    name: "Rosca Direta com Barra W",
    muscleGroup: "Bíceps",
    equipment: "Barra",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=n78u33Q0kXg",
    description: "Construtor de massa pura mais tradicional dos bíceps. A barra W proporciona pegada anatômica que previne dores nos punhos e tensões nos tendões dos antebraços. Mantenha os cotovelos fixos ao lado do abdômen e evite inclinar as costas.",
    lottieFileName: "rosca_direta_barra_w.json"
  },
  {
    name: "Rosca Alternada com Halteres",
    muscleGroup: "Bíceps",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=sAq_o6j7m8o",
    description: "Permite supinação completa do punho durante a flexão do cotovelo, maximizando o recrutamento das fibras superficiais e profundas do bíceps braquial. Perfeito para correção de assimetrias.",
    lottieFileName: "rosca_alternada_halteres.json"
  },
  {
    name: "Rosca Martelo com Halteres",
    muscleGroup: "Bíceps",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
    description: "Desenvolvido com pegada neutra. Direciona a tensão mecânica para o bíceps braquial, braquiorradial (antebraço superior) e braquial profundo. Promove espessura para a região do braço.",
    lottieFileName: "rosca_martelo_halteres.json"
  },
  {
    name: "Rosca Scott com Barra EZ",
    muscleGroup: "Bíceps",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=fI73E_vS9aA",
    description: "Foco no isolamento absoluto dos flexores do cotovelo. Com os braços apoiados na máquina ou banco inclinado Larry Scott, o roubo e momentum corporal são eliminados, gerando excelente estresse no pico de contração inferior e medial do bíceps.",
    lottieFileName: "rosca_scott_barra_ez.json"
  },

  // TRÍCEPS
  {
    name: "Tríceps Pulley com Corda",
    muscleGroup: "Tríceps",
    equipment: "Polia",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=F_S6pEisWgw",
    description: "Um clássico excelente para isolar a cabeça lateral do tríceps. Na parte inferior da extensão, puxe as pontas da corda para fora para maximizar a contração de pico. Ideal para treinos de volume com menores cargas.",
    lottieFileName: "triceps_pulley_corda.json"
  },
  {
    name: "Tríceps Testa com Barra W",
    muscleGroup: "Tríceps",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=l3rHYy6mSzA",
    description: "Altamente elogiado nos anos 90 e 2000 pelo aumento bruto de espessura da cabeça longa e medial do tríceps. Deitado no banco, desça a barra W em direção à testa ou ligeiramente atrás da cabeça de forma controlada.",
    lottieFileName: "triceps_testa_barra_w.json"
  },
  {
    name: "Tríceps Coice com Halteres",
    muscleGroup: "Tríceps",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=ZfOEvN8b9Bw",
    description: "Exercício de isolamento voltado para contratura em encurtamento máximo da porção superior e lateral do tríceps. Realize flexão de tronco e extensão estrita de cotovelo, mantendo o braço paralelo ao corpo o tempo todo.",
    lottieFileName: "triceps_coice.json"
  },
  {
    name: "Mergulho em Paralelas (Dips)",
    muscleGroup: "Tríceps",
    equipment: "Peso do Corpo",
    difficulty: "Avançado",
    videoUrl: "https://www.youtube.com/watch?v=XFclt_3m67g",
    description: "Exercício calistênico pesado com foco na força empurradora inferior. Solicita fortemente o tríceps braquial, peitoral menor/inferior e ombros anteriores. Mantenha o corpo mais vertical para maior ativação do tríceps.",
    lottieFileName: "mergulho_paralelas.json"
  },

  // QUADRÍCEPS
  {
    name: "Agachamento Livre com Barra",
    muscleGroup: "Quadríceps",
    equipment: "Barra",
    difficulty: "Avançado",
    videoUrl: "https://www.youtube.com/watch?v=U3H3i0_F77E",
    description: "O mais lendário construtor de força e hipertrofia de pernas de todas as eras. Almeja quadríceps, glúteos e também estabilizadores lombar e abdominal. Desça mantendo o tronco ereto, escápulas travadas e o peso bem distribuído na sola do pé.",
    lottieFileName: "agachamento_livre_barra.json"
  },
  {
    name: "Leg Press 45 Graus",
    muscleGroup: "Quadríceps",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=N6C8gJWe1_Y",
    description: "Um pilar dos treinos de perna desde os anos 90, permitindo empurrar grandes cargas de forma muito segura sem forte carregamento na coluna axial. Mantenha os joelhos alinhados com a ponta dos pés de forma estrita.",
    lottieFileName: "leg_press_45.json"
  },
  {
    name: "Cadeira Extensora",
    muscleGroup: "Quadríceps",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=2nFp9Z0h_Xk",
    description: "O único exercício tradicional que isola perfeitamente o reto femoral do quadríceps na posição encurtada de extensão completa do joelho. Excelente para reabilitação, aquecimento e pump metabólico terminal no treino.",
    lottieFileName: "cadeira_extensora.json"
  },
  {
    name: "Agachamento Búlgaro com Halteres",
    muscleGroup: "Quadríceps",
    equipment: "Halteres",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=vV_T_N9R1E0",
    description: "Um exercício unilateral popularizado nos treinos de força modernos para correções assimetricamente eficientes de potência e estabilidade pélvica de quadríceps e glúteos. Reduz carga espinal e induz alta fadiga muscular localizada.",
    lottieFileName: "agachamento_bulgaro.json"
  },

  // POSTERIOR DE COXA
  {
    name: "Mesa Flexora (Lying Leg Curl)",
    muscleGroup: "Posterior",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=pAnJtVn6-Gk",
    description: "Foco puramente no isolamento dos isquiotibiais (bíceps femoral, semitendinoso, semimembranoso) através da flexão ativa de joelho. Mantenha os quadris firmes no banco para evitar transferência de carga para lombar anterior.",
    lottieFileName: "mesa_flexora.json"
  },
  {
    name: "Cadeira Flexora",
    muscleGroup: "Posterior",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=26rQ40i8A2g",
    description: "Por prender o quadril em flexão constante de 90 graus, alonga mais os isquiotibiais na origem, gerando hipertrofia mediada por estiramento com pico de tensão muscular extraordinariamente alto.",
    lottieFileName: "cadeira_flexora.json"
  },
  {
    name: "Levantamento Terra Romeno / Stiff",
    muscleGroup: "Posterior",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=gT8TGlvQv-A",
    description: "Estiramento poderoso dos posteriores de coxa e glúteos através da flexão/extensão estrita de quadril. Mantenha a coluna firme e neutra ao descer a barra colada com as coxas, empurrando as nádegas bem para trás na descida.",
    lottieFileName: "stiff_barra.json"
  },

  // GLÚTEO
  {
    name: "Elevação Pélvica com Barra",
    muscleGroup: "Glúteo",
    equipment: "Barra",
    difficulty: "Intermediário",
    videoUrl: "https://www.youtube.com/watch?v=uD5uTqorC9M",
    description: "O construtor supremo de massa e potência de glúteo máximo nos treinos modernos. Fornece tensão muscular altíssima no topo (posição encurtada). Apoie as escápulas em banco estável e gere a forte retroversão pélvica.",
    lottieFileName: "elevacao_pelvica_barra.json"
  },
  {
    name: "Glúteo Coice na Polia Baixa",
    muscleGroup: "Glúteo",
    equipment: "Polia",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=e_04I_004Hk",
    description: "Exercício de isolamento para ativação do glúteo máximo e médio de forma unilateral sem sobrecarga lombar. Mantenha controle absoluto sobre a fase excêntrica do retorno do cabo.",
    lottieFileName: "gluteo_coice_polia.json"
  },

  // PANTURRILHAS
  {
    name: "Panturrilhas em Pé (Calf Raise)",
    muscleGroup: "Panturrilhas",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=N_8qW5o_Rcs",
    description: "Envolve o gastrocnêmio (lateral/medial). Execute extensão plantar em amplitude total, alcançando o alongamento máximo na descida e contraindo todo o músculo no topo por um segundo.",
    lottieFileName: "panturrilha_em_pe.json"
  },
  {
    name: "Panturrilhas Sentado (Solear)",
    muscleGroup: "Panturrilhas",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=XdfA6XwA3sU",
    description: "Ao flexionar os joelhos a 90 graus, o gastrocnêmio relaxa e o músculo sóleo trabalha isolado, esculpindo a profundidade e o preenchimento lateral volumoso da panturrilha.",
    lottieFileName: "panturrilha_sentado.json"
  },

  // ABDÔMEN
  {
    name: "Supra Abdominal Crunch",
    muscleGroup: "Abdômen",
    equipment: "Peso do Corpo",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoOG",
    description: "Exercício estrito focado no reto abdominal superior. Concentre-se em descolar apenas as escápulas do chão, contraindo o abdômen sem forçar as vértebras cervicais da nuca com as mãos.",
    lottieFileName: "abdominal_supra.json"
  },
  {
    name: "Infra Abdominal Deitado",
    muscleGroup: "Abdômen",
    equipment: "Peso do Corpo",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=Yf1eCO9-11s",
    description: "Trabalho excelente de reto abdominal inferior e flexores de quadril. Deite-se com as palmas voltadas para baixo, eleve as pernas esticadas e desça de forma controlada sem encostar os pés no chão no final e sem empinar a lombar.",
    lottieFileName: "abdominal_infra.json"
  },
  {
    name: "Prancha Abdominal Isométrica",
    muscleGroup: "Abdômen",
    equipment: "Peso do Corpo",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=TvxN87u17_E",
    description: "Exercício isométrico excelente para desenvolver rigidez e estabilização de todo o complexo do core anterior (reto abdominal, transverso do abdômen, glúteos e serrátil posterior). Certifique-se de manter o bumbum sem subir excessivamente.",
    lottieFileName: "prancha_abdominal.json"
  },

  // CARDIO
  {
    name: "Corrida na Esteira (Running)",
    muscleGroup: "Cardio",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=-0v6yAnb9aA",
    description: "Um pilar dos treinos de endurance, gasto energético e adaptação cardiocirculatória desde 1990 nas academias mundiais. Melhora do condicionamento geral e VO2 máximo substantivamente.",
    lottieFileName: "cardio_esteira.json"
  },
  {
    name: "Bicicleta Ergométrica (Cycling)",
    muscleGroup: "Cardio",
    equipment: "Máquina",
    difficulty: "Iniciante",
    videoUrl: "https://www.youtube.com/watch?v=ZfA74V1lV_A",
    description: "Exercício cardiovascular de baixo impacto mecânico articular nas pernas, excelente para o fortalecimento do sistema aeróbico e melhora da circulação linfática e circulatória inferior.",
    lottieFileName: "cardio_bicicleta.json"
  }
];
