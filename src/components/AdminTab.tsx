import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Settings, 
  Save, 
  Edit3, 
  Trash2, 
  Shield, 
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  Upload
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";
import { UserProfile, AppSettings } from "../types";
import { ImageUpload } from "./ImageUpload";

export const AdminTab = ({ currentProfile }: { currentProfile: UserProfile | null }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeMenu, setActiveMenu] = useState<'users' | 'settings'>('users');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for all users
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => d.data() as UserProfile));
    });

    // Listen for settings (single doc in 'config/app')
    const unsubSettings = onSnapshot(doc(db, "config", "app"), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as AppSettings);
      } else {
        // Initial defaults if not exists
        setSettings({
          logoUrl: "https://i.ibb.co/qYQQb0H1/file-00000000a510720e9e72df18c9f018c8.png",
          globalAnnouncement: "Workshop de Dieta Flexível Sábado 10h!",
          coachNote: "Foco no tempo de descanso: 45s cravados.",
          updatedAt: new Date().toISOString()
        });
      }
    });

    return () => {
      unsubUsers();
      unsubSettings();
    };
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "config", "app"), {
        ...settings,
        updatedAt: new Date().toISOString()
      });
      setMessage("Configurações Globais Salvas!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar config.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", editingUser.uid), { ...editingUser });
      setMessage(`Perfil de ${editingUser.name} Atualizado!`);
      setEditingUser(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar usuário.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 pb-32 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-2">Painel de Controle</h2>
           <p className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.5em] font-black">Central de Engenharia de Perfomance</p>
        </div>

        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-white/5 shadow-2xl">
           <button 
             onClick={() => setActiveMenu('users')}
             className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeMenu === 'users' ? 'bg-amber-500 text-black font-black italic' : 'text-slate-500 hover:text-white'}`}
           >
             <Users size={18} /> <span className="text-[10px] font-mono uppercase tracking-widest leading-none">Usuários</span>
           </button>
           <button 
             onClick={() => setActiveMenu('settings')}
             className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeMenu === 'settings' ? 'bg-amber-500 text-black font-black italic' : 'text-slate-500 hover:text-white'}`}
           >
             <Settings size={18} /> <span className="text-[10px] font-mono uppercase tracking-widest leading-none">App Config</span>
           </button>
        </div>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 text-emerald-500 font-black italic uppercase text-xs flex items-center gap-3">
           <CheckCircle2 size={18} /> {message}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {activeMenu === 'users' ? (
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.uid} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-6 hover:border-amber-500/30 transition-all group overflow-hidden relative shadow-2xl">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-2xl border-2 border-amber-500/20 overflow-hidden relative">
                      <img src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                    <div>
                      <h4 className="font-black italic text-xl uppercase tracking-tight text-white">{u.name}</h4>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">{u.role} • {u.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingUser(u)}
                      className="flex-1 py-3 bg-white/5 border border-white/5 hover:border-amber-500/40 text-white font-mono text-[9px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 size={14} /> Editar Perfil
                    </button>
                    <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* User Edit Modal */}
            <AnimatePresence>
               {editingUser && (
                 <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      onClick={() => setEditingUser(null)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative z-[1001] shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                       <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Editar Atleta</h3>
                       
                       <form onSubmit={handleUpdateUser} className="space-y-8">
                          <ImageUpload 
                            label="Foto de Perfil"
                            currentImage={editingUser.photoURL}
                            onImageAction={(b64) => setEditingUser({...editingUser, photoURL: b64})}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome Completo</label>
                                <input 
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Cargo / Role</label>
                                <select 
                                  value={editingUser.role}
                                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                  className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase"
                                >
                                   <option value="student">Aluno</option>
                                   <option value="trainer">Personal</option>
                                   <option value="admin">Admin</option>
                                </select>
                             </div>
                          </div>

                          <div className="pt-6 border-t border-white/5 flex gap-4">
                             <button 
                               type="button"
                               onClick={() => setEditingUser(null)}
                               className="flex-1 py-4 bg-white/5 text-slate-400 font-black italic uppercase rounded-2xl tracking-tighter"
                             >
                               Cancelar
                             </button>
                             <button 
                               type="submit"
                               disabled={saving}
                               className="flex-1 py-4 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-tighter flex items-center justify-center gap-2"
                             >
                               {saving ? "Salvando..." : <>Salvar Alterações <Save size={18} /></>}
                             </button>
                          </div>
                       </form>
                    </motion.div>
                 </div>
               )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            {settings ? (
              <form onSubmit={handleUpdateSettings} className="space-y-10 bg-neutral-900/50 border border-white/5 p-10 rounded-[3rem] shadow-2xl">
                <ImageUpload 
                  label="Logomarca do Aplicativo (Geral)"
                  currentImage={settings.logoUrl}
                  onImageAction={(b64) => setSettings({...settings, logoUrl: b64})}
                />

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Informativo Global (Home)</label>
                      <textarea 
                        value={settings.globalAnnouncement}
                        onChange={(e) => setSettings({...settings, globalAnnouncement: e.target.value})}
                        className="w-full h-32 bg-black border border-white/5 rounded-3xl py-6 px-8 text-white outline-none focus:border-amber-500 font-medium leading-relaxed italic"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nota do Coach (Home)</label>
                      <textarea 
                        value={settings.coachNote}
                        onChange={(e) => setSettings({...settings, coachNote: e.target.value})}
                        className="w-full h-32 bg-black border border-white/5 rounded-3xl py-6 px-8 text-white outline-none focus:border-amber-500 font-medium leading-relaxed italic"
                      />
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full py-6 bg-amber-500 text-black font-black italic uppercase rounded-[2rem] tracking-tighter flex items-center justify-center gap-3 text-lg"
                >
                  {saving ? "Sincronizando..." : <>Confirmar Mudanças Globais <Save size={24} /></>}
                </button>
              </form>
            ) : (
              <div className="text-center py-20 text-slate-600 font-mono text-xs uppercase animate-pulse">Carregando Configurações...</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
