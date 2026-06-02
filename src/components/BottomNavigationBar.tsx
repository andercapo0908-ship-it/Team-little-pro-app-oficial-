import React from 'react';
import { Home, Dumbbell, ShoppingBag, MessageSquare, User, Video } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  role?: string;
}

export const BottomNavigationBar = React.memo(({ activeTab, onTabChange, role }: BottomNavProps) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell },
    { id: 'library', label: 'Biblioteca', icon: Video },
    { id: 'store', label: 'Loja', icon: ShoppingBag },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-xl border-t border-white/5 z-50 pb-safe">
      <div className="flex justify-around items-center px-2 py-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 gap-1"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-slate-400 hover:text-white'}`}>
                <tab.icon size={20} />
              </div>
              <span className={`text-[9px] uppercase tracking-widest font-mono transition-colors ${isActive ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div layoutId="bottomNavIndicator" className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNavigationBar.displayName = 'BottomNavigationBar';
