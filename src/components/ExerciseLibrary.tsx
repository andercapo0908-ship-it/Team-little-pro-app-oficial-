import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Plus, Trash2, Video, X, Play, Info, Dumbbell, ShieldAlert, Zap, Upload, Loader2, Edit2 } from "lucide-react";
import { db, storage } from "../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LibraryExercise, ExerciseDifficulty, UserProfile } from "../types";

const MUSCLE_GROUPS = ["Peitoral", "Costas", "Ombros", "Bíceps", "Tríceps", "Quadríceps", "Posterior", "Glúteo", "Panturrilhas", "Abdômen", "Cardio"];
const EQUIPMENTS = ["Halteres", "Barra", "Máquina", "Polia", "Peso do Corpo", "Elástico", "Kettlebell"];
const DIFFICULTIES: ExerciseDifficulty[] = ["Iniciante", "Intermediário", "Avançado"];

interface ExerciseLibraryProps {
  profile: UserProfile | null;
  onSelectExercise?: (exercise: LibraryExercise) => void;
  showAddButton?: boolean;
}

export const ExerciseLibrary = ({ profile, onSelectExercise, showAddButton = true }: ExerciseLibraryProps) => {
  const isTrainerOrAdmin = profile?.role === 'trainer' || profile?.role === 'admin';
  const [exercises, setExercises] = useState<LibraryExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | "">("");
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newExercise, setNewExercise] = useState<Partial<LibraryExercise>>({
    name: "",
    muscleGroup: "Peitoral",
    equipment: "Halteres",
    difficulty: "Iniciante",
    videoUrl: "",
    description: ""
  });
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [selectedForInfo, setSelectedForInfo] = useState<LibraryExercise | null>(null);

  useEffect(() => {
    const q = query(collection(db, "exercises"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setExercises(snap.docs.map(d => ({ ...d.data(), id: d.id } as LibraryExercise)));
      setLoading(false);
    }, (err) => {
      console.error("Exercises sync error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMuscle = selectedMuscle ? ex.muscleGroup === selectedMuscle : true;
    const matchesEquipment = selectedEquipment ? ex.equipment === selectedEquipment : true;
    const matchesDifficulty = selectedDifficulty ? ex.difficulty === selectedDifficulty : true;
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert("Por favor, selecione um arquivo de vídeo.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `exercise-videos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewExercise(prev => ({ ...prev, videoUrl: downloadURL }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Erro ao fazer upload do vídeo.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSaveExercise = async () => {
    if (!newExercise.name || !newExercise.videoUrl) {
      alert("Nome e URL/Vídeo são obrigatórios!");
      return;
    }
    
    const id = editingExerciseId || "ex_" + Math.random().toString(36).substr(2, 9);
    const exerciseToSave: LibraryExercise = {
      ...newExercise as any,
      id,
      trainerId: editingExerciseId ? exercises.find(e => e.id === editingExerciseId)?.trainerId : profile?.uid,
      createdAt: editingExerciseId ? exercises.find(e => e.id === editingExerciseId)?.createdAt : new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "exercises", id), exerciseToSave);
      setIsAddingMode(false);
      setEditingExerciseId(null);
      setNewExercise({ name: "", muscleGroup: "Peitoral", equipment: "Halteres", difficulty: "Iniciante", videoUrl: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar exercício");
    }
  };

  const handleEditExercise = (ex: LibraryExercise) => {
    setNewExercise(ex);
    setEditingExerciseId(ex.id);
    setIsAddingMode(true);
  };

  const isEmbeddable = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let embedUrl = url;
    if (embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
    } else if (embedUrl.includes('youtu.be/')) {
      const id = embedUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }
    return embedUrl;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar exercício na biblioteca..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-neon transition-all"
            />
          </div>
          {isTrainerOrAdmin && showAddButton && (
            <button 
              onClick={() => setIsAddingMode(true)}
              className="bg-neon text-black px-6 py-3 rounded-2xl font-black italic uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-neon/20"
            >
              <Plus size={16} /> Novo Customizado
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select 
            value={selectedMuscle} 
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="bg-neutral-900 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300 outline-none focus:border-neon"
          >
            <option value="">Grupo Muscular</option>
            {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          
          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="bg-neutral-900 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300 outline-none focus:border-neon"
          >
            <option value="">Equipamento</option>
            {EQUIPMENTS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="bg-neutral-900 border border-white/5 rounded-xl py-2 px-3 text-[10px] uppercase font-mono tracking-widest text-slate-300 outline-none focus:border-neon"
          >
            <option value="">Dificuldade</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <button 
            onClick={() => { setSelectedMuscle(""); setSelectedEquipment(""); setSelectedDifficulty(""); setSearchTerm(""); }}
            className="text-[9px] uppercase font-mono tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredExercises.map(ex => (
            <motion.div 
              key={ex.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 group hover:border-neon transition-all flex flex-col gap-4 shadow-xl"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h5 className="font-bold text-white uppercase text-sm tracking-tight">{ex.name}</h5>
                    <div className="flex gap-1.5 ml-auto md:ml-0">
                      {ex.videoUrl && (
                        <button 
                          onClick={() => setPreviewVideo(ex.videoUrl)}
                          className="p-1.5 bg-neon/20 text-neon rounded-lg hover:bg-neon hover:text-black transition-all group/play"
                          title="Ver vídeo de demonstração"
                        >
                          <Play size={12} fill="currentColor" className="group-hover/play:scale-110 transition-transform" />
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedForInfo(ex)}
                        className="p-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white hover:text-black transition-all"
                        title="Ver dicas técnicas"
                      >
                        <Info size={12} />
                      </button>
                    </div>
                    <span className={`text-[8px] font-black italic px-2 py-0.5 rounded-full ${
                      ex.difficulty === 'Iniciante' ? 'bg-green-500/10 text-green-500' :
                      ex.difficulty === 'Intermediário' ? 'bg-neon/10 text-neon' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {ex.difficulty === 'Avançado' ? 'PRO ELITE' : ex.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{ex.muscleGroup} • {ex.equipment}</p>
                </div>
                {onSelectExercise && (
                  <button 
                    onClick={() => onSelectExercise(ex)}
                    className="p-3 bg-amber-500 text-black rounded-xl hover:bg-white transition-colors shadow-lg shrink-0"
                    title="Adicionar ao Treino"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 italic cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedForInfo(ex)}>
                "{ex.description || "Sem descrição disponível."}"
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                   <Video size={12} className="text-slate-600" />
                   <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Tutorial Disponível</span>
                </div>
                {isTrainerOrAdmin && (profile?.role === 'admin' || ex.trainerId === profile?.uid) && (
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditExercise(ex)}
                        className="text-white/40 hover:text-neon transition-colors p-1"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={async () => { if(confirm("Deseja excluir este exercício da biblioteca?")) await deleteDoc(doc(db, "exercises", ex.id)); }}
                        className="text-red-500/40 hover:text-red-500 transition-colors p-1"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
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

      {/* Add New Exercise Modal */}
      <AnimatePresence>
        {isAddingMode && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsAddingMode(false)} />
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[3rem] p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 blur-[50px] rounded-full" />
                <button onClick={() => { if(!uploading) { setIsAddingMode(false); setEditingExerciseId(null); } }} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">{editingExerciseId ? 'Editar' : 'Novo'} <span className="text-amber-500">Exercício</span></h3>
                
                <div className="space-y-4 relative z-10">
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome</label>
                      <input type="text" value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase tracking-tight" placeholder="Ex: Supino Inclinado com Halteres" />
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Grupo</label>
                        <select value={newExercise.muscleGroup} onChange={e => setNewExercise({...newExercise, muscleGroup: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-amber-500">
                           {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Equipamento</label>
                        <select value={newExercise.equipment} onChange={e => setNewExercise({...newExercise, equipment: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-amber-500">
                           {EQUIPMENTS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Dificuldade</label>
                        <select value={newExercise.difficulty} onChange={e => setNewExercise({...newExercise, difficulty: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-amber-500">
                           {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Vídeo de Demonstração</label>
                        <div className="flex flex-col gap-3">
                          {/* File Upload Option */}
                          <label className={`w-full cursor-pointer group`}>
                            <div className={`border-2 border-dashed border-white/10 group-hover:border-neon rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 ${newExercise.videoUrl && !isEmbeddable(newExercise.videoUrl) ? 'bg-neon/10 border-neon' : 'bg-black'}`}>
                              {uploading ? (
                                <Loader2 size={24} className="animate-spin text-neon" />
                              ) : (
                                <Upload size={24} className={newExercise.videoUrl && !isEmbeddable(newExercise.videoUrl) ? 'text-neon' : 'text-slate-500'} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                                {uploading ? "Fazendo Upload..." : (newExercise.videoUrl && !isEmbeddable(newExercise.videoUrl) ? "Vídeo Carregado ✅" : "Upload de Arquivo")}
                              </span>
                              <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                            </div>
                          </label>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center"><span className="bg-neutral-900 px-2 text-[8px] uppercase tracking-[0.3em] text-slate-600 font-black">Ou use link do Youtube</span></div>
                          </div>

                          <input 
                            type="text" 
                            value={isEmbeddable(newExercise.videoUrl || "") ? newExercise.videoUrl : ""} 
                            onChange={e => setNewExercise({...newExercise, videoUrl: e.target.value})} 
                            className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono text-xs" 
                            placeholder="https://youtube.com/watch?v=..." 
                            disabled={uploading}
                          />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Descrição / Dicas Técnicas</label>
                      <textarea rows={3} value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 text-sm" placeholder="Explique a execução correta, postura e respiração..." />
                   </div>

                   <button 
                    onClick={handleSaveExercise} 
                    disabled={uploading || !newExercise.name || !newExercise.videoUrl}
                    className="w-full py-5 bg-neon text-black font-black italic uppercase rounded-2xl tracking-[0.2em] flex items-center justify-center gap-3 text-lg mt-4 shadow-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {uploading ? "Aguarde Upload..." : (editingExerciseId ? "Atualizar Cadastro" : "Salvar Cadastro")}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {selectedForInfo && (
          <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedForInfo(null)} />
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 20, opacity: 0}} className="w-full max-w-lg bg-neutral-900 border border-neon/20 rounded-[3rem] p-10 relative z-10 shadow-2xl">
                <button onClick={() => setSelectedForInfo(null)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-neon/10 rounded-2xl text-neon">
                      <Dumbbell size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Ficha Técnica</p>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{selectedForInfo.name}</h3>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-mono uppercase text-slate-500 mb-1">Grupo Muscular</p>
                      <p className="text-xs font-bold text-neon uppercase">{selectedForInfo.muscleGroup}</p>
                   </div>
                   <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-mono uppercase text-slate-500 mb-1">Equipamento</p>
                      <p className="text-xs font-bold text-white uppercase">{selectedForInfo.equipment}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-neon">
                      <Zap size={14} />
                      <h4 className="text-[10px] uppercase font-black tracking-widest">Dicas Técnicas & Execução</h4>
                   </div>
                   <div className="bg-black/60 border border-white/5 rounded-3xl p-6 min-h-[150px]">
                      <p className="text-sm text-slate-300 leading-relaxed italic">
                        {selectedForInfo.description || "Este exercício ainda não possui dicas técnicas detalhadas."}
                      </p>
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedForInfo(null)}
                  className="w-full mt-8 py-4 bg-white/5 hover:bg-white text-white hover:text-black font-black italic uppercase rounded-2xl tracking-[0.2em] transition-all"
                >
                  Fechar
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setPreviewVideo(null)} />
             <motion.div initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.95, opacity: 0}} className="w-full max-w-5xl aspect-video bg-black rounded-[3rem] overflow-hidden relative z-10 border border-white/20 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                <button onClick={() => setPreviewVideo(null)} className="absolute top-6 right-6 bg-black/50 p-3 rounded-full text-white hover:text-amber-500 z-20"><X size={24}/></button>
                {isEmbeddable(previewVideo) ? (
                  <iframe src={getEmbedUrl(previewVideo)} className="w-full h-full border-0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                ) : (
                  <video src={previewVideo} className="w-full h-full" controls autoPlay />
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
