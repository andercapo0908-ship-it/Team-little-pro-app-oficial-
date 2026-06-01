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

  const bio = getBiomechanicalDetails(muscle);

  // High performance SVG motion skeleton simulation per muscle group
  const renderBiomechanicalSkeleton = (group: string) => {
    // Generate motion keyframes depending on exercise structure
    const isChest = group === 'Peitoral';
    const isBiceps = group === 'Bíceps';
    const isTriceps = group === 'Tríceps';
    const isLegs = ['Quadríceps', 'Glúteo', 'Posterior', 'Panturrilhas'].includes(group);
    const isBack = group === 'Costas';
    const isShoulder = group === 'Ombros';

    return (
      <svg viewBox="0 0 400 400" className="w-[85%] h-[85%] select-none pointer-events-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] z-20">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Circular Tech Border */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4, 12" className="opacity-30" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="300, 40" className="opacity-20 animate-spin" style={{ animationDuration: '30s' }} />

        {/* Grid Background Lines inside radar */}
        <line x1="200" y1="30" x2="200" y2="370" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 6" className="opacity-15" />
        <line x1="30" y1="200" x2="370" y2="200" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 6" className="opacity-15" />

        {/* 1. BENCH PRESS (Peitoral) */}
        {isChest && (
          <g>
            {/* Flat Bench */}
            <line x1="100" y1="280" x2="300" y2="280" stroke="#FFFFFF" strokeWidth="4" className="opacity-20" />
            <line x1="150" y1="280" x2="150" y2="320" stroke="#FFFFFF" strokeWidth="4" className="opacity-20" />
            <line x1="250" y1="280" x2="250" y2="320" stroke="#FFFFFF" strokeWidth="4" className="opacity-20" />

            {/* Simulated chest base */}
            <circle cx="200" cy="260" r="18" fill="none" stroke="#D4AF37" strokeWidth="2" className="opacity-30" />
            <circle cx="200" cy="260" r="5" fill="#D4AF37" className="opacity-90 animate-pulse" />

            {/* Hands & Barbell Motion */}
            <motion.g
              animate={{ y: [0, 90, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Barbell Bar */}
              <line x1="80" y1="130" x2="320" y2="130" stroke="#D4AF37" strokeWidth="4" />
              {/* Left Plate */}
              <rect x="68" y="110" width="12" height="40" rx="3" fill="#C0C0C0" stroke="#D4AF37" strokeWidth="1" />
              <rect x="58" y="115" width="10" height="30" rx="2" fill="#D4AF37" />
              {/* Right Plate */}
              <rect x="320" y="110" width="12" height="40" rx="3" fill="#C0C0C0" stroke="#D4AF37" strokeWidth="1" />
              <rect x="332" y="115" width="10" height="30" rx="2" fill="#D4AF37" />

              {/* Glowing Hands */}
              <circle cx="160" cy="130" r="6" fill="#D4AF37" className="shadow-[0_0_10px_#D4AF37]" />
              <circle cx="240" cy="130" r="6" fill="#D4AF37" className="shadow-[0_0_10px_#D4AF37]" />
            </motion.g>

            {/* Arm Skeletal Joint Links connected dynamically */}
            <motion.g>
              <line x1="160" y1="260" x2="140" y2="210" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
              <line x1="240" y1="260" x2="260" y2="210" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
            </motion.g>

            {/* Dynamic Arms to weight */}
            <svg x="0" y="0" width="400" height="400">
              <rect x="190" y="190" width="20" height="20" fill="none" />
              {/* Action Vectors */}
              <path d="M 200 240 L 200 160" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 5" className="opacity-70 animate-pulse" />
              <polygon points="200,150 195,160 205,160" fill="#D4AF37" />
            </svg>
          </g>
        )}

        {/* 2. BICEPS CURL (Bíceps) */}
        {isBiceps && (
          <g>
            {/* Backrest/Stand stool */}
            <path d="M 170 330 L 170 200 L 150 150" fill="none" stroke="#FFFFFF" strokeWidth="3" className="opacity-20" />

            {/* Shoulder point (fixed) */}
            <circle cx="170" cy="160" r="6" fill="#C0C0C0" />
            
            {/* Arm & Bell Animation */}
            {/* Base Body Anchor */}
            <circle cx="170" cy="240" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="opacity-30" />

            {/* dynamic arm forearm swing */}
            <motion.g
              animate={{ rotate: [0, -85, 0] }}
              style={{ originX: '170px', originY: '235px' }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Forearm */}
              <line x1="170" y1="235" x2="260" y2="235" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round" />
              
              {/* Hand & Dumbbell */}
              <circle cx="260" cy="235" r="7" fill="#D4AF37" />
              {/* Dumbbell */}
              <line x1="260" y1="210" x2="260" y2="260" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="260" cy="210" r="12" fill="#D4AF37" />
              <circle cx="260" cy="260" r="12" fill="#D4AF37" />
              <line x1="248" y1="235" x2="272" y2="235" stroke="#000" strokeWidth="2" />
            </motion.g>

            {/* Biceps Highlight overlay - flashing intensely at peak contraction */}
            <motion.ellipse
              cx="190"
              cy="200"
              rx="15"
              ry="10"
              fill="url(#glow)"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        )}

        {/* 3. TRICEPS EXTENSION (Tríceps) */}
        {isTriceps && (
          <g>
            {/* Fixed overhead cable pulley anchor */}
            <circle cx="200" cy="80" r="14" fill="#111" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="200" cy="80" r="4" fill="#D4AF37" />

            {/* Body Posture */}
            <path d="M 160 140 L 160 280 L 140 350" fill="none" stroke="#FFFFFF" strokeWidth="3" className="opacity-15" />
            
            {/* Shoulder pivot (fixed) */}
            <circle cx="175" cy="145" r="5" fill="#C0C0C0" />

            {/* Upper Arm (fixed) */}
            <line x1="175" y1="145" x2="190" y2="195" stroke="#D4AF37" strokeWidth="3.5" />
            
            {/* Forearm & Bar Swing (pivots about elbow at 190, 195) */}
            <motion.g
              animate={{ rotate: [-60, 30, -60] }}
              style={{ originX: '190px', originY: '195px' }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Forearm Line */}
              <line x1="190" y1="195" x2="225" y2="265" stroke="#D4AF37" strokeWidth="4.5" strokeLinecap="round" />
              {/* Pulley Handle grip */}
              <circle cx="225" cy="265" r="7" fill="#D4AF37" />
              <line x1="210" y1="265" x2="240" y2="265" stroke="#FFFFFF" strokeWidth="3.5" />
            </motion.g>

            {/* Pulley Cable Line */}
            <svg x="0" y="0" width="400" height="400">
               <polygon points="190,195 200,80 200,80" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="3 3" />
            </svg>
          </g>
        )}

        {/* 4. SQUATS (Quadríceps / Pernas) */}
        {isLegs && (
          <g>
            {/* Ground Line */}
            <line x1="80" y1="340" x2="320" y2="340" stroke="#FFFFFF" strokeWidth="2" className="opacity-30" />

            {/* Dynamic Joint coordinates map representing full body kneeling squat */}
            <motion.g
              animate={{ 
                y: [0, 80, 0] // Entire chest & upper skeleton goes up and down
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Back Barbell Bar Resting on Shoulders */}
              <rect x="145" y="115" width="110" height="12" rx="3" fill="#D4AF37" className="opacity-90" />
              {/* Plates */}
              <rect x="125" y="100" width="20" height="42" rx="4" fill="#C0C0C0" stroke="#D4AF37" strokeWidth="1" />
              <rect x="255" y="100" width="20" height="42" rx="4" fill="#C0C0C0" stroke="#D4AF37" strokeWidth="1" />

              {/* Spine/Hip connection */}
              <line x1="200" y1="125" x2="200" y2="210" stroke="#FFFFFF" strokeWidth="4" />
              <circle cx="200" cy="210" r="8" fill="#D4AF37" />
            </motion.g>

            {/* Real-time Knees / Thigh bending motion simulation */}
            <motion.svg x="0" y="0" width="400" height="400">
              {/* Anchor Feet at exactly (160, 340) and (240,340) */}
              <line x1="160" y1="340" x2="160" y2="330" stroke="#D4AF37" strokeWidth="5" />
              <line x1="240" y1="340" x2="240" y2="330" stroke="#D4AF37" strokeWidth="5" />

              {/* Dynamic Knee Pivot coordinates linked in real time */}
              <motion.g
                animate={{ 
                  // Left Knee bending slightly forward and outward
                  transform: ['matrix(1, 0, 0, 1, 0, 0)', 'matrix(1, 0, 0, 1, -25, 45)', 'matrix(1, 0, 0, 1, 0, 0)']
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <circle cx="170" cy="275" r="7" fill="#D4AF37" className="shadow-[0_0_8px_#D4AF37]" />
              </motion.g>

              {/* Right Knee bending synchronized */}
              <motion.g
                animate={{ 
                  transform: ['matrix(1, 0, 0, 1, 0, 0)', 'matrix(1, 0, 0, 1, 25, 45)', 'matrix(1, 0, 0, 1, 0, 0)']
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <circle cx="230" cy="275" r="7" fill="#D4AF37" className="shadow-[0_0_8px_#D4AF37]" />
              </motion.g>
            </motion.svg>

            {/* Glowing force vectors upwards */}
            <motion.path
              d="M 200 330 L 200 240"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeDasharray="4 4"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        )}

        {/* 5. BACK ROWS / PULLDOWN (Costas) */}
        {isBack && (
          <g>
            {/* Pulley Frame */}
            <line x1="150" y1="60" x2="250" y2="60" stroke="#FFFFFF" strokeWidth="3" className="opacity-25" />
            
            {/* Arms pulling Bar down */}
            <motion.g
              animate={{ y: [0, 85, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Lat Pulldown Wide Bar */}
              <path d="M 120 100 Q 200 115 280 100" fill="none" stroke="#D4AF37" strokeWidth="4.5" />
              <circle cx="120" cy="100" r="5" fill="#C0C0C0" />
              <circle cx="280" cy="100" r="5" fill="#C0C0C0" />
            </motion.g>

            {/* Seat platform */}
            <rect x="160" y="290" width="80" height="15" rx="3" fill="#FFFFFF" className="opacity-15" />
            <line x1="200" y1="290" x2="200" y2="350" stroke="#FFFFFF" strokeWidth="4" className="opacity-25" />

            {/* Scapula/Back pulsing rings */}
            <motion.circle
              cx="200"
              cy="210"
              r="25"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              animate={{ scale: [0.5, 1.3, 0.5], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </g>
        )}

        {/* 6. SHOULDER PRESS (Ombros) */}
        {isShoulder && (
          <g>
            {/* Seat Backrest support */}
            <line x1="185" y1="180" x2="185" y2="330" stroke="#FFFFFF" strokeWidth="3" className="opacity-20" strokeLinecap="round" />

            {/* Torso Point */}
            <circle cx="200" cy="180" r="14" fill="none" stroke="#D4AF37" strokeWidth="2" className="opacity-30" />

            {/* Left and Right Shoulders */}
            <circle cx="165" cy="180" r="5" fill="#C0C0C0" />
            <circle cx="235" cy="180" r="5" fill="#C0C0C0" />

            {/* Two Dumbbells press motion */}
            <motion.g
              animate={{ y: [45, -55, 45] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Left Dumbbell */}
              <line x1="130" y1="150" x2="130" y2="180" stroke="#FFFFFF" strokeWidth="3.5" />
              <circle cx="130" cy="150" r="11" fill="#D4AF37" />
              <circle cx="130" cy="180" r="11" fill="#D4AF37" />

              {/* Right Dumbbell */}
              <line x1="270" y1="150" x2="270" y2="180" stroke="#FFFFFF" strokeWidth="3.5" />
              <circle cx="270" cy="150" r="11" fill="#D4AF37" />
              <circle cx="270" cy="180" r="11" fill="#D4AF37" />
            </motion.g>

            {/* Vector lines tracking hand paths */}
            <line x1="130" y1="100" x2="130" y2="230" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-25" />
            <line x1="270" y1="100" x2="270" y2="230" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-25" />
          </g>
        )}

        {/* 7. CARDIO / DEFAULT HEART GRAPHIC */}
        {!isChest && !isBiceps && !isTriceps && !isLegs && !isBack && !isShoulder && (
          <g>
            <motion.g
              animate={{ scale: [1, 1.15, 0.95, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '200px', originY: '180px' }}
            >
              {/* Golden neon heart wireframe symbol */}
              <path
                d="M 200 140 Q 230 100 260 140 Q 295 180 200 240 Q 105 180 140 140 Q 170 100 200 140"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="4.5"
                strokeLinecap="round"
                className="shadow-[0_0_15px_#D4AF37]"
              />
            </motion.g>

            {/* ECG Electrocardiogram rhythm tracker trace line inside scanner */}
            <motion.path
              d="M 80 200 L 140 200 L 155 170 L 170 240 L 185 150 L 200 220 L 215 190 L 230 200 L 320 200"
              fill="none"
              stroke="#C0C0C0"
              strokeWidth="1.5"
              strokeDasharray="400"
              animate={{ strokeDashoffset: [400, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        )}
      </svg>
    );
  };

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

          {/* Interactive Mechanical Vector Radar View */}
          {renderBiomechanicalSkeleton(muscle)}

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
