import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Rotate3D, Activity } from 'lucide-react';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export const Exercise3DViewer = React.memo(({ exercise, onClose }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8">
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-premium-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{scale: 0.9, opacity: 0, rotateX: 20}} 
        animate={{scale: 1, opacity: 1, rotateX: 0}} 
        exit={{scale: 0.95, opacity: 0}} 
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-lg aspect-[3/4] sm:aspect-[4/5] bg-neutral-950 rounded-[2.5rem] overflow-hidden relative z-10 shadow-[0_0_60px_rgba(225,173,1,0.2)] flex flex-col border border-gold/30"
      >
        {/* Header */}
        <div className="absolute top-0 inset-x-0 p-6 z-40 bg-gradient-to-b from-black via-black/80 to-transparent flex flex-col items-start pointer-events-none pb-12">
          <h3 className="text-gold font-black italic uppercase text-xl sm:text-2xl drop-shadow-[0_2px_10px_rgba(225,173,1,0.5)] flex items-center gap-2">
            <Rotate3D size={22} className="animate-slow-spin text-gold" />
            Holograma 3D
          </h3>
          <p className="text-white font-black uppercase text-sm mt-1 sm:mt-2 max-w-[80%] break-words leading-tight">{exercise.name}</p>
          <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-gold/10 text-gold text-[8px] font-bold font-mono uppercase tracking-widest rounded-md border border-gold/20 flex items-center gap-1">
                 <Activity size={10} className="animate-pulse" />
                 Análise Biomecânica
              </span>
          </div>
        </div>
        
        <button onClick={onClose} className="absolute top-6 right-6 bg-black/60 p-3 rounded-full text-white/50 hover:text-gold hover:bg-gold/10 z-50 transition-all border border-white/10 backdrop-blur-md cursor-pointer pointer-events-auto shadow-lg hover:scale-110">
          <X size={20}/>
        </button>

        {/* Content Viewer - Pure CSS/Framer Motion Lightweight Hologram */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(40,30,5,1)_0%,rgba(0,0,0,1)_100%)] overflow-hidden [perspective:1000px]">
            
            {/* 3D Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-10 pointer-events-none rounded-[2.5rem] scale-[2.0]" style={{backgroundSize: '40px'}} />
            <div className="absolute inset-0 bg-gradient-to-t from-gold/10 via-transparent to-black/60 z-10 pointer-events-none" />
            
            {/* Scan Line effect */}
            <motion.div 
              className="absolute inset-x-0 h-1 md:h-1.5 bg-gold/60 shadow-[0_0_20px_rgba(225,173,1,0.9)] z-30 rounded-full blur-[1px]"
              animate={{ top: ['-10%', '110%', '-10%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Simulated 3D Rotating Platform */}
            <motion.div 
               className="absolute bottom-1/4 w-3/4 max-w-[250px] aspect-square rounded-full border border-gold/30 z-10"
               style={{ rotateX: 75 }}
               animate={{ rotateZ: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
               <div className="absolute inset-2 rounded-full border border-gold/20 border-dashed" />
               <div className="absolute inset-8 rounded-full border border-gold/40 border-dotted" />
            </motion.div>

            {/* Wireframe Hologram Image */}
            {mounted && (
               <motion.div 
                 className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none pb-8"
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               >
                 <motion.img 
                     src="https://i.ibb.co/V9ZYHnQ/3d-wireframe-human-running-3d-model-a89e9f3b51-transformed.png"
                     alt="Hologram Wireframe"
                     className="w-full h-full object-contain scale-[1.1] sm:scale-[1.3] transform"
                     style={{
                       filter: "sepia(100%) hue-rotate(10deg) saturate(400%) contrast(150%) brightness(1.2) drop-shadow(0 0 20px rgba(225,173,1,0.8))",
                       mixBlendMode: "screen",
                     }}
                     animate={{ 
                       rotateY: [0, 10, 0, -10, 0],
                     }}
                     transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 />
               </motion.div>
            )}

            {/* Floating Particles */}
            {mounted && Array.from({ length: 8 }).map((_, i) => (
               <motion.div
                 key={i}
                 className="absolute w-1 h-1 bg-gold rounded-full z-20 opacity-60"
                 style={{
                   left: `${Math.random() * 80 + 10}%`,
                   top: `${Math.random() * 80 + 10}%`,
                 }}
                 animate={{
                   y: [0, -30, 0],
                   opacity: [0, 0.8, 0],
                   scale: [0, 1.5, 0]
                 }}
                 transition={{
                   duration: 2 + Math.random() * 2,
                   repeat: Infinity,
                   delay: Math.random() * 2,
                   ease: "easeInOut"
                 }}
               />
            ))}

            {/* Cyberpunk details - HUD */}
            <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
              <div className="text-[7.5px] font-mono text-gold/90 flex flex-col gap-1.5 uppercase tracking-widest drop-shadow-md bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-gold/10">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_5px_#D4AF37]"/> SYS.ON // V4.0</span>
                <span>TARGET: <span className="text-white">{exercise.muscleGroup || 'GERAL'}</span></span>
                <span>LOAD: <span className="text-white">{exercise.load || 'MODERADA'}</span></span>
              </div>
            </div>
            
            {/* Crosshairs */}
            <div className="absolute top-1/2 left-4 w-4 h-[1px] bg-gold/50 z-20 opacity-50" />
            <div className="absolute top-1/2 right-4 w-4 h-[1px] bg-gold/50 z-20 opacity-50" />
            <div className="absolute top-4 left-1/2 w-[1px] h-4 bg-gold/50 z-20 opacity-50" />
            <div className="absolute bottom-4 left-1/2 w-[1px] h-4 bg-gold/50 z-20 opacity-50" />
        </div>

        {/* Bottom Execution Help */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6 pointer-events-none">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-gold/40 rounded-2xl p-4 sm:p-5 shadow-xl pointer-events-auto max-h-[30vh] overflow-y-auto custom-scrollbar">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold font-mono tracking-widest text-gold mb-2 flex items-center gap-2">
                 <Activity size={12} /> Guia de Execução
              </p>
              <p className="text-xs sm:text-sm text-white/90 italic font-medium leading-relaxed">{exercise.description || "Mantenha a postura correta, ative o core e controle a fase excêntrica do movimento de forma constante para o máximo recrutamento muscular."}</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
});

Exercise3DViewer.displayName = 'Exercise3DViewer';
