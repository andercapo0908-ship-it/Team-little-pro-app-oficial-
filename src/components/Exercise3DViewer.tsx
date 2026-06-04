import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Rotate3D, ShieldAlert, CheckCircle2, Activity, Flame, Zap, Play, Pause, Info, Sliders } from 'lucide-react';
import { Exercise } from '../types';

interface Props {
  exercise: any; // Can be Exercise or full curated ExerciseDetails
  onClose: () => void;
}

export const Exercise3DViewer = React.memo(({ exercise, onClose }: Props) => {
  if (!exercise) return null;

  const [activeScreen, setActiveScreen] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angle, setAngle] = useState<number>(45);
  const [breathePhase, setBreathePhase] = useState<'inspire' | 'expire'>('inspire');
  const [repCount, setRepCount] = useState<number>(0);
  
  // Timer for simulating movement and breathing cycle
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAngle(prev => {
          // Angle cycle model representing muscle extension/flexion (e.g. 15 to 125 degrees)
          let increment = 5 * playbackSpeed;
          let next = prev + (breathePhase === 'inspire' ? increment : -increment);
          
          if (next >= 125) {
            setBreathePhase('expire');
            return 125;
          }
          if (next <= 15) {
            setBreathePhase('inspire');
            setRepCount(rc => rc + 1);
            return 15;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, breathePhase]);

  // Extract premium info or fall back gracefully
  const primaryTarget = exercise.primaryTarget || exercise.muscleGroup || "Principal";
  const secondaryTargets = exercise.secondaryTargets || ["Estabilizadores"];
  const technicalTips = exercise.technicalTips || [
    "Ative as escápulas antes de puxar ou empurrar de forma compensatória.",
    "Controle a volta do peso (cadência de 3 segundos na fase excêntrica).",
    "Mantenha as articulações em alinhamento constante com a base."
  ];
  const commonErrors = exercise.commonErrors || [
    "Postura de coluna fletida ou excesso de carga",
    "Falta de controle na descida (fase excêntrica livre)",
    "Glúteos e abdômen soltos gerando desequilíbrio"
  ];
  const technicalTipsFirst = technicalTips[0] || "Execute com controle absoluto e coordenação respiratória.";
  const tempo = exercise.tempo || "3010";
  const breathingInstruction = exercise.breathing || "Respire de forma contínua e controlada.";
  const difficulty = exercise.difficulty || "Intermediário";

  const screenNames = [
    "1. Identificação",
    "2. Biomecânica",
    "3. Contração Clave",
    "4. Desvios Críticos",
    "5. Dica de Mentor"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
         <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0" onClick={onClose} />
         
         <motion.div 
           initial={{scale: 0.9, opacity: 0, rotateX: 15}} 
           animate={{scale: 1, opacity: 1, rotateX: 0}} 
           exit={{scale: 0.95, opacity: 0}} 
           transition={{ type: "spring", damping: 25 }}
           className="w-full max-w-2xl bg-neutral-950 rounded-[2.5rem] overflow-hidden relative z-10 shadow-[0_0_60px_rgba(245,158,11,0.2)] flex flex-col border border-amber-500/30"
           id="hologram-3d-simulator-panel"
         >
            {/* Header HUD */}
            <div className="p-6 bg-gradient-to-b from-black to-neutral-950/20 border-b border-white/5 flex justify-between items-start">
               <div>
                  <span className="text-[9px] font-mono font-black tracking-[0.4em] text-amber-500 uppercase flex items-center gap-1.5 animate-pulse">
                     <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                     LABORATÓRIO DE BIOMECÂNICA V4.2 // ONLINE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-1 leading-tight flex items-center gap-2">
                    <Rotate3D className="text-amber-500 animate-spin" size={20} style={{ animationDuration: '6s' }} />
                    Holograma: {exercise.name}
                  </h3>
               </div>
               <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-amber-500 hover:text-black text-white/60 rounded-full transition-all border border-white/10 shadow-lg cursor-pointer">
                  <X size={18}/>
               </button>
            </div>

            {/* Visualizer Area */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[radial-gradient(ellipse_at_center,rgba(40,30,5,1)_0%,rgba(0,0,0,1)_100%)] overflow-hidden border-b border-white/5">
                {/* HUD Cyber Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay scale-150 z-10 pointer-events-none" />
                <div className="absolute top-4 left-6 z-20 text-[8px] font-mono text-amber-500/80 uppercase tracking-widest leading-relaxed pointer-events-none hidden sm:block">
                  <span>FPS: 60.0 // DELTA: 16.6ms <br />ANGLE_ALPHA: {angle.toFixed(1)}° <br />STAGE_CYC_REP: {repCount}</span>
                </div>
                <div className="absolute top-4 right-6 z-20 text-[8px] font-mono text-white/50 uppercase tracking-widest text-right pointer-events-none hidden sm:block">
                  <span>CADENCE: [ {tempo} ] <br />MODE: SIMULAÇÃO REALTIME <br />ANALYTICAL: OK</span>
                </div>

                {/* Laser Line Scanning Loop */}
                <motion.div 
                  className="absolute inset-x-0 h-[2px] bg-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.9)] z-20 rounded-full blur-[1.5px]"
                  animate={{ top: ['-5%', '105%', '-5%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-black/60 pointer-events-none" />
                
                {/* High Tech Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full pointer-events-none flex items-center justify-center opacity-30 z-0">
                   <div className="w-32 h-32 border border-dashed border-amber-500/20 rounded-full flex items-center justify-center">
                     <div className="w-16 h-16 border border-white/10 rounded-full" />
                   </div>
                </div>

                {/* Holographic Interactive 3D Render Screen State logic */}
                <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                   {/* SCREEN 1: Identificação */}
                   {activeScreen === 0 && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3 max-w-sm">
                       <span className={`px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono font-bold uppercase tracking-widest rounded-lg`}>
                         Nível de Treino: {difficulty}
                       </span>
                       <h4 className="text-2xl font-black uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{exercise.name}</h4>
                       <p className="text-xs text-slate-400 font-sans leading-relaxed">
                         Pertence ao grupo de **{exercise.muscleGroup}**. Desenvolvida para atletas de alto rendimento com foco biomecânico sob medida para ativação muscular profunda.
                       </p>
                       <div className="pt-2 flex justify-center gap-2">
                          <span className="text-[10px] bg-white/5 border border-white/10 text-slate-300 font-mono py-1 px-3 rounded-full">Equipamento: {exercise.equipment}</span>
                       </div>
                     </motion.div>
                   )}

                   {/* SCREEN 2: Biomecânica de Execução */}
                   {activeScreen === 1 && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col justify-between p-2">
                        <div className="flex-1 flex items-center justify-center gap-6">
                           {/* SVG Vector Mechanical Bone Joint simulation */}
                           <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-40 sm:h-40 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                             {/* Base joint dot */}
                             <circle cx="80" cy="80" r="6" fill="#f59e0b" />
                             {/* Base stand anchor */}
                             <line x1="80" y1="80" x2="80" y2="130" stroke="#444" strokeWidth="4" strokeLinecap="round" />
                             {/* Dynamic angle arm line 1 */}
                             <line x1="80" y1="80" x2={80 + 50 * Math.cos((angle * Math.PI) / 180)} y2={80 - 50 * Math.sin((angle * Math.PI) / 180)} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                             {/* Angle indicator arc */}
                             <path d={`M 110 80 A 30 30 0 0 0 ${80 + 30 * Math.cos((angle * Math.PI) / 180)} ${80 - 30 * Math.sin((angle * Math.PI) / 180)}`} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
                           </svg>

                           {/* HUD metrics right side */}
                           <div className="space-y-2 text-left font-mono">
                              <div>
                                 <span className="text-[8px] text-slate-500 uppercase block">Ângulo do Pivot</span>
                                 <span className="text-base font-black text-amber-500">{angle.toFixed(0)}°</span>
                              </div>
                              <div>
                                 <span className="text-[8px] text-slate-500 uppercase block">Pacing de Respiração</span>
                                 <span className={`text-[10px] font-black uppercase ${breathePhase === 'inspire' ? 'text-blue-400' : 'text-violet-400'}`}>
                                    {breathePhase === 'inspire' ? '▲ INSPIRAR (Fase Excêntrica)' : '▼ EXPIRAR (Fase Concêntrica)'}
                                 </span>
                              </div>
                              <div className="w-24 bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 relative">
                                 <motion.div 
                                   className={`h-full ${breathePhase === 'inspire' ? 'bg-blue-500' : 'bg-violet-500'}`}
                                   style={{ width: breathePhase === 'inspire' ? `${((angle - 15) / 110) * 100}%` : `${(1 - (angle - 15)/110) * 100}%` }}
                                   transition={{ ease: "linear" }}
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Speed Controls bar bottom */}
                        <div className="flex justify-between items-center bg-black/60 border border-white/5 rounded-2xl p-2.5 px-4">
                           <div className="flex items-center gap-4">
                             <button onClick={() => setIsPlaying(!isPlaying)} className="p-1 px-3 bg-amber-500 text-black text-[9px] font-black uppercase rounded-lg hover:bg-white tracking-widest transition-all cursor-pointer">
                                {isPlaying ? <Pause size={10} className="inline mr-1" /> : <Play size={10} className="inline mr-1" />}
                                {isPlaying ? "Pausar" : "Iniciar"}
                             </button>
                             <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">CONTRAPEZO: ATIVO</span>
                           </div>
                           <div className="flex gap-2">
                              {[0.5, 1, 1.5, 2].map(speed => (
                                <button 
                                  key={speed}
                                  onClick={() => setPlaybackSpeed(speed)}
                                  className={`px-2 py-0.5 text-[8px] font-mono font-bold rounded border ${playbackSpeed === speed ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-slate-400 border-white/15 hover:text-white'} transition-colors cursor-pointer`}
                                >
                                  {speed}x
                                </button>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {/* SCREEN 3: Músculos Trabalhados */}
                   {activeScreen === 2 && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col justify-center max-w-md mx-auto space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                              <div className="absolute right-3 top-3"><Flame className="text-amber-500 animate-pulse" size={16} /></div>
                              <span className="text-[8px] font-mono font-black text-amber-500 tracking-[0.2em]">🎯 TARGET PRINCIPAL</span>
                              <h4 className="text-lg font-black text-white uppercase mt-2">{primaryTarget}</h4>
                              <p className="text-[9px] text-slate-400 font-sans mt-1 leading-relaxed">Maior taxa de ativação na fase de pico.</p>
                           </div>

                           <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col justify-between">
                              <span className="text-[8px] font-mono font-bold text-slate-400 tracking-[0.2em]">🎯 SECUNDÁRIOS</span>
                              <div className="flex flex-wrap gap-1 mt-2">
                                 {secondaryTargets.map((sec: string, idx: number) => (
                                   <span key={idx} className="px-2 py-0.5 bg-white/10 text-[8px] font-black uppercase text-slate-300 rounded-full border border-white/5">{sec}</span>
                                 ))}
                              </div>
                              <p className="text-[9px] text-slate-500 font-sans mt-2 leading-relaxed">Musculatura estabilizadora sinergista ativa.</p>
                           </div>
                        </div>

                        {/* Interactive diagram info line */}
                        <div className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-400 bg-neutral-950 p-2.5 rounded-xl border border-white/5">
                           📌 Ativação de pico estimada em <span className="text-amber-500 font-bold">~85% a 95%</span> de EMG.
                        </div>
                     </motion.div>
                   )}

                   {/* SCREEN 4: Erros Comuns e Alertas */}
                   {activeScreen === 3 && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col justify-center max-w-md mx-auto space-y-3">
                        <span className="text-center text-[10px] font-bold font-mono uppercase text-red-500 tracking-[0.3em] flex items-center justify-center gap-1">
                           <ShieldAlert size={14} className="text-red-500 animate-bounce" />
                           Desvios Biomecânicos Graves Detectados
                        </span>
                        
                        <div className="space-y-2">
                           {commonErrors.map((err: string, idx: number) => (
                             <div key={idx} className="bg-red-500/5 border border-red-500/10 p-3.5 rounded-2xl flex items-center gap-3">
                                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-red-500/20">0{idx + 1}</span>
                                <span className="text-white font-black text-xs uppercase tracking-tight leading-none flex-1">{err}</span>
                             </div>
                           ))}
                        </div>

                        <p className="text-[9px] text-slate-500 italic text-center text-sans leading-relaxed">
                           Executar com erros gera estresse desmedido em tendões e diminui em até 40% o estímulo hipertrófico do músculo-alvo.
                        </p>
                     </motion.div>
                   )}

                   {/* SCREEN 5: Dica Especial de Mentor */}
                   {activeScreen === 4 && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-sm">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20 shadow-xl shadow-amber-500/10 animate-pulse">
                           <Zap size={22} className="text-amber-500" />
                        </div>
                        <h4 className="text-lg font-black uppercase text-white tracking-widest">DICA DE ELITE DOP PERSONAL</h4>
                        <div className="bg-neutral-900 border border-amber-500/20 rounded-3xl p-5 shadow-2xl relative">
                           <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center font-bold text-xs text-black italic">💡</div>
                           <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                             "{technicalTipsFirst}"
                           </p>
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest pl-2">
                           Instrução técnica recomendada por Team Little Coaching.
                        </p>
                     </motion.div>
                   )}
                </div>

                {/* Cyber HUD Angle Lines and Corners */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-amber-500/30" />
                <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-amber-500/30" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-amber-500/30" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-amber-500/30" />
            </div>

            {/* Bottom HUD Selector Multi-view Screen Navigation */}
            <div className="p-6 bg-neutral-950 flex flex-col gap-4">
               <div>
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2 block text-center sm:text-left">
                     Selecione a tela de análise em holograma:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                     {screenNames.map((sName, sIdx) => (
                       <button 
                         key={sIdx}
                         onClick={() => setActiveScreen(sIdx)}
                         className={`p-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border font-mono text-center cursor-pointer ${
                           activeScreen === sIdx 
                             ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] font-black' 
                             : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white hover:bg-white/5'
                         }`}
                       >
                         {sName}
                       </button>
                     ))}
                  </div>
               </div>

               {/* Guide Instruction Block */}
               <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex gap-3.5 items-center">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 shrink-0 border border-amber-500/20">
                     <Info size={16} />
                  </div>
                  <div className="flex-1">
                     <p className="text-[8px] font-mono text-amber-500/80 uppercase tracking-widest block font-bold">Ficha de Respiração & Foco</p>
                     <p className="text-xs text-slate-400 leading-snug mt-0.5">{breathingInstruction}</p>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
    </AnimatePresence>
  );
});

Exercise3DViewer.displayName = 'Exercise3DViewer';
