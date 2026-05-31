import React from "react";
import { motion } from "motion/react";
import { TeamLittleLogo } from "../Logo";

interface LandingPageProps {
  onSelectRole: (role: 'student' | 'trainer') => void;
}

export const LandingPage = React.memo(({ onSelectRole }: LandingPageProps) => (
  <div className="h-screen w-screen bg-premium-black flex flex-col items-center justify-center p-4 md:p-8 text-white overflow-hidden relative">
    
    {/* Intro Trainer Photo Animation */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95, display: "flex" }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.95, 1.0, 1.01, 1.03], transitionEnd: { display: "none" } }}
      transition={{ duration: 0.6, times: [0, 0.15, 0.85, 1], ease: "easeOut" }}
      className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-premium-black"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <img 
          src="https://i.ibb.co/mVWY4CpG/6ea4457d-c1ab-4e91-87a2-13cf3e0b688b.png" 
          alt="Warlyson" 
          className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(212,175,55,0.2)] gpu-accelerated"
          loading="eager"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-premium-black via-transparent to-transparent pointer-events-none opacity-80" />
        
        <div className="absolute bottom-16 md:bottom-24 z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-silver uppercase tracking-[0.1em] md:tracking-[0.2em] drop-shadow-2xl text-center leading-none">
            WARLYSON
          </h1>
          <div className="mt-2 text-transparent bg-clip-text bg-gradient-to-r from-silver via-white to-gold text-xl md:text-3xl tracking-[0.4em] font-black uppercase">
            PERSONAL
          </div>
        </div>
      </div>
    </motion.div>

    {/* High-End Technical Background Elements */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dynamic Glow */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.2, 0.15]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/10 blur-[180px] rounded-full" 
      />
      
      {/* Technical Grid / Frame Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.85)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>

    {/* Main Container - Strictly within screen bounds */}
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto relative z-10"
    >
      
      {/* Top Section: Hero Logo */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[40%]">
        <div className="relative flex items-center justify-center">
          <TeamLittleLogo />
        </div>
      </div>
      
      {/* Middle Section: Branding */}
      <div className="flex flex-col items-center justify-center w-full py-4">
        <div className="relative inline-flex items-center">
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-black tracking-[0.1em] italic uppercase leading-none flex items-center gap-2 sm:gap-4 md:gap-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <span className="text-stroke-black">TEAM</span>
            <span className="text-stroke-black">LITTLE</span>
          </h1>
          
          <div className="absolute -top-3 -right-6 bg-gradient-to-r from-gold to-silver text-premium-black px-2.5 py-1 text-[8px] md:text-xs font-black italic rounded-[4px] shadow-[0_0_15px_rgba(214,175,55,0.4)] border border-black/10 z-20">
            PRO
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6 opacity-100">
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-gold" />
          <p className="text-silver text-[8px] sm:text-[9px] tracking-[0.5em] uppercase font-black whitespace-nowrap">Elite Performance Division</p>
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-gold" />
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="w-full max-w-[220px] sm:max-w-[240px] space-y-3 pb-8 md:pb-12 mt-4 mx-auto animate-fluid-entrance">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectRole('student')}
          className="w-full py-3.5 bg-gold text-premium-black font-black italic rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-[10px] sm:text-[11px] shadow-[0_10px_35px_rgba(212,175,55,0.25)] border border-gold/40 shimmer-btn-effect cursor-pointer"
        >
          SOU ALUNO
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, borderColor: "#FFFFFF", boxShadow: "0 0 20px rgba(192,192,192,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectRole('trainer')}
          className="w-full py-3.5 bg-transparent border-2 border-silver text-white font-black italic rounded-xl transition-all uppercase tracking-[0.2em] text-[10px] sm:text-[11px] backdrop-blur-sm shimmer-btn-effect cursor-pointer"
        >
          SOU PERSONAL
        </motion.button>
        
        {/* Quality Indicator */}
        <div className="flex justify-center pt-6 opacity-45">
           <div className="w-1.5 h-1.5 rounded-full bg-silver mx-1" />
           <div className="w-1.5 h-1.5 rounded-full bg-silver mx-1" />
           <div className="w-1.5 h-1.5 rounded-full bg-gold mx-1 animate-pulse" />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] sm:text-[11px] tracking-[0.2em] font-black uppercase text-neutral-300 font-sans">
            team little pro app oficial
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.25em] font-bold text-silver uppercase font-mono">
            DESENVOLVIDO POR ANDERSON DUENDE
          </span>
        </div>
      </div>

    </motion.div>
  </div>
));

LandingPage.displayName = 'LandingPage';
