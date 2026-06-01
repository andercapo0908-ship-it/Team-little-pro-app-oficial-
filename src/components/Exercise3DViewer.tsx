import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Rotate3D, Activity, ShieldAlert, Cpu, Heart } from 'lucide-react';
import { Exercise } from '../types';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export const Exercise3DViewer = React.memo(({ exercise, onClose }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(180);

  useEffect(() => {
    setMounted(true);
    // Dynamic angle multiplier update to simulate real-time HUD tracker
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      // Oscillate angle between 70 and 175 degrees
      const angle = Math.round(122.5 + Math.sin(time * 3) * 52.5);
      setCurrentAngle(angle);
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

  const getPinterestId = (group: string) => {
    // Retornando a mesma animação para todos como solicitado.
    return '628604060531833013';
  };

  const bio = getBiomechanicalDetails(muscle);
  const pinId = getPinterestId(muscle);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8">
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
        initial={{ scale: 0.9, opacity: 0, rotateX: 20 }} 
        animate={{ scale: 1, opacity: 1, rotateX: 0 }} 
        exit={{ scale: 0.95, opacity: 0 }} 
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-lg aspect-[3/4] sm:aspect-[4/5] bg-neutral-950 rounded-[2.5rem] overflow-hidden relative z-10 shadow-[0_0_60px_rgba(212,175,55,0.18)] flex flex-col border border-gold/30"
      >
        {/* Top Header Panel */}
        <div className="absolute top-0 inset-x-0 p-6 z-40 bg-gradient-to-b from-black via-black/80 to-transparent flex flex-col items-start pointer-events-none pb-12">
          <h3 className="text-gold font-black italic uppercase text-xl sm:text-2xl drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)] flex items-center gap-2">
            <Rotate3D size={22} className="animate-slow-spin text-gold" />
            Scanner Biomecânico 3D
          </h3>
          <p className="text-white font-black uppercase text-sm mt-1 sm:mt-1.5 max-w-[80%] break-words leading-tight">{exercise.name}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-gold/10 text-gold text-[8px] font-bold font-mono uppercase tracking-widest rounded-md border border-gold/20 flex items-center gap-1">
              <Activity size={10} className="animate-pulse" />
              Simulação de Movimento
            </span>
          </div>
        </div>
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 bg-black/60 p-3 rounded-full text-white/50 hover:text-gold hover:bg-gold/10 z-50 transition-all border border-white/10 backdrop-blur-md cursor-pointer pointer-events-auto shadow-lg hover:scale-110"
          title="Fechar"
        >
          <X size={20} />
        </button>

        {/* Biomechanical Visualization Frame */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(40,30,5,0.85)_0%,rgba(0,0,0,1)_100%)] overflow-hidden">
          
          {/* Cyberpunk Grid Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.06] mix-blend-overlay z-10 pointer-events-none rounded-[2.5rem] scale-[2.5]" style={{ backgroundSize: '40px' }} />
          
          {/* Scanning Line overlay */}
          <motion.div 
            className="absolute inset-x-0 h-1 bg-gold/70 shadow-[0_0_20px_rgba(212,175,55,0.9)] z-30 rounded-full blur-[1px]"
            animate={{ top: ['-10%', '110%', '-10%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Pinterest Animation Embed Content */}
          <div className="absolute inset-x-0 inset-y-16 sm:inset-y-20 z-20 flex items-center justify-center pointer-events-auto scale-[1.0] sm:scale-[1.1] pb-10">
            <div className="w-[85%] h-full rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-black/40 ring-1 ring-gold/20 backdrop-blur-md">
              <iframe 
                 src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`}
                 title="Animação do Exercício"
                 className="w-full h-full object-cover border-0"
                 style={{ border: 0 }}
                 scrolling="no" 
              />
            </div>
          </div>

          {/* Floating Live Sensor Telemetry on the Right */}
          <div className="absolute top-1/3 right-6 z-30 pointer-events-none flex flex-col gap-2 items-end">
             <div className="bg-black/60 border border-gold/20 rounded-xl p-2.5 backdrop-blur-sm text-right">
                <span className="block text-[8px] font-mono text-gold uppercase tracking-widest">{bio.metricName}</span>
                <span className="text-sm font-bold font-mono text-white animate-pulse">{currentAngle}°</span>
             </div>
             <div className="bg-black/60 border border-gold/10 rounded-xl p-2.5 backdrop-blur-sm text-right">
                <span className="block text-[7px] font-mono text-slate-500 uppercase">ARTICULAÇÃO</span>
                <span className="text-[9px] font-mono font-bold text-white uppercase">{bio.jointName}</span>
             </div>
          </div>

          {/* HUD Tech Info Panel on the Left */}
          <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
            <div className="text-[7.5px] font-mono text-gold/90 flex flex-col gap-1.5 uppercase tracking-widest drop-shadow-md bg-black/50 p-3 rounded-xl backdrop-blur-sm border border-gold/10">
              <span className="flex items-center gap-1.5 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_5px_#D4AF37]"/> SCANNING STATE // OK</span>
              <span>ESTRUTURA: <span className="text-white font-bold">{muscle}</span></span>
              <span>FOCO: <span className="text-white">{bio.loadFocus}</span></span>
              <span>PONTO DE APOIO: <span className="text-white">{bio.primaryTrigger}</span></span>
            </div>
          </div>
          
          {/* Scientific Crosshairs */}
          <div className="absolute top-1/2 left-4 w-4 h-[1px] bg-gold/50 z-20 opacity-30" />
          <div className="absolute top-1/2 right-4 w-4 h-[1px] bg-gold/50 z-20 opacity-30" />
          <div className="absolute top-4 left-1/2 w-[1px] h-4 bg-gold/50 z-20 opacity-30" />
          <div className="absolute bottom-4 left-1/2 w-[1px] h-4 bg-gold/50 z-20 opacity-30" />
        </div>

        {/* Dynamic Instructional Tips Panel at bottom */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6 pointer-events-none">
            <div className="bg-neutral-900/90 backdrop-blur-lg border border-gold/30 rounded-2xl p-4 sm:p-5 shadow-xl pointer-events-auto max-h-[25vh] overflow-y-auto">
              <p className="text-[10px] uppercase font-bold font-mono tracking-widest text-gold mb-1.5 flex items-center gap-2">
                 <Activity size={12} className="text-gold" /> GUIA COGNITIVO & EXECUÇÃO DO TREINO
              </p>
              <p className="text-xs text-white/95 leading-relaxed font-mono tracking-wide">{exercise.description || bio.tips}</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
});

Exercise3DViewer.displayName = 'Exercise3DViewer';
