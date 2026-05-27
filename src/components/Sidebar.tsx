import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon, 
  Users, 
  Dumbbell, 
  Award, 
  Calendar, 
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  ImageIcon,
  BrainCircuit,
  BookOpen
} from "lucide-react";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  role: string | undefined;
}

export const Sidebar = React.memo(({ isOpen, onClose, activeTab, onTabChange, onLogout, role }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Estatísticas PRO', icon: LayoutDashboard },
    { id: 'profile', label: 'Meu Perfil', icon: UserIcon },
    { id: 'workouts', label: 'Fichas de Performance', icon: Dumbbell },
    { id: 'ai_coach', label: 'Personal Inteligente', icon: BrainCircuit },
    { id: 'portfolio', label: 'Nosso Team', icon: Award },
    { id: 'store', label: 'Loja Team Little', icon: ShoppingBag },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'gallery', label: 'Mural de Transformação', icon: ImageIcon },
    { id: 'educational', label: 'Conteúdo PRO', icon: BookOpen },
    { id: 'consulting', label: 'Consultoria Premium', icon: MessageSquare },
  ];

  if (role === 'admin' || role === 'trainer') {
    menuItems.splice(2, 0, { id: 'admin', label: 'Painel do Personal', icon: ShieldCheck });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-72 bg-neutral-900 border-r border-white/5 z-[101] p-6 flex flex-col pt-20"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="space-y-1.5 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); onClose(); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === item.id 
                    ? 'bg-neon text-black font-black italic shadow-lg shadow-neon/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white underline-offset-4'
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-black' : 'group-hover:text-neon transition-colors'} />
                  <span className="uppercase tracking-[0.2em] text-[10px] font-mono">{item.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={onLogout}
              className="mt-auto flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all uppercase tracking-widest text-[10px] font-mono border border-transparent hover:border-red-500/20"
            >
              <LogOut size={20} />
              Encerrar Sessão
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

Sidebar.displayName = 'Sidebar';
