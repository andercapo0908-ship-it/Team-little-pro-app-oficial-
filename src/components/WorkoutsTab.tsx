import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, Plus, Trash2, Video, Search, Save, X, Play, Info } from "lucide-react";
import { UserProfile, Workout, Exercise } from "../types";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
export default function ExerciseLibrary() {
import { StudentWorkoutViewer } from "./StudentWorkoutViewer";
import { Exercise3DViewer } from "./Exercise3DViewer";

interface WorkoutsTabProps {
  profile: UserProfile | null;
}

export const WorkoutsTab = React.memo(({ profile }: WorkoutsTabProps) => {
  const isTrainerOrAdmin = profile?.role === 'trainer' || profile?.role === 'admin';
  const [activeSubTab, setActiveSubTab] = useState<'workouts' | 'library'>('workouts');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [viewingWorkout, setViewingWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (!profile) return;
    
    // Fetch workouts based on role
    let q;
    if (isTrainerOrAdmin) {
       q = query(collection(db, "workouts"), where("trainerId", "==", profile.uid));
    } else {
       q = query(collection(db, "workouts"), where("studentId", "==", profile.uid));
    }

    const unsub = onSnapshot(q, (snap) => {
      setWorkouts(snap.docs.map(d => d.data() as Workout));
    }, (err) => {
      console.error("Workouts sync error:", err);
    });

    return () => unsub();
  }, [profile, isTrainerOrAdmin]);

  const handleEdit = (w: Workout) => {
    setEditingWorkout(w);
    setIsCreating(true);
  };

  const handleOpenCreate = () => {
    setEditingWorkout({
      id: "wk_" + Math.random().toString(36).substr(2, 9),
      studentId: "global_temp", // Force selection
      trainerId: profile?.uid || "",
      name: "",
      division: "A",
      duration: "45 min",
      exercises: []
    });
    setIsCreating(true);
  };

  const handleDeleteWorkout = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!confirm("Deseja apagar este treino permanentemente?")) return;
    try {
       await deleteDoc(doc(db, "workouts", id));
    } catch (err) {
       console.error("Error deleting workout:", err);
    }
  };

  if (!profile) return null;

  return (
    <div className="p-6 md:p-8 pb-32 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">TEAM LITTLE <span className="text-amber-500">PRO</span></h2>
          <p className="text-amber-500/60 font-mono text-[10px] uppercase tracking-[0.5em] font-black mt-2">
            Prescrição & Performance de Elite
          </p>
        </div>
        
        {isTrainerOrAdmin && activeSubTab === 'workouts' && !isCreating && (
          <button 
            onClick={handleOpenCreate}
            className="bg-amber-500 text-black px-6 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] shimmer-btn-effect"
          >
            <Plus size={16} /> Novo Plano
          </button>
        )}
      </div>

      {!isCreating && (
        <div className="flex gap-4 border-b border-white/5 pb-4">
           <button 
            onClick={() => setActiveSubTab('workouts')}
            className={`text-[10px] uppercase font-black italic tracking-[0.2em] px-4 py-2 rounded-full transition-all ${activeSubTab === 'workouts' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Meus Planos
          </button>
          <button 
            onClick={() => setActiveSubTab('library')}
            className={`text-[10px] uppercase font-black italic tracking-[0.2em] px-4 py-2 rounded-full transition-all ${activeSubTab === 'library' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Biblioteca de Exercícios
          </button>
        </div>
      )}

      {isCreating ? (
        <WorkoutEditor 
          workout={editingWorkout!} 
          profile={profile}
          onClose={() => setIsCreating(false)} 
        />
      ) : activeSubTab === 'workouts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workouts.length > 0 ? workouts.map((w, i) => (
             <motion.div 
               key={w.id} 
               whileHover={{ scale: 1.02, y: -5 }}
               onClick={() => isTrainerOrAdmin ? handleEdit(w) : setViewingWorkout(w)}
               className={`bg-neutral-900 border cursor-pointer hover:border-amber-500/50 p-8 rounded-[3rem] flex flex-col gap-6 shadow-2xl relative overflow-hidden group transition-all`}
             >
               <div className="flex justify-between items-start z-10">
                 <div className="space-y-3">
                   <div className="flex items-center gap-2">
                     <span className="text-amber-500 text-3xl font-black italic leading-none">{w.division}</span>
                     <h4 className="text-2xl font-black uppercase leading-none tracking-tight text-white/90">{w.name || "Sem Título"}</h4>
                   </div>
                   <div className="flex gap-2">
                       <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-full">{w.exercises.length} Exercícios</span>
                       {w.duration && (
                         <span className="px-3 py-1 bg-white/5 text-slate-400 text-[9px] font-mono uppercase tracking-widest rounded-full border border-white/5">{w.duration}</span>
                       )}
                   </div>
                 </div>
                 {isTrainerOrAdmin && (
                   <button 
                     onClick={(e) => handleDeleteWorkout(w.id, e)}
                     className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all z-20"
                   >
                     <Trash2 size={16} />
                   </button>
                 )}
               </div>
               
               <div className="space-y-3 z-10 mt-4">
                 {w.exercises.slice(0,3).map((ex, idx) => (
                    <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-xs text-white uppercase font-bold">{ex.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{ex.sets}x{ex.reps}</span>
                    </div>
                 ))}
                 {w.exercises.length > 3 && (
                   <p className="text-[10px] text-amber-500 text-center font-mono w-full pt-2">+{w.exercises.length - 3} exercícios...</p>
                 )}
               </div>

               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/5 blur-[50px] rounded-full group-hover:bg-amber-500/20 transition-all duration-500" />
             </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center border border-white/5 border-dashed rounded-[3rem]">
              <Dumbbell size={48} className="mx-auto text-white/10 mb-6" />
              <p className="text-sm font-mono uppercase tracking-widest text-slate-500">Nenhum plano disponível.</p>
            </div>
          )}
        </div>
      ) : (
        <ExerciseLibrary profile={profile} />
      )}

      <AnimatePresence>
        {viewingWorkout && (
          <StudentWorkoutViewer 
             workout={viewingWorkout} 
             onClose={() => setViewingWorkout(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
});

WorkoutsTab.displayName = 'WorkoutsTab';

// --- Subcomponent: Workout Editor ---
const WorkoutEditor = ({ workout: initialWorkout, profile, onClose }: { workout: Workout, profile: UserProfile | null, onClose: () => void }) => {
  const [workout, setWorkout] = useState<Workout>(initialWorkout);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [saving, setSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    // Fetch students list for selector
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map(d => d.data() as UserProfile));
    });
    return () => unsub();
  }, []);

  // Auto-save logic
  useEffect(() => {
    if (!workout.name || workout.studentId === "global_temp") return;
    const timer = setTimeout(async () => {
      try {
        await setDoc(doc(db, "workouts", workout.id), workout);
        setLastSaved(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Workout auto-save err:", err);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [workout]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let embedUrl = url;
    if (embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
    } else if (embedUrl.includes('youtu.be/')) {
      const id = embedUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (embedUrl.includes('instagram.com/')) {
      if (embedUrl.includes('/p/') || embedUrl.includes('/reel/')) {
         embedUrl = embedUrl.split('?')[0];
         if (!embedUrl.endsWith('/')) embedUrl += '/';
         embedUrl += 'embed';
      }
    }
    return embedUrl;
  };

  const handleAddExercise = () => {
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { name: "", sets: 3, reps: "10-12", load: "Moderada", rest: "60s", muscleGroup: "Peitoral", videoUrl: "" }]
    });
  };

  const handleUpdateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...workout.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setWorkout({ ...workout, exercises: updated });
  };

  const handleRemoveExercise = (index: number) => {
    const updated = [...workout.exercises];
    updated.splice(index, 1);
    setWorkout({ ...workout, exercises: updated });
  };

  const handleSave = async () => {
    if (!workout.name) {
      alert("Dê um nome ao treino!");
      return;
    }
    if (workout.studentId === "global_temp") {
      alert("Selecione um aluno para este treino!");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "workouts", workout.id), workout);
      
      try {
        const notificationId = `notif_${Date.now()}_${workout.studentId}`;
        const notificationData = {
          id: notificationId,
          studentId: workout.studentId,
          title: "Treino Atualizado 🏋️‍♂️",
          message: `Seu treino "${workout.name}" (${workout.division}) foi atualizado pelo Coach. Acesse a aba Treinos para ver os detalhes.`,
          read: false,
          type: "workout_update",
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "notifications", notificationId), notificationData);
      } catch (notifErr) {
        console.error("Failed to write notification:", notifErr);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar treino");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
      
      <div className="flex items-center gap-2 mb-8">
         <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
         <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
            {lastSaved ? `Salvo automaticamente: ${lastSaved}` : "Sincronização Ativa"}
         </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-2 md:col-span-1">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Selecionar Aluno</label>
          <select 
            value={workout.studentId} 
            onChange={e => setWorkout({...workout, studentId: e.target.value})}
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase tracking-tight"
          >
             <option value="global_temp">Escolha um Atleta...</option>
             <option value="global">Todos (Público)</option>
             {students.map(s => (
               <option key={s.uid} value={s.uid}>{s.name}</option>
             ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-1">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome do Treino</label>
          <input 
            type="text" value={workout.name} onChange={e => setWorkout({...workout, name: e.target.value})} placeholder="Ex: Hipertrofia A"
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase tracking-tight"
          />
        </div>
        <div className="space-y-2 md:col-span-1">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Divisão</label>
          <input 
            type="text" value={workout.division} onChange={e => setWorkout({...workout, division: e.target.value})} placeholder="Ex: A, B, C, FullBody"
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase tracking-tight"
          />
        </div>
        <div className="space-y-2 md:col-span-1">
          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Duração Estimada</label>
          <input 
            type="text" value={workout.duration || ''} onChange={e => setWorkout({...workout, duration: e.target.value})} placeholder="Ex: 45 min"
            className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono tracking-widest"
          />
        </div>
      </div>

      <div className="space-y-6 mb-12">
        <div className="flex justify-between items-center bg-black/50 p-4 border border-white/5 rounded-2xl">
          <h3 className="font-black italic uppercase tracking-tighter text-xl">Lista de Exercícios</h3>
          <div className="flex gap-4">
            <button onClick={() => setIsLibraryOpen(true)} className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
              Biblioteca <Search size={14} />
            </button>
            <button onClick={handleAddExercise} className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
              Manual <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative group">
              <button onClick={() => handleRemoveExercise(i)} className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              
              <div className="md:col-span-3 space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Exercício</label>
                <input type="text" value={ex.name} onChange={e => handleUpdateExercise(i, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white outline-none focus:border-amber-500 uppercase" placeholder="Supino Reto" />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Séries x Reps</label>
                <div className="flex gap-2">
                  <input type="number" value={ex.sets} onChange={e => handleUpdateExercise(i, 'sets', parseInt(e.target.value))} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white text-center outline-none focus:border-amber-500" />
                  <span className="text-slate-600">x</span>
                  <input type="text" value={ex.reps} onChange={e => handleUpdateExercise(i, 'reps', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white text-center outline-none focus:border-amber-500" placeholder="10-12" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Carga / Descanso</label>
                <div className="flex gap-2">
                  <input type="text" value={ex.load} onChange={e => handleUpdateExercise(i, 'load', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white text-center outline-none focus:border-amber-500" placeholder="Carga" />
                  <span className="text-slate-600">|</span>
                  <input type="text" value={ex.rest} onChange={e => handleUpdateExercise(i, 'rest', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white text-center outline-none focus:border-amber-500" placeholder="60s" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Grupo / Foco</label>
                <input type="text" value={ex.muscleGroup} onChange={e => handleUpdateExercise(i, 'muscleGroup', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white outline-none focus:border-amber-500 uppercase" placeholder="Peitoral" />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase">Progresso</label>
                <select 
                  value={ex.progress || 'Não Iniciado'} 
                  onChange={e => handleUpdateExercise(i, 'progress', e.target.value as any)}
                  className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white outline-none focus:border-amber-500"
                >
                  <option value="Não Iniciado" className="bg-neutral-900">Não Iniciado</option>
                  <option value="Em Progresso" className="bg-neutral-900">Em Progresso</option>
                  <option value="Completo" className="bg-neutral-900">Completo</option>
                </select>
              </div>

              <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-amber-500/50 uppercase flex items-center gap-1"><Video size={10} /> URL Vídeo (Opcional)</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" value={ex.videoUrl || ''} onChange={e => handleUpdateExercise(i, 'videoUrl', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-mono text-white outline-none focus:border-amber-500" placeholder="https://..." />
                    {ex.videoUrl && (
                      <button onClick={() => setPreviewVideo(ex.videoUrl!)} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-black transition-colors shrink-0" title="Testar Vídeo">
                        <Play size={14} fill="currentColor" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-amber-500/50 uppercase flex items-center gap-1"><Info size={10} /> Dicas Técnicas / Observações</label>
                  <textarea 
                    value={ex.description || ''} 
                    onChange={e => handleUpdateExercise(i, 'description', e.target.value)} 
                    rows={1}
                    className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-slate-300 outline-none focus:border-amber-500 italic" 
                    placeholder="Ex: Escápulas retraídas, cadência 4020..."
                  />
                </div>
              </div>
            </div>
          ))}

          {workout.exercises.length === 0 && (
             <div className="text-center py-10 bg-black/20 rounded-2xl border border-white/5">
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Nenhum exercício adicionado</p>
             </div>
          )}
        </div>
      </div>

      <button disabled={saving} onClick={handleSave} className="w-full py-5 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-[0.2em] flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-none transition-all shimmer-btn-effect">
        {saving ? "Salvando..." : <>Salvar Prescrição <Save size={20} /></>}
      </button>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setPreviewVideo(null)} />
             <motion.div initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.95, opacity: 0}} className="w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden relative z-10 border border-white/10 shadow-2xl">
                <button onClick={() => setPreviewVideo(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-amber-500 z-20"><X size={20}/></button>
                <iframe src={getEmbedUrl(previewVideo)} className="w-full h-full border-0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Library Selection Modal */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsLibraryOpen(false)} />
             <motion.div 
               initial={{scale: 0.95, opacity: 0, y: 30}} 
               animate={{scale: 1, opacity: 1, y: 0}} 
               exit={{scale: 0.95, opacity: 0, y: 30}} 
               className="w-full max-w-5xl h-[85vh] bg-neutral-900 rounded-[3rem] overflow-hidden relative z-10 border border-white/10 shadow-2xl flex flex-col"
             >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/30">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Escolha do <span className="text-amber-500">Acervo</span></h3>
                  <button onClick={() => setIsLibraryOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <ExerciseLibrary 
                    profile={profile} 
                    showAddButton={false} 
                    onSelectExercise={(ex) => {
                      setWorkout({
                        ...workout,
                        exercises: [...workout.exercises, { 
                          name: ex.name, 
                          muscleGroup: ex.muscleGroup, 
                          videoUrl: ex.videoUrl,
                          description: ex.description,
                          sets: 3, 
                          reps: "10-12", 
                          load: "Moderada", 
                          rest: "60s" 
                        }]
                      });
                      setIsLibraryOpen(false);
                    }} 
                  />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
