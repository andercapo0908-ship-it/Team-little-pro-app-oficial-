import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, MessageCircle, CalendarCheck, ChevronRight } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AppSettings, UserProfile } from "../types";

export const HomeTab = React.memo(({ profile, onNavigate }: { profile: UserProfile | null, onNavigate?: (tab: string) => void }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "app"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as AppSettings);
    });
    return () => unsub();
  }, []);

  const handleCheckIn = () => {
    setCheckedIn(true);
    // In a real scenario, this would save to Firestore with the current date.
  };

  return (
    <div className="flex flex-col pb-32 pt-2 space-y-6">
      
      {/* Motivational Marquee */}
      <div className="w-full bg-neon overflow-hidden py-2 relative flex items-center border-y border-white/10 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          style={{ willChange: "transform" }}
          className="whitespace-nowrap flex"
        >
          <span className="text-black font-black italic uppercase tracking-[0.2em] text-[10px] mx-4">
            TEAM LITTLE PRO • A DOR É TEMPORÁRIA, A GLÓRIA É ETERNA • PERFORMANCE DE ELITE • NO LIMITS • 
          </span>
          <span className="text-black font-black italic uppercase tracking-[0.2em] text-[10px] mx-4">
            TEAM LITTLE PRO • A DOR É TEMPORÁRIA, A GLÓRIA É ETERNA • PERFORMANCE DE ELITE • NO LIMITS • 
          </span>
        </motion.div>
      </div>

      <div className="px-6 space-y-6 max-w-3xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="text-center mb-4 mt-2">
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tight">
            Salve, <span className="text-neon">{profile?.name?.split(' ')[0] || 'Atleta'}</span>!
          </h2>
          <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mt-1">Bem-vindo ao Team Little <span className="text-neon font-black underline underline-offset-4">PRO</span></p>
        </div>

        {/* Daily Check-in */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-300 ${checkedIn ? 'bg-neon/10 border-neon/30' : 'bg-neutral-900 border-white/5'}`}
        >
          <div className="flex justify-between items-center z-10 relative">
            <div>
              <h3 className="text-white font-black italic uppercase text-lg flex items-center gap-2">
                <CalendarCheck className={checkedIn ? "text-neon" : "text-slate-400"} size={20} />
                Check-in PRO
              </h3>
              <p className="text-slate-400 text-[10px] uppercase font-mono tracking-widest mt-1">
                {checkedIn ? "Atleta em atividade!" : "Confirme sua prontidão hoje"}
              </p>
            </div>
            <button 
              onClick={handleCheckIn}
              disabled={checkedIn}
              className={`px-6 py-3 rounded-xl font-black italic uppercase text-[10px] tracking-widest transition-all ${
                checkedIn 
                ? 'bg-neon/20 text-neon cursor-not-allowed' 
                : 'bg-neon text-black hover:bg-white shadow-[0_0_15px_rgba(57,255,20,0.3)]'
              }`}
            >
              {checkedIn ? "Focado" : "Entrar no Game"}
            </button>
          </div>
          {checkedIn && <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 blur-[40px] rounded-full" />}
        </motion.div>

        {/* Global Announcements */}
        <div className="p-6 bg-gradient-to-br from-neutral-900 to-black border border-white/5 rounded-[2rem] relative overflow-hidden shadow-xl">
          <h4 className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2 font-bold">
            <Bell size={14} /> Painel de Avisos
          </h4>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">Aviso Global</span>
              <p className="text-white text-sm font-medium">{settings?.globalAnnouncement || "Sem novos avisos no momento."}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 block">Nota do Coach</span>
              <p className="text-slate-300 text-sm italic">{settings?.coachNote || "Você está no caminho certo!"}</p>
            </div>
          </div>
        </div>

        {/* Direct Link */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          onClick={() => onNavigate && onNavigate('consulting')}
          className="w-full p-6 bg-gradient-to-r from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-between text-left group transition-all duration-300 hover:border-blue-500/50"
        >
          <div>
            <h3 className="text-blue-400 font-black italic uppercase text-lg flex items-center gap-2 mb-1">
              <MessageCircle size={20} />
              Direct com o Personal
            </h3>
            <p className="text-slate-400 text-[10px] uppercase font-mono tracking-widest">Tire dúvidas ou reajuste treinos</p>
          </div>
          <ChevronRight className="text-blue-400 group-hover:translate-x-2 transition-transform" />
        </motion.button>

      </div>
    </div>
  )
});

HomeTab.displayName = 'HomeTab';
