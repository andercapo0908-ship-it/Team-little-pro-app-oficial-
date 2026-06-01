import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Rotate3D, AlertTriangle } from 'lucide-react';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export const Exercise3DViewer = React.memo(({ exercise, onClose }: Props) => {
  const [videoError, setVideoError] = useState(false);

  if (!exercise) return null;

  const hasCustomVideo = !!exercise.videoUrl;

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let embedUrl = url;
    if (embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
    } else if (embedUrl.includes('youtu.be/')) {
      const id = embedUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    } else if (embedUrl.includes('instagram.com/')) {
      if (embedUrl.includes('/p/') || embedUrl.includes('/reel/')) {
         embedUrl = embedUrl.split('?')[0];
         if (!embedUrl.endsWith('/')) embedUrl += '/';
         embedUrl += 'embed';
      }
    }
    return embedUrl;
  };

  const seed = exercise.name.length % 3;
  
  // Imgur MP4s (reliably hosted for tests without CORS issues)
  const hologramVideos = [
    "https://i.imgur.com/39hN42k.mp4", // fitness looping mp4 placeholder
    "https://i.imgur.com/W2l3q0E.mp4",
    "https://i.imgur.com/39hN42k.mp4"
  ];

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
        <div className="absolute top-0 inset-x-0 p-6 z-30 bg-gradient-to-b from-black to-transparent flex flex-col items-start pointer-events-none pb-12">
          <h3 className="text-gold font-black italic uppercase text-xl sm:text-2xl drop-shadow-[0_2px_10px_rgba(225,173,1,0.5)] flex items-center gap-2">
            <Rotate3D size={22} className="animate-slow-spin text-gold" />
            Holograma 3D
          </h3>
          <p className="text-white font-black uppercase text-sm mt-1 sm:mt-2 max-w-[80%] break-words leading-tight">{exercise.name}</p>
          <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-gold/10 text-gold text-[8px] font-bold font-mono uppercase tracking-widest rounded-md border border-gold/20">Análise Biomecânica</span>
          </div>
        </div>
        
        <button onClick={onClose} className="absolute top-6 right-6 bg-black/60 p-3 rounded-full text-white/50 hover:text-gold hover:bg-gold/10 z-40 transition-all border border-white/10 backdrop-blur-md cursor-pointer pointer-events-auto shadow-lg hover:scale-110">
          <X size={20}/>
        </button>

        {/* Content Viewer */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(40,30,5,1)_0%,rgba(0,0,0,1)_100%)] overflow-hidden">
            
            {/* 3D Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay z-20 pointer-events-none rounded-[2.5rem] scale-[2.0]" style={{backgroundSize: '40px'}} />
            <div className="absolute inset-0 bg-gradient-to-t from-gold/10 via-transparent to-black/40 z-20 pointer-events-none" />
            
            {/* Scan Line effect */}
            <motion.div 
              className="absolute inset-x-0 h-1 md:h-1.5 bg-gold/60 shadow-[0_0_20px_rgba(225,173,1,0.9)] z-30 rounded-full blur-[1px]"
              animate={{ top: ['-10%', '110%', '-10%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {hasCustomVideo && isEmbeddable(exercise.videoUrl!) ? (
              <iframe 
                src={getEmbedUrl(exercise.videoUrl!)} 
                className="w-[120%] h-[120%] object-cover object-center z-10 relative opacity-90 border-0 pointer-events-auto" 
                allowFullScreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              />
            ) : hasCustomVideo ? (
              <video 
                  src={exercise.videoUrl}
                  autoPlay loop muted playsInline crossOrigin="anonymous"
                  className="w-full h-full object-cover z-10 opacity-90 relative pointer-events-auto"
                  onError={() => setVideoError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                {videoError ? (
                  <div className="flex flex-col items-center justify-center text-gold/50">
                    <AlertTriangle size={32} className="mb-2" />
                    <p className="text-[10px] font-mono tracking-widest uppercase">Sem Sinal</p>
                  </div>
                ) : (
                  <img 
                      src="https://i.ibb.co/V9ZYHnQ/3d-wireframe-human-running-3d-model-a89e9f3b51-transformed.png"
                      alt="Hologram Placeholder"
                      className="w-full h-full object-cover scale-[1.3] md:scale-150 transform transition-transform"
                      style={{
                        filter: "sepia(100%) hue-rotate(10deg) saturate(400%) contrast(150%) brightness(1.2) drop-shadow(0 0 15px rgba(225,173,1,0.6))",
                        mixBlendMode: "screen",
                      }}
                      onError={() => setVideoError(true)}
                  />
                )}
              </div>
            )}

            {/* Cyberpunk details - HUD */}
            <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
              <div className="text-[7.5px] font-mono text-gold/80 flex flex-col gap-1 uppercase tracking-widest drop-shadow-md">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"/> SYS.ON // V4.0</span>
                <span>TARGET: {exercise.muscleGroup || 'GERAL'}</span>
                <span>LOAD: {exercise.load || 'MODERADA'}</span>
              </div>
            </div>
            
            {/* Crosshairs */}
            <div className="absolute top-1/2 left-4 w-4 h-[1px] bg-gold/50 z-20 opacity-50" />
            <div className="absolute top-1/2 right-4 w-4 h-[1px] bg-gold/50 z-20 opacity-50" />
            <div className="absolute top-4 left-1/2 w-[1px] h-4 bg-gold/50 z-20 opacity-50" />
            <div className="absolute bottom-4 left-1/2 w-[1px] h-4 bg-gold/50 z-20 opacity-50" />
        </div>

        {/* Bottom Execution Help */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-30 bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6">
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-gold/40 rounded-2xl p-4 shadow-xl pointer-events-auto">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold font-mono tracking-widest text-gold mb-1 sm:mb-2">Guia de Execução</p>
              <p className="text-xs sm:text-sm text-white/90 italic font-medium leading-relaxed">{exercise.description || "Mantenha a postura correta, ative o core e controle a fase excêntrica do movimento de forma constante."}</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
});

Exercise3DViewer.displayName = 'Exercise3DViewer';

// Helper to check what to embed
const isEmbeddable = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('instagram.com/p/') || url.includes('instagram.com/reel/');
};
