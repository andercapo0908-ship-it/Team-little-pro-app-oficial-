import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Trash2, X, Play, Info, Dumbbell, ShieldAlert, Zap, Upload, Loader2, Edit2, CheckCircle2 } from "lucide-react";
import { db, storage } from "../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LibraryExercise, ExerciseDifficulty, UserProfile } from "../types";
import { Exercise3DViewer } from "./Exercise3DViewer";
import { DEFAULT_EXERCISES, ExerciseDetails } from "../data/exercisesDb";

const MUSCLE_GROUPS = [
  "Peito",
  "Costas",
  "Bíceps",
  "Tríceps",
  "Ombros",
  "Pernas",
  "Glúteos",
  "Abdômen",
  "Cardio",
  "Funcional",
  "Alongamento",
  "Mobilidade"
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
      // Find fallback group options
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

  const filteredExercises = combinedExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle ? ex.muscleGroup === selectedMuscle : true;
    const matchesEquipment = selectedEquipment ? ex.equipment === selectedEquipment : true;
    const matchesDifficulty = selectedDifficulty ? ex.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert("Por favor, selecione um arquivo de vídeo de treino válido.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `exercise-videos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewExercise(prev => ({ ...prev, videoUrl: downloadURL }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Erro ao enviar o vídeo.");
    } finally {
      setUploading(false);
    }
  };

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

  const isEmbeddable = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com');
  };

  return (
    <div className="ExerciseLibrary space-y-6" id="exercise-library-section">
      {/* Search and Filters */}
      <div className="bg-black/60 border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={18} />
            <input 
              type="text" 
              placeholder="Buscar biomecânica de exercício na biblioteca..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all font-sans tracking-wide"
            />
          </div>
          {isTrainerOrAdmin && showAddButton && (
            <button 
              onClick={() => setIsAddingMode(true)}
              className="bg-amber-500 text-black px-6 py-3.5 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-amber-500/20 shimmer-btn-effect cursor-pointer shrink-0"
            >
              <Plus size={16} /> Novo Customizado
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select 
            value={selectedMuscle} 
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="bg-neutral-950 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Grupo Muscular</option>
            {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          
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
            Limpar Filtros
          </button>
        </div>
      </div>

      {searchTerm.trim().length === 0 && (
         <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 text-center">
            <span className="text-xs font-mono uppercase text-amber-500 tracking-widest font-black block mb-2">🧬 SIMULAÇÕES HOLOGRÁFICAS BLOQUEADAS</span>
            <p className="text-xs text-slate-400 italic">Digite o nome de qualquer exercício na barra de busca acima para liberar o botão de **Holograma 3D** corporificado!</p>
         </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredExercises.map((ex, index) => (
            <motion.div 
              key={ex.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                opacity: { duration: 0.2, delay: (index % 12) * 0.03 },
                y: { type: "spring", stiffness: 350, damping: 20, delay: (index % 12) * 0.03 },
                layout: { type: "spring", stiffness: 350, damping: 25 }
              }}
              className="bg-neutral-950/80 border border-white/5 rounded-[2rem] p-6 group hover:border-amber-500/30 transition-all flex flex-col gap-4 shadow-xl"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h5 className="font-black text-white uppercase text-base tracking-tight">{ex.name}</h5>
                    <div className="flex gap-1.5 ml-auto md:ml-0 items-center">
                      {searchTerm.trim().length > 0 && (
                        <button 
                          onClick={() => setActiveExerciseForViewer({
                            name: ex.name,
                            sets: ex.recommendedSets,
                            reps: ex.recommendedReps,
                            load: "Moderada",
                            rest: ex.recommendedRest,
                            muscleGroup: ex.muscleGroup,
                            videoUrl: ex.videoUrl,
                            description: ex.description || ""
                          })}
                          className="p-1 px-2.5 bg-amber-500 text-black hover:bg-white rounded-lg transition-all group/play border border-amber-500 flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse cursor-pointer"
                          title="Abrir Simulação 3D"
                        >
                          <Play size={8} fill="currentColor" className="group-hover/play:scale-110 transition-transform" />
                          <span className="text-[7px] font-black uppercase tracking-widest font-mono">Demos 3D</span>
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedForInfo(ex)}
                        className="p-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white hover:text-black transition-all cursor-pointer"
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

              <p className="text-xs text-slate-400 line-clamp-2 italic cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedForInfo(ex)}>
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
            <Zap size={32} className="mx-auto text-slate-500 mb-4 opacity-20" />
            <p className="text-sm font-mono uppercase tracking-widest text-slate-600">Nenhum exercício encontrado</p>
          </div>
        )}
      </div>

      {/* Add Custom Exercise Modal */}
      <AnimatePresence>
        {isAddingMode && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0" onClick={() => setIsAddingMode(false)} />
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                <button onClick={() => { if(!uploading) { setIsAddingMode(false); setEditingExerciseId(null); } }} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"><X size={18}/></button>
                
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">{editingExerciseId ? 'Editar' : 'Novos'} <span className="text-amber-500">Exercícios</span></h3>
                
                <div className="space-y-4 relative z-10">
                   <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome do Exercício</label>
                      <input type="text" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-3 px-5 text-sm text-white outline-none focus:border-amber-500 font-bold uppercase tracking-tight" placeholder="Ex: Supino Reto com Barra" />
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-widest text-slate-500 ml-1">Grupo</label>
                        <select value={newExercise.muscleGroup} onChange={e => setNewExercise({...newExercise, muscleGroup: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold text-white outline-none focus:border-amber-500 cursor-pointer">
                           {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
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

                   <div className="space-y-4">
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

      {/* Info Modal / Ficha Técnica Expandida */}
      <AnimatePresence>
        {selectedForInfo && (
          <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0" onClick={() => setSelectedForInfo(null)} />
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className="w-full max-w-xl bg-neutral-900 border border-amber-500/20 rounded-[2.5rem] p-8 sm:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                <button onClick={() => setSelectedForInfo(null)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"><X size={18}/></button>
                
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20">
                      <Dumbbell size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500">BIOMECÂNICA DE ELITE</p>
                      <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white">{selectedForInfo.name}</h3>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-mono uppercase text-slate-500 mb-0.5">MÚSCULO ALVO</p>
                      <p className="text-xs font-black text-amber-500 uppercase">{selectedForInfo.primaryTarget}</p>
                   </div>
                   <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-mono uppercase text-slate-500 mb-0.5">SECUNDÁRIOS</p>
                      <p className="text-xs font-bold text-white uppercase truncate">{selectedForInfo.secondaryTargets?.join(", ") || "Nenhum"}</p>
                   </div>
                   <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-mono uppercase text-slate-500 mb-0.5">SÉRIES RECOMENDADAS</p>
                      <p className="text-xs font-bold text-white uppercase">{selectedForInfo.recommendedSets} séries ({selectedForInfo.recommendedReps} reps)</p>
                   </div>
                   <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-mono uppercase text-slate-500 mb-0.5">DESCANSO SUGERIDO</p>
                      <p className="text-xs font-bold text-white uppercase">{selectedForInfo.recommendedRest}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-mono uppercase text-amber-500 tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                         <Play size={10} className="fill-current text-amber-500" />
                         Descrição Biomecânica
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{selectedForInfo.description}"
                      </p>
                   </div>

                   {selectedForInfo.technicalTips && selectedForInfo.technicalTips.length > 0 && (
                      <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/10">
                         <p className="text-[9px] font-mono uppercase text-amber-500 tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                            <CheckCircle2 size={10} className="text-amber-500" />
                            Instruções Técnicas (Checklist)
                         </p>
                         <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-1">
                            {selectedForInfo.technicalTips.map((tip: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                 <span className="text-amber-500 font-mono text-[9px] mt-0.5">▶</span>
                                 <span>{tip}</span>
                              </li>
                            ))}
                         </ul>
                      </div>
                   )}

                   {selectedForInfo.commonErrors && selectedForInfo.commonErrors.length > 0 && (
                      <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/15">
                         <p className="text-[9px] font-mono uppercase text-red-500 tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                            <ShieldAlert size={10} className="text-red-500" />
                            Evite Erros Comuns
                         </p>
                         <ul className="text-xs text-slate-400 space-y-1.5 list-none pl-1">
                            {selectedForInfo.commonErrors.map((error: string, i: number) => (
                              <li key={i} className="flex items-start gap-1.5">
                                 <span className="text-red-500 font-mono text-[9px] mt-0.5">✕</span>
                                 <span>{error}</span>
                              </li>
                            ))}
                         </ul>
                      </div>
                   )}

                   {selectedForInfo.contraindications && selectedForInfo.contraindications.length > 0 && (
                      <div className="bg-neutral-950 p-4 rounded-xl text-slate-400 text-[10px] italic border-l-2 border-red-500/50 flex gap-2 items-center">
                         <ShieldAlert size={12} className="text-red-500/70" />
                         <span>Contraindicações: {selectedForInfo.contraindications.join(", ")}</span>
                      </div>
                   )}
                </div>

                <button 
                  onClick={() => setSelectedForInfo(null)}
                  className="w-full mt-6 py-3.5 bg-white/5 hover:bg-white text-white hover:text-black font-black italic uppercase rounded-2xl tracking-[0.2em] transition-all cursor-pointer text-xs"
                >
                  Fechar
                </button>
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
