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
  Upload,
  Plus,
  Dumbbell,
  Play,
  X,
  Target
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, updateDoc, query, where, setDoc, deleteDoc } from "firebase/firestore";
import { UserProfile, AppSettings, CheckinEntry, Workout, Evaluation } from "../types";
import { ImageUpload } from "./ImageUpload";
import { FirestoreService } from "../lib/firestoreService";

export const AdminTab = ({ currentProfile }: { currentProfile: UserProfile | null }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeMenu, setActiveMenu] = useState<'users' | 'settings'>('users');
  const [activeSubTab, setActiveSubTab] = useState<'Perfil' | 'Treinos' | 'Avaliações' | 'Chat'>('Perfil');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [checkins, setCheckins] = useState<CheckinEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [studentWorkouts, setStudentWorkouts] = useState<Workout[]>([]);
  const [editingStudentWorkout, setEditingStudentWorkout] = useState<Workout | null>(null);
  const [studentEvaluations, setStudentEvaluations] = useState<Evaluation[]>([]);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    if (!editingUser) {
      setStudentWorkouts([]);
      setEditingStudentWorkout(null);
      return;
    }
    const q = query(collection(db, "workouts"), where("studentId", "==", editingUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setStudentWorkouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Workout)));
    });
    return () => unsub();
  }, [editingUser]);

  useEffect(() => {
    if (!editingUser) {
      setStudentEvaluations([]);
      setEditingEvaluation(null);
      return;
    }
    const q = query(collection(db, "evaluations"), where("studentId", "==", editingUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setStudentEvaluations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Evaluation)));
    });
    return () => unsub();
  }, [editingUser]);

  const isAdmin = currentProfile?.role === 'admin' || currentProfile?.role === 'trainer' || currentProfile?.email === 'andercapo0908@gmail.com';

  useEffect(() => {
    // Listen for all users
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const allUsers = snap.docs.map(d => d.data() as UserProfile);
      // Sort: Admins/Trainers first, then Students
      const sorted = [...allUsers].sort((a, b) => {
        if (a.role === b.role) return a.name.localeCompare(b.name);
        if (a.role === 'admin') return -1;
        if (b.role === 'admin') return 1;
        if (a.role === 'trainer') return -1;
        return 1;
      });
      setUsers(sorted);
    }, (err) => {
      console.error("Admin Users sync error:", err);
    });

    // Listen for settings (single doc in 'config/app')
    const unsubSettings = onSnapshot(doc(db, "config", "app"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as AppSettings;
        if (!data.logoUrl) {
          data.logoUrl = "https://i.ibb.co/qYQQb0H1/file-00000000a510720e9e72df18c9f018c8.png";
        }
        setSettings(data);
      }
    }, (err) => {
      console.error("Admin Settings sync error:", err);
    });

    const unsubCheckins = FirestoreService.subscribeToCheckins((data) => {
        setCheckins(data);
    });

    return () => {
      unsubUsers();
      unsubSettings();
      unsubCheckins();
    };
  }, []);

  // Auto-save logic for settings (only for anderson/admin)
  useEffect(() => {
    if (!settings || !isAdmin) return;
    const timer = setTimeout(async () => {
      try {
        await updateDoc(doc(db, "config", "app"), {
          ...settings,
          updatedAt: new Date().toISOString()
        });
        setMessage("Configurações Sincronizadas");
        setTimeout(() => setMessage(""), 2000);
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [settings, isAdmin]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !isAdmin) return;
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

  const saveStudentWorkout = async () => {
    if (!editingStudentWorkout || !editingUser) return;
    if (!editingStudentWorkout.name) {
      alert("Defina o nome do treino!");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "workouts", editingStudentWorkout.id), editingStudentWorkout);
      
      try {
        const notificationId = `notif_${Date.now()}_${editingUser.uid}`;
        await setDoc(doc(db, "notifications", notificationId), {
          id: notificationId,
          studentId: editingUser.uid,
          title: "Novo Treino Prescrito! 🏋️‍♂️",
          message: `O Coach adicionou/atualizou o treino "${editingStudentWorkout.name}" na sua aba Treinos.`,
          read: false,
          type: "workout_update",
          createdAt: new Date().toISOString()
        });
      } catch (notifErr) {
        console.error("Failed to write notification:", notifErr);
      }

      setEditingStudentWorkout(null);
      setMessage("Plano de Treino Salvo!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar treino.");
    } finally {
      setSaving(false);
    }
  };

  const saveStudentEvaluation = async () => {
    if (!editingEvaluation || !editingUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "evaluations", editingEvaluation.id), editingEvaluation);
      setEditingEvaluation(null);
      setMessage("Registro de Avaliação Salvo!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar avaliação.");
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
           <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-2">Personal <span className="text-amber-500 text-4xl">Anderson Santana</span></h2>
           <p className="text-amber-500/80 font-mono text-[10px] uppercase tracking-[0.5em] font-black">Painel de Controle Elite do Team Little</p>
        </div>

        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-white/5 shadow-2xl">
           <button 
             onClick={() => setActiveMenu('users')}
             className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeMenu === 'users' ? 'bg-amber-500 text-black font-black italic' : 'text-slate-500 hover:text-white'}`}
           >
             <Users size={18} /> <span className="text-[10px] font-mono uppercase tracking-widest leading-none">Meus Alunos</span>
           </button>
           {isAdmin && (
             <button 
               onClick={() => setActiveMenu('settings')}
               className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${activeMenu === 'settings' ? 'bg-amber-500 text-black font-black italic' : 'text-slate-500 hover:text-white'}`}
             >
               <Settings size={18} /> <span className="text-[10px] font-mono uppercase tracking-widest leading-none">App Config</span>
             </button>
           )}
        </div>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 text-emerald-500 font-black italic uppercase text-xs flex items-center gap-3">
           <CheckCircle2 size={18} /> {message}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {activeMenu === 'users' ? (
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total de Atletas</p>
                  <p className="text-3xl font-black italic text-white uppercase">{users.filter(u => u.role === 'student').length}</p>
               </div>
               <div className="bg-neutral-900 border border-white/5 p-6 rounded-3xl text-amber-500">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Equipe Elite</p>
                  <p className="text-3xl font-black italic uppercase">{users.filter(u => u.role !== 'student').length}</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic uppercase tracking-widest text-slate-400 ml-4">Alunos do Team</h3>
                <div className="bg-neutral-900 px-4 py-2 rounded-xl text-orange-pure text-[10px] font-black uppercase font-mono tracking-widest">
                    {checkins.length} Check-ins Recentes
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(u => u.role === 'student').map(u => (
                  <div key={u.uid} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-6 hover:border-amber-500/50 transition-all group overflow-hidden relative shadow-2xl">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl border-2 border-amber-500/20 overflow-hidden relative bg-neutral-950 flex items-center justify-center">
                        <img src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} className="w-full h-full object-contain" alt="Profile" />
                      </div>
                      <div>
                        <h4 className="font-black italic text-xl uppercase tracking-tight text-white">{u.name}</h4>
                        <p className="text-[9px] font-mono uppercase tracking-widest text-amber-500">Atleta DNA PRO</p>
                        <p className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setEditingUser(u)}
                         className="flex-1 py-3 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-500 font-black italic text-[9px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                       >
                         <Edit3 size={14} /> Gerenciar Atleta
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isAdmin && users.some(u => u.role !== 'student') && (
              <div className="space-y-6 pt-10 border-t border-white/5">
                <h3 className="text-xl font-black italic uppercase tracking-widest text-slate-400 ml-4">Equipe Técnica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.filter(u => u.role !== 'student').map(u => (
                    <div key={u.uid} className="bg-black/40 border border-white/10 rounded-[2.5rem] p-6 hover:border-amber-500/30 transition-all group overflow-hidden relative shadow-2xl">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-2xl border-2 border-amber-500/50 overflow-hidden relative bg-neutral-950 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                          <img src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} className="w-full h-full object-contain" alt="Profile" />
                        </div>
                        <div>
                          <h4 className="font-black italic text-xl uppercase tracking-tight text-white">{u.name}</h4>
                          <span className={`text-[8px] font-black italic px-2 py-0.5 rounded-full uppercase ${u.role === 'admin' ? 'bg-amber-500 text-black' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                            {u.role}
                          </span>
                          <p className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-1">{u.email}</p>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingUser(u)}
                            className="flex-1 py-3 bg-white/5 border border-white/5 hover:border-amber-500/40 text-white font-mono text-[9px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Edit3 size={14} /> Editar
                          </button>
                          <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      className="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-[3rem] p-8 md:p-12 relative z-[1001] shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                       <div className="flex justify-between items-start mb-8">
                         <div>
                           <h3 className="text-4xl font-black italic uppercase tracking-tighter">Gerenciar {editingUser.name}</h3>
                           <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500">PAINEL DO TREINADOR DNA PRO</p>
                         </div>
                         <button onClick={() => setEditingUser(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white">
                           <X size={18} />
                         </button>
                       </div>
                       
                       <div className="flex gap-2 mb-8 border-b border-white/5 pb-4 overflow-x-auto">
                          {['Perfil', 'Treinos', 'Avaliações', 'Chat'].map(tab => (
                            <button
                              key={tab}
                              onClick={() => {
                                setActiveSubTab(tab as any);
                                setEditingStudentWorkout(null);
                                setEditingEvaluation(null);
                              }}
                              className={`px-6 py-3 text-[10px] uppercase font-mono tracking-widest font-black rounded-xl transition-all cursor-pointer ${
                                activeSubTab === tab ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                       </div>

                       {activeSubTab === 'Perfil' && (
                        <form onSubmit={handleUpdateUser} className="space-y-8">
                           <div className="bg-black/30 border border-white/5 rounded-[2rem] p-6">
                             <ImageUpload 
                               label="Foto de Perfil do Aluno"
                               currentImage={editingUser.photoURL}
                               onImageAction={(b64) => setEditingUser({...editingUser, photoURL: b64})}
                             />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 border border-white/5 p-8 rounded-[2rem]">
                             <div className="space-y-2 col-span-full">
                               <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 font-bold mb-2">Dados de Login e Registro</h4>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Nome Completo <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Cargo / Role <Edit3 size={10} className="text-amber-500" /></label>
                                <select 
                                  value={editingUser.role}
                                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase cursor-pointer"
                                >
                                   <option value="student">Aluno</option>
                                   <option value="trainer">Personal</option>
                                   <option value="admin">Admin</option>
                                </select>
                             </div>
                             <div className="space-y-2 col-span-full">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">E-mail <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  type="email"
                                  value={editingUser.email || ""}
                                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-medium"
                                />
                             </div>

                             <div className="space-y-2 col-span-full pt-4 mt-4 border-t border-white/5">
                               <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 font-bold mb-2 flex items-center gap-2"><Target size={14} /> Ficha Antropométrica & Saúde</h4>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Objetivo <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  value={editingUser.health?.goal || ""}
                                  placeholder="EX: DEFINIÇÃO MUSCULAR"
                                  onChange={(e) => setEditingUser({
                                     ...editingUser, 
                                     health: { ...(editingUser.health || { weight: 0, height: 0, goal: "" }), goal: e.target.value }
                                  })}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Peso (kg) <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  type="number"
                                  step="0.1"
                                  value={editingUser.health?.weight || ""}
                                  placeholder="EX: 78.5"
                                  onChange={(e) => setEditingUser({
                                     ...editingUser, 
                                     health: { ...(editingUser.health || { weight: 0, height: 0, goal: "" }), weight: parseFloat(e.target.value) || 0 }
                                  })}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-medium"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Altura (cm) <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  type="number"
                                  value={editingUser.health?.height || ""}
                                  placeholder="EX: 178"
                                  onChange={(e) => setEditingUser({
                                     ...editingUser, 
                                     health: { ...(editingUser.health || { weight: 0, height: 0, goal: "" }), height: parseInt(e.target.value) || 0 }
                                  })}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-medium"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Gordura Corporal (% BF) <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  type="number"
                                  step="0.1"
                                  value={editingUser.health?.bf || ""}
                                  placeholder="EX: 12.5"
                                  onChange={(e) => setEditingUser({
                                     ...editingUser, 
                                     health: { ...(editingUser.health || { weight: 0, height: 0, goal: "" }), bf: parseFloat(e.target.value) || 0 }
                                  })}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-medium"
                                />
                             </div>
                             <div className="space-y-2 col-span-full">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Restrições / Patologias <Edit3 size={10} className="text-amber-500" /></label>
                                <input 
                                  value={editingUser.health?.restrictions?.join(', ') || ""}
                                  placeholder="EX: HÉRNIA DE DISCO, LESÃO NO JOELHO"
                                  onChange={(e) => setEditingUser({
                                     ...editingUser, 
                                     health: { 
                                        ...(editingUser.health || { weight: 0, height: 0, goal: "" }), 
                                        restrictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                                     }
                                  })}
                                  className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-medium uppercase text-xs"
                                />
                             </div>
                           </div>

                           <div className="pt-6 border-t border-white/5 flex gap-4">
                              <button 
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="flex-1 py-4 bg-white/5 text-slate-400 font-black italic uppercase rounded-2xl tracking-tighter cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button 
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-4 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-tighter flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                              >
                                {saving ? "Salvando..." : <>Salvar Alterações <Save size={18} /></>}
                              </button>
                           </div>
                        </form>
                       )}

                       {activeSubTab === 'Treinos' && (
                         <div className="space-y-6">
                           {editingStudentWorkout ? (
                             <div className="bg-premium-card border border-neutral-800 rounded-[2.5rem] p-6 space-y-6">
                               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                 <h4 className="font-mono text-xs uppercase text-amber-500 font-black tracking-widest">
                                   {editingStudentWorkout.id.startsWith('wk_new') ? 'Criando Novo Plano' : 'Editando Plano de Treino'}
                                 </h4>
                                 <button 
                                   type="button"
                                   onClick={() => setEditingStudentWorkout(null)}
                                   className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-mono uppercase tracking-widest cursor-pointer text-white"
                                 >
                                   Voltar
                                 </button>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Título do Treino <Edit3 size={10} className="text-amber-500" /></label>
                                   <input 
                                     value={editingStudentWorkout.name}
                                     onChange={(e) => setEditingStudentWorkout({ ...editingStudentWorkout, name: e.target.value })}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold uppercase"
                                     placeholder="EX: PEITORAL E TRÍCEPS"
                                   />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Divisão (A, B, C, etc) <Edit3 size={10} className="text-amber-500" /></label>
                                   <input 
                                     value={editingStudentWorkout.division}
                                     onChange={(e) => setEditingStudentWorkout({ ...editingStudentWorkout, division: e.target.value })}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-black uppercase text-center"
                                     placeholder="EX: A"
                                   />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1 flex items-center gap-1">Tempo Estimado <Edit3 size={10} className="text-amber-500" /></label>
                                   <input 
                                     value={editingStudentWorkout.duration || ""}
                                     onChange={(e) => setEditingStudentWorkout({ ...editingStudentWorkout, duration: e.target.value })}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono uppercase text-center"
                                     placeholder="EX: 45 MIN"
                                   />
                                 </div>
                               </div>

                               <div className="space-y-4 pt-4 border-t border-white/5">
                                 <div className="flex justify-between items-center">
                                   <h5 className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-black">Lista de Exercícios ({editingStudentWorkout.exercises?.length || 0})</h5>
                                   <button 
                                     type="button"
                                     onClick={() => {
                                       setEditingStudentWorkout({
                                         ...editingStudentWorkout,
                                         exercises: [
                                           ...(editingStudentWorkout.exercises || []),
                                           { name: "", sets: 3, reps: "10-12", load: "Moderada", rest: "60s", muscleGroup: "Geral" }
                                         ]
                                       });
                                     }}
                                     className="px-4 py-2 bg-amber-500 text-black font-black italic uppercase text-[9px] rounded-xl flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer shadow-md"
                                   >
                                     <Plus size={12} /> Add Exercício
                                   </button>
                                 </div>

                                 {(!editingStudentWorkout.exercises || editingStudentWorkout.exercises.length === 0) ? (
                                   <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl text-slate-500 text-xs font-mono">
                                     Nenhum exercício adicionado a este treino. Clique no botão acima para adicionar.
                                   </div>
                                 ) : (
                                   <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                     {editingStudentWorkout.exercises.map((ex, index) => (
                                       <div key={index} className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-3 relative group">
                                         <div className="flex justify-between items-center">
                                           <span className="text-[10px] font-mono font-black text-amber-500">EXERCÍCIO #{index + 1}</span>
                                           <button 
                                             type="button"
                                             onClick={() => {
                                               const updated = [...(editingStudentWorkout.exercises || [])];
                                               updated.splice(index, 1);
                                               setEditingStudentWorkout({ ...editingStudentWorkout, exercises: updated });
                                             }}
                                             className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                                           >
                                             <Trash2 size={12} />
                                           </button>
                                         </div>
                                         <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                           <div className="md:col-span-2 space-y-1">
                                             <span className="text-[8px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Nome do Exercício <Edit3 size={8} /></span>
                                             <input 
                                               value={ex.name}
                                               onChange={(e) => {
                                                 const updated = [...(editingStudentWorkout.exercises || [])];
                                                 updated[index] = { ...ex, name: e.target.value };
                                                 setEditingStudentWorkout({ ...editingStudentWorkout, exercises: updated });
                                               }}
                                               className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-amber-500 uppercase font-bold"
                                               placeholder="NOME DO EXERCÍCIO"
                                             />
                                           </div>
                                           <div className="space-y-1">
                                             <span className="text-[8px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Séries <Edit3 size={8} /></span>
                                             <input 
                                               type="number"
                                               value={ex.sets}
                                               onChange={(e) => {
                                                 const updated = [...(editingStudentWorkout.exercises || [])];
                                                 updated[index] = { ...ex, sets: parseInt(e.target.value) || 3 };
                                                 setEditingStudentWorkout({ ...editingStudentWorkout, exercises: updated });
                                               }}
                                               className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-amber-500 text-center"
                                               placeholder="SÉRIES"
                                             />
                                           </div>
                                           <div className="space-y-1">
                                             <span className="text-[8px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Reps <Edit3 size={8} /></span>
                                             <input 
                                               value={ex.reps}
                                               onChange={(e) => {
                                                 const updated = [...(editingStudentWorkout.exercises || [])];
                                                 updated[index] = { ...ex, reps: e.target.value };
                                                 setEditingStudentWorkout({ ...editingStudentWorkout, exercises: updated });
                                               }}
                                               className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-amber-500 text-center"
                                               placeholder="Repetições"
                                             />
                                           </div>
                                           <div className="md:col-span-2 space-y-1">
                                             <span className="text-[8px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Carga <Edit3 size={8} /></span>
                                             <input 
                                               value={ex.load}
                                               onChange={(e) => {
                                                 const updated = [...(editingStudentWorkout.exercises || [])];
                                                 updated[index] = { ...ex, load: e.target.value };
                                                 setEditingStudentWorkout({ ...editingStudentWorkout, exercises: updated });
                                               }}
                                               className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-amber-500 uppercase"
                                               placeholder="EX: 40KG CADA LADO"
                                             />
                                           </div>
                                           <div className="md:col-span-2 space-y-1">
                                             <span className="text-[8px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Descanso <Edit3 size={8} /></span>
                                             <input 
                                               value={ex.rest || "60s"}
                                               onChange={(e) => {
                                                 const updated = [...(editingStudentWorkout.exercises || [])];
                                                 updated[index] = { ...ex, rest: e.target.value };
                                                 setEditingStudentWorkout({ ...editingStudentWorkout, exercises: updated });
                                               }}
                                               className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-amber-500"
                                               placeholder="EX: 60S"
                                             />
                                           </div>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 )}
                               </div>

                               <div className="flex gap-4 pt-4 border-t border-white/5">
                                 <button 
                                   type="button"
                                   onClick={() => setEditingStudentWorkout(null)}
                                   className="flex-1 py-4 bg-white/5 text-slate-400 font-black italic uppercase rounded-2xl tracking-tighter cursor-pointer text-xs"
                                 >
                                   Descartar
                                 </button>
                                 <button 
                                   type="button"
                                   onClick={saveStudentWorkout}
                                   disabled={saving}
                                   className="flex-1 py-4 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-tighter flex items-center justify-center gap-2 cursor-pointer text-xs font-mono shadow-md shadow-amber-500/10"
                                  >
                                   <Save size={16} /> Salvar Plano
                                 </button>
                               </div>
                             </div>
                           ) : (
                             <div className="space-y-6">
                               <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-4">Planos Ativos do Atleta</span>
                                 <button 
                                   type="button"
                                   onClick={() => setEditingStudentWorkout({
                                     id: "wk_new_" + Math.random().toString(36).substring(2, 9),
                                     studentId: editingUser.uid,
                                     trainerId: currentProfile?.uid || "",
                                     name: "",
                                     division: "A",
                                     duration: "45 min",
                                     exercises: []
                                   })}
                                   className="px-5 py-3 bg-amber-500 text-black font-black italic uppercase text-[10px] tracking-wider rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                                 >
                                   <Plus size={14} /> + Adicionar Treino
                                 </button>
                               </div>

                               {studentWorkouts.length === 0 ? (
                                 <div className="py-16 text-center border border-white/5 border-dashed rounded-[2.5rem] bg-black/10">
                                   <Dumbbell size={36} className="mx-auto text-slate-700 mb-4 animate-pulse" />
                                   <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Nenhum treino prescrito para este atleta ainda.</p>
                                 </div>
                               ) : (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {studentWorkouts.map((w) => (
                                     <div key={w.id} className="bg-neutral-900/60 border border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-amber-500/30 transition-all">
                                       <div>
                                         <div className="flex items-center gap-3 mb-3">
                                           <span className="text-amber-500 text-2xl font-black italic">{w.division}</span>
                                           <h5 className="text-lg font-black uppercase text-white truncate">{w.name}</h5>
                                         </div>
                                         <div className="flex gap-2">
                                           <span className="text-[8px] font-mono bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5 text-slate-400 uppercase">{(w.exercises || []).length} Exercícios</span>
                                           <span className="text-[8px] font-mono bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5 text-slate-400 uppercase">{w.duration}</span>
                                         </div>
                                       </div>
                                       <div className="flex gap-2 mt-6">
                                         <button 
                                           type="button"
                                           onClick={() => setEditingStudentWorkout(w)}
                                           className="flex-1 py-2 bg-amber-500/10 text-amber-500 text-[9px] font-black italic uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                                         >
                                           <Edit3 size={12} /> Editar
                                         </button>
                                         <button 
                                           type="button"
                                           onClick={async () => {
                                             if (confirm("Deletar este treino para o aluno?")) {
                                               await deleteDoc(doc(db, "workouts", w.id));
                                             }
                                           }}
                                           className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                                         >
                                           <Trash2 size={12} />
                                         </button>
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                       )}

                       {activeSubTab === 'Avaliações' && (
                         <div className="space-y-6">
                           {editingEvaluation ? (
                             <div className="bg-black/20 border border-white/5 rounded-[2.5rem] p-6 space-y-6">
                               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                 <h4 className="font-mono text-xs uppercase text-amber-500 font-black tracking-widest">Registrar Nova Avaliação</h4>
                                 <button type="button" onClick={() => setEditingEvaluation(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-mono uppercase tracking-widest cursor-pointer text-white">Voltar</button>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Data da Avaliação <Edit3 size={10} className="text-amber-500" /></label>
                                   <input 
                                     type="date"
                                     value={editingEvaluation.date}
                                     onChange={(e) => setEditingEvaluation({...editingEvaluation, date: e.target.value})}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold"
                                   />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Peso Corporal (kg) <Edit3 size={10} className="text-amber-500" /></label>
                                   <input 
                                     type="number"
                                     step="0.1"
                                     value={editingEvaluation.weight}
                                     onChange={(e) => setEditingEvaluation({...editingEvaluation, weight: parseFloat(e.target.value) || 0})}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500"
                                   />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Gordura Corporal (% BF) <Edit3 size={10} className="text-amber-500" /></label>
                                   <input 
                                     type="number"
                                     step="0.1"
                                     value={editingEvaluation.bodyFat || 0}
                                     onChange={(e) => setEditingEvaluation({...editingEvaluation, bodyFat: parseFloat(e.target.value) || 0})}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500"
                                   />
                                 </div>
                                 <div className="space-y-2 md:col-span-2">
                                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1">Anotações / Anamnese <Edit3 size={10} className="text-amber-500" /></label>
                                   <textarea 
                                     value={editingEvaluation.notes}
                                     onChange={(e) => setEditingEvaluation({...editingEvaluation, notes: e.target.value})}
                                     className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 text-sm h-28"
                                     placeholder="EX: Atleta relatou boa recuperação, foco no aumento de carga nas pernas..."
                                   />
                                 </div>
                               </div>
                               <div className="flex gap-4 pt-4 border-t border-white/5">
                                 <button type="button" onClick={() => setEditingEvaluation(null)} className="flex-1 py-4 bg-white/5 text-slate-400 font-black italic uppercase rounded-2xl cursor-pointer text-xs">Cancelar</button>
                                 <button type="button" onClick={saveStudentEvaluation} className="flex-1 py-4 bg-amber-500 text-black font-black italic uppercase rounded-2xl cursor-pointer tracking-wide flex items-center justify-center gap-2 text-xs"><Save size={16} /> Salvar Registro</button>
                                </div>
                             </div>
                           ) : (
                             <div className="space-y-6">
                               <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-4">Histórico de Avaliações</span>
                                 <button 
                                   type="button"
                                   onClick={() => setEditingEvaluation({
                                     id: "eval_" + Math.random().toString(36).substr(2, 9),
                                     studentId: editingUser.uid,
                                     trainerId: currentProfile?.uid || "",
                                     date: new Date().toISOString().split('T')[0],
                                     weight: editingUser.health?.weight || 70,
                                     bodyFat: editingUser.health?.bf || 15,
                                     notes: ""
                                   })}
                                   className="px-5 py-3 bg-amber-500 text-black font-black italic uppercase text-[10px] tracking-wider rounded-2xl flex items-center gap-2 cursor-pointer shadow-md"
                                 >
                                   <Plus size={14} /> + Nova Avaliação
                                 </button>
                               </div>

                               {studentEvaluations.length === 0 ? (
                                 <div className="py-16 text-center border border-white/5 border-dashed rounded-[2.5rem] bg-black/10">
                                   <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Nenhuma avaliação física registrada para este aluno.</p>
                                 </div>
                               ) : (
                                 <div className="space-y-4">
                                   {studentEvaluations.map((ev) => (
                                     <div key={ev.id} className="bg-neutral-900/60 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                       <div>
                                         <div className="text-amber-500 font-mono text-xs uppercase font-black tracking-wider mb-2">Avaliação de {ev.date}</div>
                                         <div className="flex gap-4 mb-3">
                                           <span className="text-white text-sm font-bold">Peso: <span className="font-mono text-amber-500">{ev.weight}kg</span></span>
                                           <span className="text-white text-sm font-bold">BF: <span className="font-mono text-amber-500">{ev.bodyFat}%</span></span>
                                         </div>
                                         <p className="text-xs text-slate-400 italic">"{ev.notes || 'Sem anotações registradas.'}"</p>
                                       </div>
                                       <button 
                                         type="button"
                                         onClick={async () => {
                                           if (confirm("Deletar esta avaliação?")) {
                                             await deleteDoc(doc(db, "evaluations", ev.id));
                                           }
                                         }}
                                         className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer flex-shrink-0"
                                       >
                                         <Trash2 size={12} />
                                       </button>
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                       )}
                       
                       {activeSubTab === 'Chat' && <div className="text-slate-500 font-mono text-sm text-center py-12">Seu canal direto de chat com o aluno em tempo real está online. Digite na aba de Consultoria.</div>}
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
