import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Dumbbell, Sparkles } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const ORIGINAL_LOGO = "https://i.ibb.co/qYQQb0H1/file-00000000a510720e9e72df18c9f018c8.png";

export const TeamLittleLogo = () => {
  const [imageError, setImageError] = useState(false);
  const [logoUrl, setLogoUrl] = useState(ORIGINAL_LOGO);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "app"), (snap) => {
      if (snap.exists() && snap.data().logoUrl) {
        setLogoUrl(snap.data().logoUrl);
      } else {
        setLogoUrl(ORIGINAL_LOGO);
      }
    });
    return () => unsub();
  }, []);

  return (
    <motion.div 
      className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {/* Main Logo Container - Larger internal size, with hugging circle */}
      <div className="z-10 relative flex items-center justify-center w-[90%] h-[90%] sm:w-[85%] sm:h-[85%]">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-amber-500/10 blur-[40px] rounded-full" />
        
        {/* Rotating Golden Arc */}
        <div
          className="absolute inset-[-6px] rounded-full border-[3px] border-amber-500/10 border-t-amber-500 border-r-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20 pointer-events-none animate-slow-spin gpu-accelerated"
        />

        <div className="relative bg-black/40 backdrop-blur-2xl p-0 rounded-full border border-white/5 shadow-[0_0_80px_rgba(245,158,11,0.05)] flex items-center justify-center w-full h-full z-10 overflow-hidden">
          {!imageError ? (
            <img
              src={logoUrl}
              alt="TEAM LITTLE PRO Logo"
              className="w-full h-full object-cover scale-[1.12]"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Dumbbell className="text-amber-500 w-20 h-20 mb-4" />
              <Sparkles className="text-white w-10 h-10 absolute animate-bounce" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
