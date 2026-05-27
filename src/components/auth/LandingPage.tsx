import React from "react";
import { motion } from "motion/react";
import { TeamLittleLogo } from "../Logo";

interface LandingPageProps {
  onSelectRole: (role: 'student' | 'trainer') => void;
}

export const LandingPage = React.memo(({ onSelectRole }: LandingPageProps) => (
  <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 text-white overflow-hidden relative">
    
    {/* Intro Trainer Photo Animation */}
    <motion.div
      initial={{ opacity: 0, scale: 0.6, display: "flex" }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1.15], transitionEnd: { display: "none" } }}
      transition={{ duration: 4, times: [0, 0.2, 0.8, 1], ease: "easeOut" }}
      className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <img 
          src="https://i.ibb.co/mVWY4CpG/6ea4457d-c1ab-4e91-87a2-13cf3e0b688b.png" 
          alt="Warlyson" 
          className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(225,173,1,0.2)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-80" />
        
        <div className="absolute bottom-16 md:bottom-24 z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-[#C59B27] via-[#F2D06B] to-[#C59B27] uppercase tracking-[0.1em] md:tracking-[0.2em] drop-shadow-2xl text-center">
            WARLYSON
          </h1>
          <div className="mt-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 text-xl md:text-3xl tracking-[0.4em] font-black uppercase">
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
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-neon/10 blur-[180px] rounded-full" 
      />
      
      {/* Technical Grid / Frame Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>

    {/* Main Container - Strictly within screen bounds */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5, duration: 1 }}
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
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-black tracking-[0.2em] italic uppercase leading-none flex items-center gap-2 sm:gap-4 md:gap-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <span className="text-neon">TEAM</span>
            <span className="text-white">LITTLE</span>
          </h1>
          
          <div className="absolute -top-3 -right-3 md:-top-4 md:-right-6 bg-neon text-black px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] md:text-xs font-black italic rounded-[2px] shadow-[0_4px_20px_rgba(57,255,20,0.4)] border border-black/10 z-20">
            PRO
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6 opacity-60">
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-neon" />
          <p className="text-neon text-[8px] sm:text-[9px] tracking-[0.5em] uppercase font-black whitespace-nowrap">Elite Performance Division</p>
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-neon" />
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="w-full max-w-[220px] sm:max-w-[240px] space-y-3 pb-8 md:pb-12 mt-4 mx-auto">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#39FF14", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectRole('student')}
          className="w-full py-3 bg-neon text-black font-black italic rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-[10px] sm:text-[11px] shadow-[0_10px_30px_rgba(57,255,20,0.2)] active:shadow-none"
        >
          SOU ALUNO
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(57,255,20,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectRole('trainer')}
          className="w-full py-3 bg-transparent border-2 border-neon/40 text-neon font-black italic rounded-xl transition-all uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:border-neon backdrop-blur-sm"
        >
          SOU PERSONAL
        </motion.button>
        
        {/* Quality Indicator */}
        <div className="flex justify-center pt-6 opacity-20">
           <div className="w-1.5 h-1.5 rounded-full bg-white/50 mx-1" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/50 mx-1" />
           <div className="w-1.5 h-1.5 rounded-full bg-neon mx-1" />
        </div>
      </div>

    </motion.div>
  </div>
));

LandingPage.displayName = 'LandingPage';
