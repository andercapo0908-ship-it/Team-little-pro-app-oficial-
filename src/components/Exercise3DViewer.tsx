import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, Rotate3D, Activity, Cpu, Pause, Play, Maximize, Minimize } from 'lucide-react';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export const Exercise3DViewer = React.memo(({ exercise, onClose }: Props) => {
  const [currentAngle, setCurrentAngle] = useState(180);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const time = Date.now() / 1000;
        const angle = Math.round(122.5 + Math.sin(time * 3) * 52.5);
        setCurrentAngle(angle);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!exercise) return null;

  const muscle = exercise.muscleGroup || 'Peitoral';

  // Determine biomechanical parameters based on target muscle group
  const getBiomechanicalDetails = (group: string) => {
    switch (group) {
      case 'Peitoral':
        return {
          primaryTrigger: 'Adução Horizontal / Extensão de Cotovelo',
          jointName: 'Cotovelo/Ombro',
          loadFocus: 'Deltóide Posterior / Tríceps Aux.',
          tips: 'Estabilize as escápulas no banco e mantenha o core firme.',
          metricName: 'Flexão de Cotovelo'
        };
      case 'Bíceps':
        return {
          primaryTrigger: 'Flexão de Cotovelo / Supinação',
          jointName: 'Cotovelo',
          loadFocus: 'Bíceps Braquial / Braquiorradial',
          tips: 'Mantenha os cotovelos fixos ao lado do corpo.',
          metricName: 'Ângulo do Cotovelo'
        };
      case 'Tríceps':
        return {
          primaryTrigger: 'Extensão de Cotovelo',
          jointName: 'Cotovelo',
          loadFocus: 'Tríceps (Cabeça Longa, Lateral e Medial)',
          tips: 'Evite abrir os cotovelos durante a fase excêntrica.',
          metricName: 'Extensão do Cotovelo'
        };
      case 'Quadríceps':
      case 'Glúteo':
      case 'Posterior':
        return {
          primaryTrigger: 'Flexão de Joelho / Extensão de Quadril',
          jointName: 'Joelho/Quadril',
          loadFocus: 'Quadríceps / Glúteo Máximo',
          tips: 'Distribua o peso no calcanhar e não ultrapasse excessivamente a ponta dos pés.',
          metricName: 'Flexão do Joelho'
        };
      case 'Costas':
        return {
          primaryTrigger: 'Adução Vertical / Extensão de Ombro',
          jointName: 'Escápulas/Ombro',
          loadFocus: 'Latíssimo do Dorso / Redondo Maior',
          tips: 'Inicie o movimento puxando pelos cotovelos, ativando as costas.',
          metricName: 'Adução de Escápula'
        };
      case 'Ombros':
        return {
          primaryTrigger: 'Abdução de Ombro / Desenvolvimento',
          jointName: 'Ombro',
          loadFocus: 'Deltóide Medial e Anterior',
          tips: 'Evite descer os cotovelos além da linha dos ombros no desenvolvimento.',
          metricName: 'Abdução do Ombro'
        };
      default:
        return {
          primaryTrigger: 'Padrão Biodinâmico de Alta Clicagem',
          jointName: 'Articulação Alvo',
          loadFocus: 'Recrutamento Amplo Integrado',
          tips: 'Mantenha a postura neutra e cadência controlada.',
          metricName: 'Consenso Biomecânico'
        };
    }
  };

  const getPinterestId = (group: string, url?: string) => {
    // If the user pasted a Pinterest embed URL or just an ID in the Video URL field
    if (url) {
       const match = url.match(/id=(\d+)/);
       if (match) return match[1];
       if (/^\d+$/.test(url)) return url;
    }

    // Default mapping based on muscle group
    switch (group) {
      case 'Peitoral': return '628604060531833013';
      case 'Costas': return '387520742956213643';
      case 'Bíceps': return '628604060531833013';
      case 'Tríceps': return '628604060531833013'; // Placeholder
      case 'Quadríceps': return '387520742956213643'; // Placeholder
      case 'Posterior': return '387520742956213643'; // Placeholder
      case 'Glúteo': return '387520742956213643'; // Placeholder
      case 'Ombros': return '628604060531833013'; // Placeholder
      case 'Abdômen': return '628604060531833013'; // Placeholder
      default: return '628604060531833013';
    }
  };

  const bio = getBiomechanicalDetails(muscle);
  const pinId = getPinterestId(muscle, exercise.videoUrl);

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4 sm:p-8'}`}>
      {/* Background Dim Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-premium-black/95 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      {/* Primary Holographic Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 30 }} 
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`w-full h-full bg-neutral-950 overflow-hidden relative z-10 flex flex-col transition-all duration-300 ${isFullscreen ? 'max-w-none max-h-none rounded-none border-0' : 'max-w-[400px] max-h-[90vh] rounded-[2rem] shadow-[0_0_60px_rgba(212,175,55,0.18)] border border-gold/20'}`}
      >
         {/* Top Header Panel */}
        <div className="px-5 py-4 z-40 bg-black flex justify-between items-center border-b border-white/5 relative shadow-md">
          <div className="flex flex-col">
             <h3 className="text-gold font-black italic uppercase text-lg flex items-center gap-2">
               <Rotate3D size={18} className="text-gold" />
               SCANNER 3D
             </h3>
             <p className="text-white font-bold uppercase text-[10px] mt-0.5 opacity-80 break-words">{exercise.name}</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsFullscreen(!isFullscreen)} 
               className="p-2 bg-white/5 text-white/70 rounded-full hover:text-white hover:bg-white/10 transition-colors pointer-events-auto flex items-center justify-center"
               title={isFullscreen ? "Minimizar" : "Tela Cheia"}
             >
               {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
             </button>
             <button 
               onClick={() => setIsPlaying(!isPlaying)} 
               className="p-2 bg-gold/10 text-gold rounded-full hover:text-black hover:bg-gold transition-colors pointer-events-auto flex items-center justify-center"
               title={isPlaying ? "Pausar Simulação" : "Retomar Simulação"}
             >
               {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
             </button>
             <button 
               onClick={onClose} 
               className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto"
               title="Fechar"
             >
               <X size={20} />
             </button>
          </div>
        </div>
        
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-6">
          
          {/* Section 1: Video Visualization Embed */}
          {/* Medium size screen proportion layout */}
          <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[50vh]' : 'h-[350px] sm:h-[420px]'} bg-[#030303] flex items-center justify-center overflow-hidden border-b border-white/5 transition-all duration-300`}>
             {/* Gradient glow behind video */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,rgba(0,0,0,0)_70%)]" />

             {/* Webkit Mask to cleanly cut off edges and hide Pinterest branding */}
             <div 
                className={`w-full h-full flex items-center justify-center relative z-10 transition-all duration-500`}
                style={{ 
                   WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 95%)',
                   maskImage: 'linear-gradient(to bottom, black 80%, transparent 95%)'
                }}
             >
                {/* Scaled iframe container to isolate the video from borders */}
                <div className={`w-[345px] h-[714px] flex items-center justify-center origin-center transform ${isFullscreen ? 'scale-[0.8] sm:scale-100 -translate-y-8 sm:-translate-y-0' : 'scale-[0.6] sm:scale-[0.7] -translate-y-16'} relative transition-all duration-500`}>
                  <iframe 
                     src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}&autoplay=1&mute=1&loop=1`}
                     title="Animação do Exercício"
                     className={`w-[345px] h-[714px] border-0 transition-opacity duration-300 ${!isPlaying ? 'opacity-0' : 'opacity-100'}`}
                     style={{ border: 0 }}
                     scrolling="no" 
                  />
                  {!isPlaying && (
                     <div className="absolute inset-0 bg-black border border-gold/10 shadow-[0_0_50px_rgba(212,175,55,0.05)] rounded-3xl flex items-center justify-center" />
                  )}
                </div>
             </div>
             
             {/* Absolute overlay shield removed to allow clicks */}
          </div>

          {/* Section 2: Info (Guia de Execução) */}
          <div className="p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-white/5 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            <p className="text-[11px] uppercase font-bold font-mono tracking-widest text-gold mb-2.5 flex items-center gap-2">
               <Activity size={12} className="text-gold" /> GUIA DE EXECUÇÃO
            </p>
            <p className="text-xs text-white/90 leading-relaxed font-mono tracking-wide">{exercise.description || bio.tips}</p>
          </div>

          {/* Section 3: Biomechanic Scanner */}
          <div className="p-6 bg-neutral-950 flex flex-col relative overflow-hidden">
             
             {/* scanner ambient background */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04] pointer-events-none mix-blend-overlay" />
             
             <p className="text-[11px] uppercase font-bold font-mono tracking-widest text-gold mb-3 flex items-center gap-2 relative z-10">
               <Cpu size={12} className="text-gold" /> TELEMETRIA BIOMECÂNICA
             </p>

             <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-black/60 border border-gold/15 rounded-xl p-3.5 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    <span className="block text-[8px] font-mono text-gold uppercase tracking-widest leading-none mb-1">{bio.metricName}</span>
                    <span className="text-xl font-bold font-mono text-white animate-pulse block">{currentAngle}°</span>
                </div>
                
                <div className="bg-black/60 border border-gold/10 rounded-xl p-3.5 backdrop-blur-sm">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase leading-none mb-1">ARTICULAÇÃO ALVO</span>
                    <span className="text-xs font-mono font-bold text-white uppercase block leading-tight">{bio.jointName}</span>
                </div>
                
                <div className="bg-black/60 border border-gold/10 rounded-xl p-4 backdrop-blur-sm col-span-2 flex flex-col gap-1.5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                   <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/5">
                       <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_5px_#D4AF37] animate-pulse" />
                       <span className="text-[9px] font-bold font-mono text-gold uppercase tracking-widest leading-none">SYS_OK / TRACKING_ACTIVE</span>
                   </div>
                   
                   <p className="text-[10px] font-mono text-slate-400 flex justify-between items-center">
                     <span>ESTRUTURA COMPÓSITA:</span> 
                     <span className="text-white font-bold">{muscle}</span>
                   </p>
                   <p className="text-[10px] font-mono text-slate-400 flex justify-between items-center">
                     <span>FOCO NEURAL:</span> 
                     <span className="text-white">{bio.loadFocus}</span>
                   </p>
                   <p className="text-[10px] font-mono text-slate-400 flex justify-between items-center text-right">
                     <span>AÇÃO MOTRIZ:</span> 
                     <span className="text-white ml-2">{bio.primaryTrigger}</span>
                   </p>
                </div>
             </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
});

Exercise3DViewer.displayName = 'Exercise3DViewer';
