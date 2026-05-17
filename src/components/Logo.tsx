import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Dumbbell, Sparkles } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const TeamLittleLogo = () => {
  const [imageError, setImageError] = useState(false);
  const [logoUrl, setLogoUrl] = useState("https://i.ibb.co/qYQQb0H1/file-00000000a510720e9e72df18c9f018c8.png");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "app"), (snap) => {
      if (snap.exists() && snap.data().logoUrl) {
        setLogoUrl(snap.data().logoUrl);
      }
    });
    return () => unsub();
  }, []);

  return (
    <motion.div 
      className="relative flex items-center justify-center w-80 h-80 sm:w-[22rem] sm:h-[22rem] md:w-[26rem] md:h-[26rem]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -10, 0],
      }}
      transition={{ 
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 1 },
        scale: { type: "spring", damping: 15 }
      }}
    >
      {/* Sparks coming from inside - Subtle & Professional */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-3 bg-neon rounded-full"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
              x: (Math.random() - 0.5) * 320,
              y: (Math.random() - 0.5) * 320,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Main Logo Container - Larger internal size, with hugging circle */}
      <div className="z-10 relative flex items-center justify-center w-[85%] h-[85%] sm:w-[80%] sm:h-[80%]">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-neon/10 blur-[50px] rounded-full animate-pulse" />
        
        {/* Rotating Golden Neon Circle - Hugging the true bounds */}
        <motion.div
          className="absolute inset-[6px] rounded-full border-2 border-neon shadow-[0_0_15px_rgba(57,255,20,0.5),inset_0_0_15px_rgba(57,255,20,0.3)] border-t-transparent border-r-transparent z-20 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute inset-[0px] rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_0_15px_rgba(255,255,255,0.1)] border-b-transparent border-l-transparent z-20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative bg-black/40 backdrop-blur-2xl p-0 rounded-full border border-white/5 shadow-[0_0_80px_rgba(57,255,20,0.05)] flex items-center justify-center w-full h-full z-10 overflow-hidden">
          {!imageError ? (
            <img
              src={logoUrl}
              alt="TEAM LITTLE PRO Logo"
              className="w-full h-full object-cover scale-[1.15]"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Dumbbell className="text-neon w-20 h-20 mb-4" />
              <Sparkles className="text-white w-10 h-10 absolute animate-bounce" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
