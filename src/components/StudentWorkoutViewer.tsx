import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Dumbbell, Timer, CheckCircle, Rotate3D, Search } from 'lucide-react';
import { Workout, Exercise } from '../types';
import { Exercise3DViewer } from './Exercise3DViewer';

interface Props {
  workout: Workout;
  onClose: () => void;
}

export const StudentWorkoutViewer = React.memo(({ workout, onClose }: Props) => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSetCompletion = (exerciseName: string, maxSets: number) => {
    const current = completedSets[exerciseName] || 0;
    if (current < maxSets) {
      setCompletedSets(prev => ({ ...prev, [exerciseName]: current + 1 }));
      // Start rest timer
      setRestTime(60); 
      setShowRestTimer(true);
      
      const interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowRestTimer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } else {
      setCompletedSets(prev => ({ ...prev, [exerciseName]: 0 }));
    }
  };

  const filteredExercises = workout.exercises.filter(ex => {
    if (!searchQuery.trim()) return true;
    return ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <>
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4 bg-premium-black overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 50 }}
        className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-xl bg-neutral-900 sm:rounded-[3rem] overflow-y-auto relative flex flex-col pt-16 sm:pt-0 pb-20 sm:pb-0"
      >
        <div className="sticky top-0 bg-neutral-900/90 backdrop-blur-md z-30 p-6 border-b border-white/5 flex justify-between items-center sm:hidden">
          <h2 className="text-xl font-black italic uppercase text-white truncate">{workout.name}</h2>
          <button onClick={onClose} className="p-2 bg-white/5 text-white rounded-full"><X size={20}/></button>
        </div>

        <div className="hidden sm:flex justify-between items-center p-8 pb-4 sticky top-0 bg-neutral-900/90 backdrop-blur-md z-30 border-b border-white/5">
          <div>
             <span className="text-gold font-black italic text-3xl leading-none block">{workout.division}</span>
             <h2 className="text-2xl font-black uppercase text-white leading-none mt-1">{workout.name}</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
           <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1.5 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-full">{workout.exercises.length} Exercícios</span>
              <span className="px-3 py-1.5 bg-white/5 text-slate-400 text-[10px] font-mono uppercase tracking-widest rounded-full border border-white/5">{workout.duration}</span>
           </div>

           {/* Central de Busca de Animações / Hologramas */}
           <div className="relative mb-6">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
               <Search className="text-amber-500 animate-pulse" size={16} />
             </div>
             <input
               type="text"
               placeholder="Buscar exercício para ver animação..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-black/60 border border-white/10 focus:border-amber-500/50 rounded-2xl py-3.5 pl-12 pr-12 text-xs text-white outline-none transition-all font-sans tracking-wide placeholder:text-slate-600 shadow-[inset_0_1px_8px_rgba(255,255,255,0.02)]"
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery("")}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono tracking-widest text-amber-500 hover:text-white transition-colors uppercase font-black"
               >
                 [LIMPAR]
               </button>
             )}
           </div>

           {searchQuery.trim().length === 0 && (
             <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-center">
               <span className="text-[10px] font-mono uppercase text-amber-500 tracking-widest font-black block mb-1">🧬 MÓDULO BIOMECÂNICO ATIVO</span>
               <p className="text-[10px] text-slate-400 italic">Digite o nome de um exercício ou grupo muscular acima para liberar as animações holographic 3D!</p>
             </div>
           )}

           <div className="space-y-6">
             {filteredExercises.map((ex, i) => {
                const completed = completedSets[ex.name] || 0;
                const isAllSetsCompleted = completed >= ex.sets;
                const isSearched = searchQuery.trim().length > 0 && (
                  ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                return (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-black/30 border border-white/5 rounded-[2rem] p-5 sm:p-6 shadow-xl transition-all relative overflow-hidden ${isAllSetsCompleted ? 'ring-1 ring-gold/30 opacity-70' : ''} ${isSearched ? 'border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.05)]' : ''}`}
                  >
                     {isAllSetsCompleted && <div className="absolute top-4 right-4 text-gold"><CheckCircle size={20}/></div>}
                     
                     <div className="flex justify-between items-start gap-4 mb-4 pr-6 sm:pr-0">
                       <div className="flex-1 min-w-0">
                         <p className="text-[9px] font-mono uppercase text-slate-500 tracking-widest mb-1">{ex.muscleGroup}</p>
                         <h3 className="text-lg font-black uppercase text-white leading-tight truncate">{ex.name}</h3>
                       </div>
                       
                       {isSearched && (
                         <button 
                           onClick={() => setActiveExercise(ex)}
                           className="flex items-center gap-1.5 bg-amber-500 text-black hover:bg-white hover:scale-105 transition-all px-3 py-2 rounded-xl shrink-0 border border-amber-500 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse"
                         >
                           <Rotate3D size={14} className="animate-slow-spin"/>
                           <span className="text-[9px] font-black italic tracking-widest uppercase hidden sm:inline">Ver Holograma</span>
                           <span className="text-[10px] font-black italic tracking-widest uppercase sm:hidden">3D</span>
                         </button>
                       )}
                     </div>

                     <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-white/5 p-3 rounded-2xl flex flex-col items-center justify-center">
                           <span className="text-[9px] font-mono text-slate-500 uppercase">Séries</span>
                           <span className="text-sm font-black text-white">{ex.sets}</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl flex flex-col items-center justify-center">
                           <span className="text-[9px] font-mono text-slate-500 uppercase">Reps</span>
                           <span className="text-sm font-black text-white">{ex.reps}</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                           <span className="text-[9px] font-mono text-slate-500 uppercase break-words w-full">Carga</span>
                           <span className="text-xs font-bold text-white truncate max-w-[90%]">{ex.load}</span>
                        </div>
                     </div>

                     {ex.description && (
                       <p className="text-xs text-slate-400 italic mb-4 bg-black/40 p-3 rounded-xl border-l-[3px] border-gold">
                         {ex.description}
                       </p>
                     )}

                     <button 
                       onClick={() => toggleSetCompletion(ex.name, ex.sets)}
                       disabled={isAllSetsCompleted}
                       className={`w-full py-4 rounded-xl font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shimmer-btn-effect
                         ${isAllSetsCompleted 
                           ? 'bg-neutral-800 text-slate-500' 
                           : 'bg-gold text-premium-black shadow-[0_5px_20px_rgba(225,173,1,0.25)] hover:shadow-none cursor-pointer'
                         }
                       `}
                     >
                       {isAllSetsCompleted ? (
                         <>Exercício Concluído ✅</>
                       ) : (
                         <>
                           <Dumbbell size={16} />
                           Registrar Série ({completed}/{ex.sets})
                         </>
                       )}
                     </button>
                  </motion.div>
                );
             })}
           </div>
        </div>

        {/* Floating Rest Timer */}
        <AnimatePresence>
          {showRestTimer && (
            <motion.div 
               initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
               className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-neutral-900 border border-gold/50 shadow-[0_0_30px_rgba(225,173,1,0.2)] rounded-full px-6 py-3 flex items-center gap-4 z-[1050]"
            >
               <Timer className="text-gold animate-pulse" size={20} />
               <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">Descanso</span>
                  <span className="font-black text-white">{restTime}s</span>
               </div>
               <button onClick={() => setShowRestTimer(false)} className="text-[10px] text-slate-400 hover:text-white uppercase font-black ml-2 bg-white/10 px-3 py-1.5 rounded-full cursor-pointer">Pular</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>

    {/* 3D Hologram Modal */}
    {activeExercise && (
       <Exercise3DViewer exercise={activeExercise} onClose={() => setActiveExercise(null)} />
    )}
    </>
  );
});

StudentWorkoutViewer.displayName = 'StudentWorkoutViewer';
