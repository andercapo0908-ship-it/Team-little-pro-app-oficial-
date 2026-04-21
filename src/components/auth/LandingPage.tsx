import React from "react";
import { motion } from "motion/react";
import { TeamLittleLogo } from "../Logo";

interface LandingPageProps {
  onSelectRole: (role: 'student' | 'trainer') => void;
}

export const LandingPage = React.memo(({ onSelectRole }: LandingPageProps) => (
  <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 text-white overflow-hidden relative">
    {/* High-End Technical Background Elements */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dynamic Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-600/10 blur-[180px] rounded-full" 
      />
      
      {/* Technical Grid / Frame Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>

    {/* Main Container - Strictly within screen bounds */}
    <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto relative z-10">
      
      {/* Top Section: Hero Logo */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[40%]">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="relative flex items-center justify-center"
        >
          <TeamLittleLogo />
        </motion.div>
      </div>
      
      {/* Middle Section: Branding */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', damping: 20 }}
        className="flex flex-col items-center justify-center w-full py-6"
      >
        <div className="relative inline-flex items-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-[0.2em] italic uppercase leading-none flex items-center gap-3 sm:gap-6 md:gap-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <span className="text-[#CA9B00]">TEAM</span>
            <span className="text-white">LITTLE</span>
          </h1>
          
          <motion.div 
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ type: 'spring', damping: 12, delay: 1 }}
            className="absolute -top-3 -right-3 md:-top-6 md:-right-8 bg-[#CA9B00] text-black px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] md:text-sm font-black italic rounded-[2px] shadow-[0_4px_20px_rgba(202,155,0,0.4)] border border-black/10 z-20"
          >
            PRO
          </motion.div>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-6 opacity-60">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#CA9B00]" />
          <p className="text-[#CA9B00] text-[9px] sm:text-[10px] tracking-[0.6em] uppercase font-black whitespace-nowrap">Elite Performance Division</p>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#CA9B00]" />
        </div>
      </motion.div>

      {/* Bottom Section: Actions */}
      <div className="w-full space-y-3 pb-8 md:pb-12 mt-4">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectRole('student')}
          className="w-full py-5 bg-white text-black font-black italic rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:shadow-none"
        >
          SOU ALUNO
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(202,155,0,0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectRole('trainer')}
          className="w-full py-5 bg-transparent border-2 border-[#CA9B00]/40 text-[#CA9B00] font-black italic rounded-xl transition-all uppercase tracking-[0.2em] text-sm hover:border-[#CA9B00] backdrop-blur-sm"
        >
          SOU PERSONAL
        </motion.button>
        
        {/* Quality Indicator */}
        <div className="flex justify-center pt-6 opacity-20">
           <div className="w-2 h-2 rounded-full bg-white/50 mx-1" />
           <div className="w-2 h-2 rounded-full bg-white/50 mx-1" />
           <div className="w-2 h-2 rounded-full bg-[#CA9B00] mx-1" />
        </div>
      </div>

    </div>
  </div>
));

LandingPage.displayName = 'LandingPage';
