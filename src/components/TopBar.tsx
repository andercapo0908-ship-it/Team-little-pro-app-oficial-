import React, { useState, useEffect } from "react";
import { Menu, LogOut, ChevronLeft } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface TopBarProps {
  onOpenSidebar: () => void;
  onLogout: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

const ORIGINAL_LOGO = "https://i.ibb.co/qYQQb0H1/file-00000000a510720e9e72df18c9f018c8.png";

export const TopBar = React.memo(({ onOpenSidebar, onLogout, onBack, canGoBack }: TopBarProps) => {
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
    <header className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Menu / Back */}
      <div className="flex-1 flex items-center justify-start">
        {canGoBack && onBack ? (
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 text-slate-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <button 
            onClick={onOpenSidebar} 
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 text-amber-500"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Center: Logo & App Name */}
      <div className="flex-1 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 relative flex items-center justify-center">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-black italic tracking-widest text-[10px] sm:text-xs text-amber-500">TEAM</span>
          <span className="font-black italic tracking-widest text-[10px] sm:text-xs text-white">LITTLE</span>
        </div>
      </div>
      
      {/* Right side: Logout */}
      <div className="flex-1 flex items-center justify-end">
        <button 
          onClick={onLogout}
          className="p-2.5 text-slate-400 hover:text-red-500 transition-all bg-white/5 hover:bg-red-500/10 rounded-xl border border-white/5 hover:border-red-500/20"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
