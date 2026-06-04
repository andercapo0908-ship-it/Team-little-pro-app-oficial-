import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Plus, Trash2, X, Play, Info, Dumbbell, ShieldAlert, 
  Zap, Loader2, Edit2, CheckCircle2, Flame, Sparkles, Heart, Activity, 
  Accessibility, LayoutGrid, Compass, Cpu, TrendingUp, Timer, Volume2, VolumeX, Tv
} from "lucide-react";
import { db, storage } from "../../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LibraryExercise, ExerciseDifficulty, UserProfile } from "../../types";
import { Exercise3DViewer } from "../Exercise3DViewer";
import { DEFAULT_EXERCISES, ExerciseDetails } from "../../data/exercisesDb";

// Dynamic metadata configuration for categories, rich icons, descriptions, and premium styles
const CATEGORIES = [
  { name: "Peito", icon: Dumbbell, desc: "Fibras do Peitoral e Orla", color: "from-amber-500/20 to-amber-600/5", glow: "rgba(245,158,11,0.25)" },
  { name: "Costas", icon: Compass, desc: "Grande Dorsal, Romboides & Asas", color: "from-blue-500/20 to-blue-600/5", glow: "rgba(59,130,246,0.25)" },
  { name: "Bíceps", icon: TrendingUp, desc: "Flexores e Tônus de Braço", color: "from-orange-500/20 to-orange-600/5", glow: "rgba(249,115,22,0.25)" },
  { name: "Tríceps", icon: Activity, desc: "Porção Posterior do Braço", color: "from-purple-500/20 to-purple-600/5", glow: "rgba(168,85,247,0.25)" },
  { name: "Ombros", icon: Cpu, desc: "Deltoides e Manguito Estável", color: "from-indigo-500/20 to-indigo-600/5", glow: "rgba(99,102,241,0.25)" },
  { name: "Pernas", icon: Flame, desc: "Quadríceps, Isquiotibiais & Gêmeos", color: "from-red-500/20 to-red-600/5", glow: "rgba(239,68,68,0.25)" },
  { name: "Glúteos", icon: Sparkles, desc: "Ativação Pélvica de Alta Performance", color: "from-emerald-500/20 to-emerald-600/5", glow: "rgba(16,185,129,0.25)" },
  { name: "Abdômen", icon: ShieldAlert, desc: "Reto, Oblíquos e Fortalecimento de Core", color: "from-yellow-500/20 to-yellow-600/5", glow: "rgba(234,179,8,0.25)" },
  { name: "Cardio", icon: Heart, desc: "Capacidade Cardiovascular e Estamina", color: "from-pink-500/20 to-pink-600/5", glow: "rgba(236,72,153,0.25)" },
  { name: "Funcional", icon: Zap, desc: "Treinos Multiarticulares e HIIT", color: "from-cyan-500/20 to-cyan-600/5", glow: "rgba(6,182,212,0.25)" },
  { name: "Alongamento", icon: Accessibility, desc: "Flexibilidade e Alinhamento Muscular", color: "from-teal-500/20 to-teal-600/5", glow: "rgba(20,184,166,0.25)" },
  { name: "Mobilidade", icon: LayoutGrid, desc: "Descompressão Articular e Saúde", color: "from-lime-500/20 to-lime-600/5", glow: "rgba(132,204,22,0.25)" },
];

const EQUIPMENTS = ["Halteres", "Barra", "Máquina", "Polia", "Peso do Corpo", "Elástico", "Kettlebell"];
const DIFFICULTIES: ExerciseDifficulty[] = ["Iniciante", "Intermediário", "Avançado"];

interface ExerciseLibraryProps {
  profile: UserProfile | null;
  onSelectExercise?: (exercise: LibraryExercise) => void;
  showAddButton?: boolean;
}

export const ExerciseLibrary = ({ profile, onSelectExercise, showAddButton = true }: ExerciseLibraryProps) => {
  const isTrainerOrAdmin = profile?.role === 'trainer' || profile?.role === 'admin';
  const [customExercises, setCustomExercises] = useState<LibraryExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | "">("");
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<LibraryExercise>>({
    name: "",
    muscleGroup: "Peito",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "",
    description: ""
  });
  
  const [activeExerciseForViewer, setActiveExerciseForViewer] = useState<any | null>(null);
  const [selectedForInfo, setSelectedForInfo] = useState<any | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<number>(0);
  
  // Premium interactive countdown rest timer + TTS Coach properties
  const [timerCount, setTimerCount] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleOpenInfo = (ex: any) => {
    setSelectedForInfo(ex);
    setActiveDetailTab(0);
    setIsTimerRunning(false);
    
    // Extrapolate rest seconds cleanly, fallback to 60s
    const seconds = parseInt(ex.recommendedRest) || (ex.recommendedRest?.includes("30") ? 30 : 60);
    setTimerCount(seconds);
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.log("Audio not played in this context.");
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerCount]);

  const handleSpeakAudioGuide = (textToSpeak: string) => {
    if (!window.speechSynthesis) {
      alert("TTS not supported in this frame.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "pt-BR";
    utterance.rate = 1.05;
    utterance.pitch = 1.15;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const q = query(collection(db, "exercises"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setCustomExercises(snap.docs.map(d => ({ ...d.data(), id: d.id } as LibraryExercise)));
      setLoading(false);
    }, (err) => {
      console.error("Exercises sync error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const combinedExercises = [
    ...DEFAULT_EXERCISES.map(de => ({
      id: de.id,
      name: de.name,
      muscleGroup: de.muscleGroup,
      equipment: de.equipment,
      difficulty: de.difficulty,
      videoUrl: de.videoUrl,
      description: de.description,
      isDefault: true,
      primaryTarget: de.primaryTarget,
      secondaryTargets: de.secondaryTargets,
      commonErrors: de.commonErrors,
      technicalTips: de.technicalTips,
      variations: de.variations,
      contraindications: de.contraindications,
      tempo: de.tempo,
      breathing: de.breathing,
      recommendedSets: de.recommendedSets,
      recommendedReps: de.recommendedReps,
      recommendedRest: de.recommendedRest
    })),
    ...customExercises.map(ex => {
      const isPernasSub = ex.muscleGroup === "Quadríceps" || ex.muscleGroup === "Posterior" || ex.muscleGroup === "Panturrilhas";
      const actualGroup = isPernasSub ? "Pernas" : ex.muscleGroup;
      return {
        id: ex.id,
        name: ex.name,
        muscleGroup: actualGroup,
        subGroup: isPernasSub ? ex.muscleGroup : undefined,
        equipment: ex.equipment,
        difficulty: ex.difficulty,
        videoUrl: ex.videoUrl || "",
        description: ex.description || "",
        isDefault: false,
        primaryTarget: ex.muscleGroup,
        secondaryTargets: ["Estabilizadores"],
        commonErrors: ["Mecânica instável na execução", "Amplitude encurtada"],
        technicalTips: ["Foco na respiração adequada", "Mantenha a postura controlada", "Ative a musculatura principal"],
        variations: [`${ex.name} com cadência adaptada`],
        contraindications: ["Dores articulares agudas sem orientação profissional"],
        tempo: "2020",
        breathing: "Respire controladamente em cadência ritmada",
        recommendedSets: 3,
        recommendedReps: "10-12",
        recommendedRest: "60s"
      };
    })
  ];

  // Exercises counter for categories dynamically calculated
  const getCategoryCount = (groupName: string) => {
    return combinedExercises.filter(ex => ex.muscleGroup === groupName).length;
  };

  const filteredExercises = combinedExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle ? ex.muscleGroup === selectedMuscle : true;
    const matchesEquipment = selectedEquipment ? ex.equipment === selectedEquipment : true;
    const matchesDifficulty = selectedDifficulty ? ex.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
  });

  const handleSaveExercise = async () => {
    if (!newExercise.name) {
      alert("Nome é obrigatório!");
      return;
    }
    
    const id = editingExerciseId || "ex_" + Math.random().toString(36).substr(2, 9);
    const exerciseToSave: LibraryExercise = {
      id,
      name: newExercise.name,
      muscleGroup: newExercise.muscleGroup || "Peito",
      equipment: newExercise.equipment || "Halteres",
      difficulty: newExercise.difficulty || "Iniciante",
      videoUrl: newExercise.videoUrl || "",
      description: newExercise.description || "",
      trainerId: editingExerciseId ? customExercises.find(e => e.id === editingExerciseId)?.trainerId : profile?.uid,
      createdAt: editingExerciseId ? customExercises.find(e => e.id === editingExerciseId)?.createdAt : new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "exercises", id), exerciseToSave);
      setIsAddingMode(false);
      setEditingExerciseId(null);
      setNewExercise({ name: "", muscleGroup: "Peito", equipment: "Halteres", difficulty: "Iniciante", videoUrl: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar o exercício");
    }
  };

  const handleEditExercise = (ex: any) => {
    setNewExercise({
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      videoUrl: ex.videoUrl,
      description: ex.description
    });
    setEditingExerciseId(ex.id);
    setIsAddingMode(true);
  };

  return (
    <div className="ExerciseLibrary space-y-8" id="exercise-library-section">
      {/* Category Visual Cards Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500 font-bold">Estrutura de Categorias de Elite</h4>
            <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-tight">Grupos Musculares</h3>
          </div>
          {selectedMuscle && (
            <button 
              onClick={() => setSelectedMuscle("")}
              className="text-[9px] uppercase font-mono tracking-widest text-red-500 hover:text-white transition-colors cursor-pointer border border-red-500/20 py-1.5 px-3 bg-red-500/5 hover:bg-neutral-900 rounded-lg"
            >
              Exibir Todos [x]
            </button>
          )}
        </div>

        {/* Dynamic visual category chips list */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.04 } }
          }}
        >
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isSelected = selectedMuscle === cat.name;
            const count = getCategoryCount(cat.name);

            return (
              <motion.div
                key={cat.name}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: `0 10px 25px ${cat.glow}`
                }}
                onClick={() => setSelectedMuscle(isSelected ? "" : cat.name)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-left relative overflow-hidden flex flex-col justify-between h-32 backdrop-blur-md select-none group ${
                  isSelected 
                    ? "bg-amber-500/15 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]" 
                    : "bg-black/40 border-white/5 hover:border-white/15"
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 20px ${cat.glow}` : "none"
                }}
              >
                {/* Visual glow element behind */}
                <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-br ${cat.color} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    isSelected 
                      ? "bg-amber-500 text-black border-amber-400" 
                      : "bg-white/5 border-white/10 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-400"
                  }`}>
                    <IconComponent size={16} className={`${isSelected ? "" : "text-white group-hover:text-black"}`} />
                  </div>
                  <span className="text-[10px] font-mono font-black py-0.5 px-2 bg-white/5 tracking-wider border border-white/5 rounded-full text-slate-400">
                    {count} EXS
                  </span>
                </div>

                <div className="space-y-0.5 z-10">
                  <h5 className="font-extrabold uppercase text-xs text-white tracking-wide">{cat.name}</h5>
                  <p className="text-[9px] text-slate-500 line-clamp-1 group-hover:text-slate-300 transition-colors">{cat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Main Search / Filter Box */}
      <div className="bg-black/60 border border-white/5 rounded-[2rem] p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar biomecânica de exercício na biblioteca..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all font-sans tracking-wide placeholder-slate-500"
            />
          </div>
          {isTrainerOrAdmin && showAddButton && (
            <button 
              onClick={() => setIsAddingMode(true)}
              className="bg-amber-500 text-black px-6 py-3.5 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <Plus size={16} /> Novo Customizado
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-neutral-950 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300">
            <span className="text-slate-500 mr-2">Grupo:</span>
            <span className="text-amber-500 font-bold">{selectedMuscle || "TODOS"}</span>
          </div>
          
          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="bg-neutral-950 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Equipamento</option>
            {EQUIPMENTS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="bg-neutral-950 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Dificuldade</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <button 
            onClick={() => { setSelectedMuscle(""); setSelectedEquipment(""); setSelectedDifficulty(""); setSearchTerm(""); }}
            className="text-[9px] uppercase font-mono tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer text-center md:text-left pt-2 md:pt-0"
          >
            Limpar Filtros [X]
          </button>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredExercises.map((ex, index) => (
            <motion.div 
              key={ex.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.2,
                delay: Math.min(index * 0.02, 0.3)
              }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(245,158,11,0.25)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
              className="bg-neutral-950/80 border border-white/5 rounded-[2rem] p-6 group transition-all flex flex-col gap-4 shadow-xl text-left"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h5 className="font-extrabold text-white uppercase text-base tracking-tight leading-tight">{ex.name}</h5>
                    <div className="flex gap-1.5 ml-auto items-center">
                      <button 
                        onClick={() => setActiveExerciseForViewer({
                          name: ex.name,
                          sets: ex.recommendedSets,
                          reps: ex.recommendedReps,
                          load: "Moderada",
                          rest: ex.recommendedRest,
                          muscleGroup: ex.muscleGroup,
                          videoUrl: ex.videoUrl,
                          description: ex.description || "",
                          primaryTarget: ex.primaryTarget,
                          secondaryTargets: ex.secondaryTargets,
                          commonErrors: ex.commonErrors,
                          technicalTips: ex.technicalTips,
                          variations: ex.variations,
                          contraindications: ex.contraindications,
                          tempo: ex.tempo,
                          breathing: ex.breathing,
                          difficulty: ex.difficulty
                        })}
                        className="p-1 px-2.5 bg-amber-500 text-black hover:bg-white rounded-lg transition-all group/play border border-amber-500 flex items-center gap-1 shadow-lg shadow-amber-500/15 cursor-pointer"
                        title="Simulador Biomecânico 3D"
                      >
                        <Play size={8} fill="currentColor" className="group-hover/play:scale-110 transition-transform" />
                        <span className="text-[7.5px] font-black uppercase tracking-widest font-mono">Demos 3D</span>
                      </button>
                      <button 
                        onClick={() => handleOpenInfo(ex)}
                        className="p-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white hover:text-black transition-all cursor-pointer border border-white/5"
                        title="Ver Ficha Técnica"
                      >
                        <Info size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">{ex.muscleGroup} • {ex.equipment}</span>
                    <span className={`text-[7.5px] font-black italic px-2 py-0.5 rounded-full ${
                      ex.difficulty === 'Iniciante' ? 'bg-green-500/10 text-green-500' :
                      ex.difficulty === 'Intermediário' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {ex.difficulty === 'Avançado' ? 'AVANÇADO ELITE' : ex.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <p 
                className="text-xs text-slate-400 line-clamp-3 italic cursor-pointer hover:text-white transition-colors leading-relaxed" 
                onClick={() => handleOpenInfo(ex)}
              >
                "{ex.description || "Sem descrição biomecânica disponível."}"
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-slate-600">
                  {ex.isDefault ? "🛡️ Biblioteca Elite" : "👤 Personal Customizado"}
                </span>
                {isTrainerOrAdmin && !ex.isDefault && (
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditExercise(ex)}
                        className="text-white/40 hover:text-amber-500 transition-colors p-1 cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button 
                        onClick={async () => { if(confirm("Deseja excluir este exercício da biblioteca?")) await deleteDoc(doc(db, "exercises", ex.id)); }}
                        className="text-red-500/40 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                   </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && filteredExercises.length === 0 && (
          <div className="col-span-full py-16 text-center bg-black/20 rounded-3xl border border-white/5 border-dashed">
            <Zap size={32} className="mx-auto text-slate-600 mb-4 opacity-30 animate-pulse" />
            <p className="text-sm font-mono uppercase tracking-widest text-slate-500">Nenhum exercício encontrado</p>
          </div>
        )}
      </div>

      {/* Add Custom Exercise Modal */}
      <AnimatePresence>
        {isAddingMode && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0" onClick={() => setIsAddingMode(false)} />
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                <button onClick={() => { if(!uploading) { setIsAddingMode(false); setEditingExerciseId(null); } }} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"><X size={18}/></button>
                
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-white">{editingExerciseId ? 'Editar' : 'Novos'} <span className="text-amber-500">Exercício</span></h3>
                
                <div className="space-y-4 relative z-10 text-left">
                   <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome do Exercício</label>
                      <input type="text" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-sm text-white outline-none focus:border-amber-500 font-bold uppercase tracking-tight" placeholder="Ex: Supino Reto com Barra" />
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Grupo</label>
                        <select value={newExercise.muscleGroup} onChange={e => setNewExercise({...newExercise, muscleGroup: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold text-white outline-none focus:border-amber-500 cursor-pointer">
                           {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Equipamento</label>
                        <select value={newExercise.equipment} onChange={e => setNewExercise({...newExercise, equipment: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold text-white outline-none focus:border-amber-500 cursor-pointer">
                           {EQUIPMENTS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Dificuldade</label>
                        <select value={newExercise.difficulty} onChange={e => setNewExercise({...newExercise, difficulty: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold text-white outline-none focus:border-amber-500 cursor-pointer">
                           {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Vídeo Demonstrativo (URL Opcional)</label>
                      <input 
                        type="text" 
                        value={newExercise.videoUrl || ""} 
                        onChange={e => setNewExercise({...newExercise, videoUrl: e.target.value})} 
                        className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-white outline-none focus:border-amber-500 font-mono text-xs" 
                        placeholder="https://youtube.com/watch?v=..." 
                        disabled={uploading}
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Descrição do Movimento / Observações</label>
                      <textarea rows={3} value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-xs text-white outline-none focus:border-amber-500" placeholder="Insira instruções detalhadas de biomecânica e respiração..." />
                   </div>

                   <button 
                     onClick={handleSaveExercise} 
                     disabled={uploading || !newExercise.name}
                     className="w-full py-4 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-[0.2em] flex items-center justify-center gap-2 text-sm mt-3 shadow-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                   >
                     {editingExerciseId ? "Atualizar Exercício" : "Salvar na Biblioteca"}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Modal / Ficha Técnica Expandida (5 Screens Detail Model) */}
      <AnimatePresence>
        {selectedForInfo && (
          <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0" onClick={() => setSelectedForInfo(null)} />
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className="w-full max-w-xl bg-neutral-900 border border-amber-500/20 rounded-[2.5rem] p-6 sm:p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[92vh] custom-scrollbar text-left flex flex-col">
                <button onClick={() => setSelectedForInfo(null)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-white"><X size={18}/></button>
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                   <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
                      <Dumbbell size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-amber-500">BIOMECÂNICA DE ELITE</p>
                      <h3 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter text-white">{selectedForInfo.name}</h3>
                   </div>
                </div>

                {/* 5 Screens Tab Navigation */}
                <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5 mb-6 overflow-x-auto scrollbar-none shrink-0 select-none">
                  {[
                    { id: 0, label: "Mídia & Info", icon: LayoutGrid },
                    { id: 1, label: "Execução", icon: Activity },
                    { id: 2, label: "Músculos", icon: Dumbbell },
                    { id: 3, label: "Erros", icon: ShieldAlert },
                    { id: 4, label: "Dicas Coach", icon: Sparkles }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeDetailTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDetailTab(tab.id)}
                        className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[9px] font-mono uppercase font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                          isActive 
                            ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <TabIcon size={11} />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab content viewer with smooth motion transitions */}
                <div className="flex-1 min-h-[300px] relative overflow-y-auto custom-scrollbar pr-1">
                  <AnimatePresence mode="wait">
                    {activeDetailTab === 0 && (
                      <motion.div
                        key="tab-nome"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
                          <div className="absolute right-4 top-4 text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 py-1 px-2.5 rounded-full uppercase font-bold tracking-widest">
                            {selectedForInfo.difficulty || 'Geral'}
                          </div>
                          
                          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Descrição / Biomecânica</p>
                          <p className="text-xs text-slate-300 leading-relaxed italic pr-12">
                            "{selectedForInfo.description || "Ficha sem descrição biomecânica personalizada registrada."}"
                          </p>
                        </div>

                        {/* Calories & Duration Stats Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/10">
                              <Flame size={16} />
                            </div>
                            <div>
                              <p className="text-[8px] font-mono uppercase text-slate-500">Calorias Estimadas</p>
                              <p className="text-xs font-black text-white">{selectedForInfo.caloriesBurned || 65} kcal/série</p>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/10">
                              <Timer size={16} />
                            </div>
                            <div>
                              <p className="text-[8px] font-mono uppercase text-slate-500">Duração Média</p>
                              <p className="text-xs font-black text-white">{selectedForInfo.exerciseDuration || "30-45s"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Video support with dynamic YouTube & Custom Link layout */}
                        <div className="space-y-2">
                          {selectedForInfo.videoUrl && (
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex gap-3 items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20">
                                  <Play size={14} fill="currentColor" />
                                </div>
                                <div className="max-w-[180px] sm:max-w-xs">
                                  <p className="text-[9px] font-mono uppercase text-slate-500">Vídeo de Demonstração</p>
                                  <p className="text-xs text-slate-300 font-bold truncate">{selectedForInfo.videoUrl}</p>
                                </div>
                              </div>
                              <a 
                                href={selectedForInfo.videoUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[9px] font-mono uppercase font-black tracking-widest text-amber-500 hover:text-white border border-amber-500/20 py-1.5 px-3 rounded-lg hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                              >
                                Assistir
                              </a>
                            </div>
                          )}

                          {selectedForInfo.youtubeUrl && (
                            <div className="bg-red-950/20 p-4 rounded-xl border border-red-500/10 flex gap-3 items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-red-600 text-white rounded-lg">
                                  <Tv size={14} />
                                </div>
                                <div className="max-w-[185px] sm:max-w-xs">
                                  <p className="text-[9px] font-mono uppercase text-red-400 font-bold">Vídeos De Apoio</p>
                                  <p className="text-xs text-slate-300 font-semibold truncate">Pesquisar execuções no YouTube</p>
                                </div>
                              </div>
                              <a 
                                href={selectedForInfo.youtubeUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[9px] font-mono uppercase font-black tracking-widest text-red-400 hover:text-white border border-red-500/20 py-1.5 px-3 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                              >
                                Buscar GP
                              </a>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeDetailTab === 1 && (
                      <motion.div
                        key="tab-exec"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        {selectedForInfo.technicalTips && selectedForInfo.technicalTips.length > 0 ? (
                          <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/10">
                            <p className="text-[10px] font-mono uppercase text-amber-500 tracking-wider mb-3 flex items-center gap-1.5 font-bold">
                              <CheckCircle2 size={12} className="text-amber-500" />
                              Instruções Passo-a-Passo
                            </p>
                            <ul className="text-xs text-slate-300 space-y-2.5 list-none">
                              {selectedForInfo.technicalTips.map((tip: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-500 font-mono text-[10px] mt-0.5">0{i+1}.</span>
                                  <span className="leading-relaxed">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5 text-center">
                            <p className="text-xs text-slate-500">Sem orientações de execução passo-a-passo cadastradas.</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/5">
                            <p className="text-[8px] font-mono uppercase text-slate-500 mb-0.5">Cadência (Tempo)</p>
                            <p className="text-xs font-bold text-white uppercase">{selectedForInfo.tempo || "3010"}</p>
                          </div>
                          <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/5">
                            <p className="text-[8px] font-mono uppercase text-slate-500 mb-0.5">Respiração</p>
                            <p className="text-xs font-bold text-white uppercase truncate">{selectedForInfo.breathing || "Expira no esforço"}</p>
                          </div>
                        </div>

                        {/* Interactive Countdown Rest Stop Watch Timer */}
                        {selectedForInfo.timerEnabled && (
                          <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-2xl flex flex-col items-center text-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Timer size={14} className="text-amber-500 animate-pulse" />
                              <span className="text-[10px] font-mono uppercase text-amber-500 font-black">Cronômetro de Recuperação Biofísica</span>
                            </div>
                            
                            <div className="text-3xl font-mono text-white font-black tracking-widest my-2 select-none">
                              00:{timerCount < 10 ? `0${timerCount}` : timerCount}
                            </div>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-mono uppercase font-black cursor-pointer transition-all ${
                                  isTimerRunning ? "bg-red-500 text-white" : "bg-amber-500 text-black hover:bg-white"
                                }`}
                              >
                                {isTimerRunning ? "Pausar" : "Iniciar Descanso"}
                              </button>
                              <button 
                                onClick={() => {
                                  setIsTimerRunning(false);
                                  const seconds = parseInt(selectedForInfo.recommendedRest) || (selectedForInfo.recommendedRest?.includes("30") ? 30 : 60);
                                  setTimerCount(seconds);
                                }}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-slate-300 rounded-lg text-[9px] font-mono uppercase font-bold cursor-pointer transition-all"
                              >
                                Reiniciar
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeDetailTab === 2 && (
                      <motion.div
                        key="tab-musculos"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                            <p className="text-[8px] font-mono uppercase text-amber-500 mb-1 font-bold">🎯 Alvo Principal</p>
                            <h5 className="text-base font-black text-white uppercase tracking-tight">{selectedForInfo.primaryTarget || selectedForInfo.muscleGroup}</h5>
                          </div>
                          <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                            <p className="text-[8px] font-mono uppercase text-indigo-400 mb-1 font-bold">⛓️ Grupos Secundários</p>
                            <h5 className="text-xs font-bold text-slate-300 uppercase truncate">
                              {(selectedForInfo.secondaryTargets && selectedForInfo.secondaryTargets.join(", ")) || "Estabilizadores"}
                            </h5>
                          </div>
                        </div>

                        {selectedForInfo.muscleMap && (
                          <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-2">
                             <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Mapa Operacional de Fibras</p>
                             <p className="text-xs text-slate-400 leading-relaxed italic">{selectedForInfo.muscleMap}</p>
                          </div>
                        )}

                        <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Equipamento Necessário</p>
                          <div className="inline-block py-1 px-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white uppercase">
                            {selectedForInfo.equipment || "Geral"}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeDetailTab === 3 && (
                      <motion.div
                        key="tab-erros"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        {selectedForInfo.commonErrors && selectedForInfo.commonErrors.length > 0 ? (
                          <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/15">
                            <p className="text-[10px] font-mono uppercase text-red-500 tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                              <ShieldAlert size={12} className="text-red-500" />
                              Desvios Críticos e Erros Populares
                            </p>
                            <ul className="text-xs text-slate-300 space-y-2 list-none pl-1">
                              {selectedForInfo.commonErrors.map((error: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-red-500 font-mono text-[10px] mt-0.5">✕</span>
                                  <span className="leading-relaxed">{error}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-center">
                            <p className="text-xs text-slate-400">Nenhum erro postural crítico cadastrado.</p>
                          </div>
                        )}

                        {selectedForInfo.contraindications && selectedForInfo.contraindications.length > 0 && (
                          <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                            <p className="text-[8px] font-mono text-slate-500 uppercase font-black mb-1.5">Riscos & Contraindicação</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {selectedForInfo.contraindications.map((contra: string, index: number) => (
                                <span key={index} className="text-[10px] text-white font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                  ⚠️ {contra}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeDetailTab === 4 && (
                      <motion.div
                        key="tab-dicas"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        {selectedForInfo.trainerNotes && selectedForInfo.trainerNotes.length > 0 ? (
                          <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10 space-y-3">
                            <p className="text-[10px] font-mono uppercase text-amber-500 tracking-wider flex items-center gap-1.5 font-bold">
                              <Sparkles size={12} className="text-amber-500" />
                              Conselho e Notas de Treinador Elite
                            </p>
                            <ul className="text-xs text-slate-300 space-y-2.5">
                              {selectedForInfo.trainerNotes.map((note: string, idx: number) => (
                                <li key={idx} className="leading-relaxed pl-3 border-l-2 border-amber-500/40 italic">
                                  "{note}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10">
                            <p className="text-[10px] font-mono uppercase text-amber-500 tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                              <Sparkles size={12} className="text-amber-500" />
                              Conselho do Treinador Elite
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                              "Mantenha a escápula retraída, concentre a carga de forma lenta no componente excêntrico e não faça de forma alguma rebotes rápidos na transição biomecânica."
                            </p>
                          </div>
                        )}

                        {/* Speech Synthesis / Voice Instructions Interactivity */}
                        {selectedForInfo.voiceInstructions && selectedForInfo.audioGuide && (
                          <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-lg border transition-all ${
                                isSpeaking ? "bg-amber-500 text-black border-amber-500 animate-pulse" : "bg-white/5 text-slate-400 border-white/5"
                              }`}>
                                {isSpeaking ? <Volume2 size={14} /> : <Volume2 size={14} />}
                              </div>
                              <div>
                                <p className="text-[9px] font-mono uppercase text-slate-500">Guia de Áudio por Voz</p>
                                <p className="text-[10px] text-slate-300 font-bold">Assistente de Voz IA Integrado</p>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => handleSpeakAudioGuide(selectedForInfo.audioGuide)}
                              className={`text-[9px] font-mono uppercase font-black tracking-widest px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                isSpeaking 
                                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600" 
                                  : "bg-amber-500 border-amber-500 text-black hover:bg-white"
                              }`}
                            >
                              {isSpeaking ? "Parar" : "Ouvir Instruções"}
                            </button>
                          </div>
                        )}

                        {selectedForInfo.variations && selectedForInfo.variations.length > 0 && (
                          <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                            <p className="text-[8px] font-mono text-slate-500 uppercase font-black mb-1">Variações Alternativas Recomendadas</p>
                            <p className="text-xs text-slate-300 font-bold font-mono">{selectedForInfo.variations.join(" • ")}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-center pt-2">
                          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">Séries</span>
                            <span className="text-xs font-bold text-white">{selectedForInfo.recommendedSets || 3}</span>
                          </div>
                          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">Reps</span>
                            <span className="text-xs font-bold text-white">{selectedForInfo.recommendedReps || "10-12"}</span>
                          </div>
                          <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                            <span className="text-[8px] font-mono text-slate-500 block uppercase">Descanso</span>
                            <span className="text-xs font-bold text-white">{selectedForInfo.recommendedRest || "60s"}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-white/5 shrink-0">
                  <button 
                    onClick={() => {
                      const ex = selectedForInfo;
                      setSelectedForInfo(null);
                      // Stop synthesizing speech if user switches viewer
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                      setIsSpeaking(false);
                      setActiveExerciseForViewer({
                        name: ex.name,
                        sets: ex.recommendedSets,
                        reps: ex.recommendedReps,
                        load: "Moderada",
                        rest: ex.recommendedRest,
                        muscleGroup: ex.muscleGroup,
                        videoUrl: ex.videoUrl,
                        description: ex.description || "",
                        primaryTarget: ex.primaryTarget,
                        secondaryTargets: ex.secondaryTargets,
                        commonErrors: ex.commonErrors,
                        technicalTips: ex.technicalTips,
                        variations: ex.variations,
                        contraindications: ex.contraindications,
                        tempo: ex.tempo,
                        breathing: ex.breathing,
                        difficulty: ex.difficulty,
                        caloriesBurned: ex.caloriesBurned,
                        exerciseDuration: ex.exerciseDuration,
                        youtubeUrl: ex.youtubeUrl,
                        muscleMap: ex.muscleMap,
                        trainerNotes: ex.trainerNotes,
                        audioGuide: ex.audioGuide
                      });
                    }}
                    className="flex-1 py-3 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-[0.2em] transition-all cursor-pointer text-[10px] text-center hover:bg-white shadow-xl shadow-amber-500/10"
                  >
                    Abrir Holograma 3D
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedForInfo(null);
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-black italic uppercase rounded-2xl tracking-[0.2em] transition-all cursor-pointer text-[10px]"
                  >
                    Fechar
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Universal 3D Hologram Viewer Modal */}
      {activeExerciseForViewer && (
        <Exercise3DViewer exercise={activeExerciseForViewer} onClose={() => setActiveExerciseForViewer(null)} />
      )}
    </div>
  );
};
