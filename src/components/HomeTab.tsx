import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, MessageCircle, CalendarCheck, ChevronRight, Trash2 } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, collection, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { AppSettings, UserProfile, AppNotification } from "../types";
import { FirestoreService } from "../lib/firestoreService";

export const HomeTab = React.memo(({ profile, onNavigate }: { profile: UserProfile | null, onNavigate?: (tab: string) => void }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "app"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as AppSettings);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, "notifications"),
      where("studentId", "==", profile.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppNotification[];
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(data);
    }, (err) => {
      console.error("Notifications fetch error:", err);
    });
    return () => unsub();
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (err) {
      console.error("Error setting notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    const promises = unread.map(n => updateDoc(doc(db, "notifications", n.id), { read: true }));
    try {
      await Promise.all(promises);
    } catch (err) {
      console.error("Error setting all as read:", err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleClearAll = async () => {
    const promises = notifications.map(n => deleteDoc(doc(db, "notifications", n.id)));
    try {
      await Promise.all(promises);
    } catch (err) {
      console.error("Error clearing all notifications:", err);
    }
  };

  const handleCheckIn = async () => {
    if (!profile) return;
    try {
      await FirestoreService.logCheckin(profile.uid);
      setCheckedIn(true);
    } catch (err) {
      console.error("Check-in error:", err);
    }
  };

  return (
    <div className="HomeTab flex flex-col pb-32 pt-2 space-y-6">
      
      {/* Motivational Marquee */}
      <div className="w-full bg-amber-500 overflow-hidden py-2 relative flex items-center border-y border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
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
        {/* Welcome Header with Notifications Icon */}
        <div className="flex justify-between items-center bg-black/40 border border-white/5 p-5 rounded-[2rem] gap-4 mb-2 mt-2">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight">
              Salve, <span className="text-amber-500">{profile?.name?.split(' ')[0] || 'Atleta'}</span>!
            </h2>
            <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mt-1">
              Bem-vindo ao Team Little <span className="text-[#FFFDF5] font-black underline underline-offset-4 decoration-amber-500/50">PRO</span>
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3.5 bg-neutral-900 border border-white/10 rounded-2xl transition-all hover:bg-neutral-800 hover:border-amber-500 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-lg group shrink-0"
            title="Avisos e Notificações"
          >
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 border border-black rounded-full flex items-center justify-center text-[9px] font-black text-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Notifications Tray Card */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-neutral-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-black italic uppercase text-xs tracking-wider">Notificações</h3>
                  <span className="text-[9px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black font-bold">
                    {notifications.length} {notifications.length === 1 ? 'Alerta' : 'Alertas'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-[9px] uppercase tracking-wider font-bold font-mono text-amber-500 hover:text-white transition-colors bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl cursor-pointer"
                    >
                      Ler tudo
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={handleClearAll}
                    disabled={notifications.length === 0}
                    className="text-[9px] uppercase tracking-wider font-bold font-mono text-slate-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 border border-white/5 px-2.5 py-1 rounded-xl disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Notification list */}
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-slate-500 flex flex-col items-center justify-center">
                  <span className="text-xl mb-1.5 opacity-45">🔔</span>
                  <p className="text-[9px] uppercase font-mono tracking-widest">Nenhum alerta recebido</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        notif.read 
                          ? 'bg-black/20 border-white/5 opacity-60' 
                          : 'bg-amber-500/5 border-amber-500/20 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />}
                            <span className="text-xs font-bold text-white uppercase tracking-tight truncate">{notif.title}</span>
                          </div>
                          <p className="text-slate-300 text-xs mt-1 leading-relaxed">{notif.message}</p>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1.5 block">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleString('pt-BR') : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notif.read && (
                            <button 
                              type="button"
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="p-1 px-2 hover:bg-white/5 rounded-lg text-amber-400 hover:text-white transition-colors text-[9px] uppercase font-mono tracking-wider font-bold cursor-pointer"
                              title="Marcar como lido"
                            >
                              Marcar lido
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Apagar"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily Check-in */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-300 ${checkedIn ? 'bg-amber-500/10 border-amber-500/30' : 'bg-neutral-900 border-white/5'}`}
        >
          <div className="flex justify-between items-center z-10 relative">
            <div>
              <h3 className="text-white font-black italic uppercase text-lg flex items-center gap-2">
                <CalendarCheck className={checkedIn ? "text-amber-500" : "text-slate-400"} size={20} />
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
                ? 'bg-amber-500/20 text-white cursor-not-allowed' 
                : 'bg-amber-500 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:text-white hover:border-white shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-amber-500/30'
              }`}
            >
              {checkedIn ? "Focado" : "Entrar no Game"}
            </button>
          </div>
          {checkedIn && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full" />}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate && onNavigate('chat')}
            className="p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/20 rounded-[2rem] flex items-center justify-between text-left group transition-all duration-300 hover:border-amber-500/50 cursor-pointer"
          >
            <div>
              <h3 className="text-amber-500 font-black italic uppercase text-lg flex items-center gap-2 mb-1">
                <MessageCircle size={20} className="animate-pulse" />
                Chat Interno PRO
              </h3>
              <p className="text-slate-400 text-[10px] uppercase font-mono tracking-widest">Conversa direta em tempo real</p>
            </div>
            <ChevronRight className="text-amber-500 group-hover:translate-x-2 transition-transform" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate && onNavigate('consulting')}
            className="p-6 bg-gradient-to-r from-blue-600/20 to-blue-900/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-between text-left group transition-all duration-300 hover:border-blue-500/50 cursor-pointer"
          >
            <div>
              <h3 className="text-blue-400 font-black italic uppercase text-lg flex items-center gap-2 mb-1">
                <MessageCircle size={20} />
                WhatsApp do Personal
              </h3>
              <p className="text-slate-400 text-[10px] uppercase font-mono tracking-widest">Links de suporte e chamada de vídeo</p>
            </div>
            <ChevronRight className="text-blue-400 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>

      </div>
    </div>
  )
});

HomeTab.displayName = 'HomeTab';
