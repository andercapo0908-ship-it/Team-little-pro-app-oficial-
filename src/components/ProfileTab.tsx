import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Calendar, 
  Scale, 
  TrendingUp, 
  Heart, 
  Stethoscope,
  Edit2,
  X,
  Save,
  Check,
  Send,
  User,
  Dumbbell,
  MessageSquare,
  Plus,
  Trash2
} from "lucide-react";
import { HealthMetrics, UserProfile } from "../types";
import { ImageUpload } from "./ImageUpload";
import { db } from "../lib/firebase";
import { doc, updateDoc, collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const ProfileTab = React.memo(({ profile }: { profile: UserProfile | null }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [saving, setSaving] = useState(false);

  const defaultHealth: HealthMetrics = {
    weight: 82.5,
    height: 1.78,
    bf: 14.5,
    goal: "Hipertrofia Elite",
    bloodType: "A+",
    heartRate: 62
  };
  
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [healthData, setHealthData] = useState<HealthMetrics>(profile?.health || defaultHealth);

  // Synchronized Evaluations History (Firestore + Fallback)
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loadingEvals, setLoadingEvals] = useState(true);
  const [isAddingEval, setIsAddingEval] = useState(false);
  const [newEvalWeight, setNewEvalWeight] = useState("");
  const [newEvalBF, setNewEvalBF] = useState("");
  const [newEvalDate, setNewEvalDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartMetric, setChartMetric] = useState<'both' | 'weight' | 'bf'>('both');

  // Load user evaluations dynamically from Firestore
  useEffect(() => {
    if (!profile?.uid) return;
    const q = query(
      collection(db, "evaluations"),
      where("studentId", "==", profile.uid),
      orderBy("date", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvaluations(list);
      setLoadingEvals(false);
    }, (err) => {
      console.error("Error loading evaluations:", err);
      setLoadingEvals(false);
    });
    return () => unsub();
  }, [profile?.uid]);

  // Handle adding new metrics to Firestore
  const handleCreateEval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    const w = parseFloat(newEvalWeight);
    const bf = parseFloat(newEvalBF);
    if (isNaN(w) || w <= 0) {
      alert("Por favor, digite um peso válido.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "evaluations"), {
        studentId: profile.uid,
        trainerId: "admin",
        date: newEvalDate,
        weight: w,
        bodyFat: isNaN(bf) ? 0 : bf,
        notes: "Métrica registrada pelo Atleta"
      });
      setIsAddingEval(false);
      setNewEvalWeight("");
      setNewEvalBF("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar métrica de evolução.");
    } finally {
      setSaving(false);
    }
  };

  // Memoized Chart data combination (Real or Simulated Fallback)
  const chartData = useMemo(() => {
    if (evaluations.length > 0) {
      return evaluations.map(e => ({
        date: e.date,
        weight: parseFloat(e.weight) || 0,
        bf: parseFloat(e.bodyFat) || 0,
        leanMass: parseFloat(e.leanMass) || 0,
        fatMass: parseFloat(e.fatMass) || 0,
        formattedDate: new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        isReal: true,
      }));
    }
    const currentW = parseFloat(String(healthData.weight)) || 82.5;
    const currentBf = parseFloat(String(healthData.bf)) || 14.5;
    return [
      { date: "2026-04-19", weight: Number((currentW - 2.5).toFixed(1)), bf: Number((currentBf + 1.2).toFixed(1)), leanMass: 69, fatMass: 11, formattedDate: "19/04", isReal: false },
      { date: "2026-04-26", weight: Number((currentW - 1.8).toFixed(1)), bf: Number((currentBf + 0.8).toFixed(1)), leanMass: 70, fatMass: 10.7, formattedDate: "26/04", isReal: false },
      { date: "2026-05-03", weight: Number((currentW - 1.0).toFixed(1)), bf: Number((currentBf + 0.4).toFixed(1)), leanMass: 71, fatMass: 10.5, formattedDate: "03/05", isReal: false },
      { date: "2026-05-10", weight: Number((currentW - 0.4).toFixed(1)), bf: Number((currentBf + 0.1).toFixed(1)), leanMass: 71.5, fatMass: 10.6, formattedDate: "10/05", isReal: false },
      { date: "Hoje", weight: currentW, bf: currentBf, leanMass: Number((currentW * (1 - currentBf/100)).toFixed(1)), fatMass: Number((currentW * (currentBf/100)).toFixed(1)), formattedDate: "Hoje", isReal: false },
    ];
  }, [evaluations, healthData.weight, healthData.bf]);

  // Tooltip component custom styled for high aesthetic feel
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-950 border border-white/10 p-5 rounded-[1.5rem] shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-1.5 animate-fade-in">
            {payload.map((pld: any) => (
              <div key={pld.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color }} />
                <p className="font-black italic text-sm text-[#FFFDF5]">
                  {pld.name === 'weight' ? 'Peso' : 'Gordura'}: <span className="font-sans font-normal text-slate-300">{pld.value}{pld.name === 'weight' ? ' kg' : ' %'}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Simulated Chat State
  const [chatMessages, setChatMessages] = useState<{id: string, text: string, sender: 'student' | 'trainer', timestamp: Date}[]>([
    { id: '1', text: 'Fala campeão! Vi que você registrou um treino pesado hoje. Como se sentiu?', sender: 'trainer', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', text: 'Eai coach! Senti que a carga no agachamento finalmente está ficando sob controle.', sender: 'student', timestamp: new Date(Date.now() - 1800000) },
    { id: '3', text: 'Excelente. A técnica é o segredo da longevidade. Mantenha focado.', sender: 'trainer', timestamp: new Date(Date.now() - 600000) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Only scroll smoothly to bottom when chat messages change
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'student' as const,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
    
    // Simulating trainer auto-reply
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: "Mensagem recebida! DNA PRO em evolução. Continue firme no plano.",
        sender: 'trainer' as const,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleSaveProfile = async () => {
    if (!tempProfile || !profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", profile.uid), {
        photoURL: tempProfile.photoURL,
        name: tempProfile.name
      });
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMetrics = async () => {
    // Left as compatibility interface
    setIsEditingMetrics(false);
  };

  const autoSaveMetrics = async (latestData: HealthMetrics) => {
    if (!profile) return;
    setAutoSaveStatus("saving");
    try {
      await updateDoc(doc(db, "users", profile.uid), {
        health: latestData
      });
      
      // Automatic historical logging: Check or Record to 'evaluations' for composition progress
      const todayStr = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, "evaluations"),
        where("studentId", "==", profile.uid),
        where("date", "==", todayStr)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        await addDoc(collection(db, "evaluations"), {
          studentId: profile.uid,
          trainerId: "admin",
          date: todayStr,
          weight: latestData.weight || 0,
          bodyFat: latestData.bf || 0,
          notes: "Atualização automática de composição (Atleta)"
        });
      } else {
        const docId = snap.docs[0].id;
        await updateDoc(doc(db, "evaluations", docId), {
          weight: latestData.weight || 0,
          bodyFat: latestData.bf || 0
        });
      }
      
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus("idle"), 2500);
    } catch (err) {
      console.error("Auto-save health metrics error:", err);
      setAutoSaveStatus("idle");
    }
  };

  const updateHealthField = (field: keyof HealthMetrics, value: string) => {
    const numValue = parseFloat(value);
    const nextVal = isNaN(numValue) && value !== '' ? healthData[field] : (value === '' ? 0 : numValue);
    setHealthData(prev => {
      const updated = {
        ...prev,
        [field]: nextVal
      };
      autoSaveMetrics(updated);
      return updated;
    });
  };

  return (
    <div className="p-6 pb-32 max-w-5xl mx-auto space-y-16">
      {/* Header Profile */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-10"
      >
        {/* Modern professional double-ring glowing photo frame */}
        <div className="w-44 h-44 rounded-full p-1 bg-gradient-to-tr from-amber-500/20 via-white/10 to-amber-500/60 shadow-[0_0_45px_rgba(245,158,11,0.15)] relative group flex-shrink-0 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-amber-500/50 bg-neutral-950 flex items-center justify-center relative">
            <img 
              src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
              alt={profile?.name} 
              className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700" 
            />
            <button 
              onClick={() => { setTempProfile(profile); setIsEditingProfile(true); }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <Edit2 className="text-amber-500" size={24} />
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 flex items-center justify-center pointer-events-none border-t border-white/5">
              <span className="text-[9px] font-mono uppercase text-amber-500 tracking-[0.2em]">Atleta Ativo</span>
            </div>
          </div>
        </div>

        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none text-white relative text-shine"
            >
              {profile?.name}
            </motion.h2>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="bg-neutral-900 border border-white/10 px-6 py-2 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 font-bold shadow-xl">
              <Activity size={14} className="text-amber-500" /> {healthData.goal}
            </span>
            <span className="bg-neutral-900 border border-white/10 px-6 py-2 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 font-bold shadow-xl text-amber-500">
              <Calendar size={14} /> TEAM LITTLE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end ml-4 mb-4">
           <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 font-black">Métricas de Performance</h3>
           
           {!isEditingMetrics ? (
             <button 
               onClick={() => setIsEditingMetrics(true)}
               className="text-amber-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:text-white transition-colors"
             >
               <Edit2 size={12} /> Atualizar Bio (Auto-Save)
             </button>
           ) : (
             <div className="flex items-center gap-4">
               <span className="text-[10px] font-mono font-black uppercase text-amber-500 animate-pulse">
                 {autoSaveStatus === "saving" ? "Salvando..." : autoSaveStatus === "saved" ? "✓ Gravado!" : "Modo Automático"}
               </span>
               <button 
                 onClick={() => setIsEditingMetrics(false)}
                 className="text-emerald-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:text-white transition-colors"
               >
                 <Check size={14} /> Concluir
               </button>
             </div>
           )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Peso (kg)', field: 'weight', val: healthData.weight, icon: Scale, color: 'text-amber-500', step: '0.1' },
            { label: 'Altura (m)', field: 'height', val: healthData.height, icon: TrendingUp, color: 'text-blue-500', step: '0.01' },
            { label: 'Gordura (%)', field: 'bf', val: healthData.bf, icon: Heart, color: 'text-rose-500', step: '0.1' },
            { label: 'Freq (bpm)', field: 'heartRate', val: healthData.heartRate, icon: Activity, color: 'text-emerald-500', step: '1' },
          ].map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 sm:p-8 bg-neutral-900 border ${isEditingMetrics ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-white/5'} rounded-[3rem] hover:border-amber-500/20 transition-all group overflow-hidden relative shadow-2xl`}
            >
              <div className={`absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-all duration-500 ${m.color} scale-150 pointer-events-none`}>
                <m.icon size={60} />
              </div>
              <p className="text-slate-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono mb-3 font-bold">{m.label}</p>
              
              {isEditingMetrics ? (
                <input 
                  type="number"
                  step={m.step}
                  min="0"
                  value={m.val || ''}
                  onChange={(e) => updateHealthField(m.field as keyof HealthMetrics, e.target.value)}
                  className={`w-full bg-black/50 border-b-2 border-amber-500 text-3xl font-black italic text-white tracking-tight outline-none py-1 focus:bg-black/80 transition-colors`}
                />
              ) : (
                <p className="text-3xl font-black italic text-white tracking-tight">
                  {m.val}{m.field === 'weight' ? 'kg' : m.field === 'height' ? 'm' : m.field === 'bf' ? '%' : ''}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modern High-Performance Dynamic Chart Segment */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-neutral-900 border border-white/5 p-8 md:p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-amber-500 font-black">Performance Tracking</span>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#FFFDF5] mt-1">Evolução de Composição</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Tab Controls */}
            <div className="bg-black/40 border border-white/5 p-1 rounded-xl flex">
              {[
                { label: 'Ambos', val: 'both' },
                { label: 'Peso', val: 'weight' },
                { label: 'Gordura', val: 'bf' }
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setChartMetric(tab.val as any)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all ${
                    chartMetric === tab.val 
                      ? 'bg-amber-500 text-black font-black italic' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddingEval(!isAddingEval)}
              className="bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-500 font-black italic text-[9px] tracking-widest uppercase px-4 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              {isAddingEval ? <X size={12} /> : <Plus size={12} />} Novo Registro
            </button>
          </div>
        </div>

        {/* Adding Metric Collapsible Form */}
        <AnimatePresence>
          {isAddingEval && (
            <motion.form 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onSubmit={handleCreateEval}
              className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Peso Corporal (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    placeholder="Ex: 82.5"
                    value={newEvalWeight}
                    onChange={(e) => setNewEvalWeight(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-3 px-5 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Gordura Corporal (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Ex: 14.2"
                    value={newEvalBF}
                    onChange={(e) => setNewEvalBF(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-3 px-5 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Data da Medição</label>
                  <input
                    type="date"
                    required
                    value={newEvalDate}
                    onChange={(e) => setNewEvalDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-3 px-5 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingEval(false)}
                  className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 text-black px-6 py-3 rounded-xl text-[10px] font-black italic tracking-widest uppercase flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-amber-500/10"
                >
                  {saving ? "Salvando..." : "Gravar Métrica"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Recharts Area Container */}
        <div className="h-80 md:h-[350px] w-full bg-black/30 rounded-3xl p-4 border border-white/5 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-yellow-pure)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--color-yellow-pure)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A5A58D" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#A5A58D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#8B8B7A" 
                tickLine={false} 
                axisLine={false}
                style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '0.1em' }} 
              />
              
              {chartMetric !== 'bf' && (
                <YAxis 
                  yAxisId="weight" 
                  stroke="var(--color-yellow-pure)" 
                  tickLine={false} 
                  axisLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  style={{ fontSize: '9px', fontFamily: 'monospace' }} 
                  unit="kg"
                />
              )}
              {chartMetric !== 'weight' && (
                <YAxis 
                  yAxisId="bf" 
                  orientation="right" 
                  stroke="var(--color-yellow-pure)" 
                  tickLine={false} 
                  axisLine={false}
                  domain={['dataMin - 1.5', 'dataMax + 1.5']}
                  style={{ fontSize: '9px', fontFamily: 'monospace' }} 
                  unit="%"
                />
              )}
              
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#222', strokeWidth: 1 }} />
              
              {chartMetric !== 'bf' && (
                <Area 
                  yAxisId="weight" 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--color-yellow-pure)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  name="weight"
                />
              )}
              {chartMetric !== 'weight' && (
                <Area 
                  yAxisId="bf" 
                  type="monotone" 
                  dataKey="bf" 
                  stroke="var(--color-yellow-pure)" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorBF)" 
                  name="bf"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recorded Real entries manager */}
        {evaluations.length > 0 ? (
          <div className="pt-6 border-t border-white/5 space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500">Histórico de Registros Real</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluations.map((ev) => (
                <div key={ev.id} className="flex justify-between items-center bg-black/40 border border-white/5 py-4 px-5 rounded-2xl hover:border-amber-500/30 transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      {new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex gap-4">
                      <p className="text-[#FFFDF5] font-black italic text-sm">Peso: <span className="text-amber-500">{ev.weight}kg</span></p>
                      {ev.bodyFat !== undefined && (
                        <p className="text-[#FFFDF5] font-black italic text-sm">BF: <span className="text-amber-500">{ev.bodyFat}%</span></p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        await deleteDoc(doc(db, "evaluations", ev.id));
                      } catch (err) {
                        console.error(err);
                        alert("Erro ao excluir registro.");
                      }
                    }}
                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black rounded-xl transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center font-mono text-[9px] uppercase tracking-widest text-[#8B8B7A] leading-relaxed pt-2">
            💡 Exibindo projeção estimativa. Registre suas métricas acima para começar seu acompanhamento dinâmico fidedigno.
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 ml-4 font-black">Ficha de Saúde</h3>
          <div className="bg-neutral-900 p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl">
             <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner group-hover:scale-110 transition-transform">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono font-bold">Restrições</p>
                  <p className="text-white font-bold italic text-lg tracking-tight">Nenhuma registrada</p>
                </div>
             </div>
             <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono font-bold">Tipo Sanguíneo</p>
                  <p className="text-white font-bold italic text-lg tracking-tight">{healthData.bloodType || 'Não Informado'}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 ml-4 font-black">Evolução Atlética PRO</h3>
          <div className="bg-amber-500 p-10 rounded-[3.5rem] text-black shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingUp size={120} />
              </div>
              <h4 className="text-3xl font-black italic uppercase mb-3 leading-none tracking-tighter">Power Score: 9.2</h4>
              <p className="text-sm font-bold opacity-90 leading-relaxed italic">DNA TEAM LITTLE PRO DETECTADO. Desempenho 15% acima da média do Team.</p>
              <div className="flex gap-2.5 mt-8">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="flex-1 h-2.5 bg-black/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: i*20+'%' }}
                        transition={{ duration: 1, delay: i*0.1 }}
                        className="h-full bg-black rounded-full" 
                     />
                   </div>
                 ))}
              </div>
          </div>
        </div>
      </div>

      {/* Simulated Chat Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center ml-4">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 font-black flex items-center gap-2">
            <MessageSquare size={14} className="text-amber-500" /> Suporte Direto PRO
          </h3>
          <span className="text-[9px] font-mono text-amber-500 animate-pulse uppercase font-black">Coach Online</span>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-[4rem] h-[500px] flex flex-col overflow-hidden shadow-2xl relative">
          {/* Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 md:p-10 space-y-6 custom-scrollbar scroll-smooth">
            {chatMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === 'student' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-end gap-3 ${msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'trainer' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-slate-400'
                }`}>
                  {msg.sender === 'trainer' ? <Dumbbell size={18} /> : <User size={18} />}
                </div>
                <div className={`max-w-[70%] p-5 rounded-3xl text-sm font-medium ${
                  msg.sender === 'student' 
                  ? 'bg-amber-500 text-black rounded-br-none' 
                  : 'bg-black/50 border border-white/5 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.text}
                  <p className={`text-[8px] mt-2 opacity-40 font-mono ${msg.sender === 'student' ? 'text-black' : 'text-slate-400'}`}>
                     {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-6 md:p-10 bg-black/40 border-t border-white/5 flex gap-4">
             <input 
               type="text" 
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               placeholder="Pergunte algo ao Coach Little..."
               className="flex-1 bg-neutral-900 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-amber-500 transition-all"
             />
             <button 
               type="submit"
               className="bg-amber-500 text-black p-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-amber-500/10"
             >
               <Send size={20} />
             </button>
          </form>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <Dumbbell size={300} className="text-white" />
          </div>
        </div>
      </div>

      {/* Main Profile Modal (Name/Photo) */}
      <AnimatePresence>
        {isEditingProfile && tempProfile && (
           <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 text-white">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingProfile(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-neutral-900 border border-white/10 w-full max-w-xl rounded-[3rem] p-10 relative z-10 shadow-2xl"
              >
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Personalizar Perfil</h3>
                    <button onClick={() => setIsEditingProfile(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24} /></button>
                  </div>

                  <div className="space-y-10">
                    <ImageUpload 
                      label="Alterar Foto de Identificação"
                      currentImage={tempProfile.photoURL}
                      onImageAction={(b64) => setTempProfile({...tempProfile, photoURL: b64})}
                    />
                    
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome de Atleta</label>
                       <input 
                         type="text"
                         value={tempProfile.name}
                         onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                         className="w-full bg-black border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#CA9B00] font-bold uppercase tracking-tight"
                       />
                    </div>

                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full py-5 bg-amber-500 text-black font-black italic uppercase rounded-2xl tracking-tighter flex items-center justify-center gap-3 text-lg shadow-xl shadow-amber-500/10"
                    >
                      {saving ? "Salvando DNA..." : <>Otimizar Perfil PRO <Save size={24} /></>}
                    </button>
                  </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
});

ProfileTab.displayName = 'ProfileTab';
