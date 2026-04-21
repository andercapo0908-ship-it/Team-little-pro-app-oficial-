import React, { useState } from "react";
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
  Check
} from "lucide-react";
import { HealthMetrics, UserProfile } from "../types";
import { ImageUpload } from "./ImageUpload";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

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
  const [healthData, setHealthData] = useState<HealthMetrics>(profile?.health || defaultHealth);

  const handleSaveProfile = async () => {
    if (!tempProfile || !profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", profile.uid), {
        photoURL: tempProfile.photoURL,
        name: tempProfile.name
      });
      setIsEditingProfile(false);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMetrics = async () => {
    // Validations
    if (healthData.weight <= 0 || healthData.height <= 0 || (healthData.bf && healthData.bf < 0) || (healthData.heartRate && healthData.heartRate < 0)) {
      alert("Por favor, insira valores numéricos positivos e válidos para as métricas corporais.");
      return;
    }

    setSaving(true);
    try {
      if (profile) {
        await updateDoc(doc(db, "users", profile.uid), {
          health: healthData
        });
      }
      setIsEditingMetrics(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar métricas.");
    } finally {
      setSaving(false);
    }
  };

  const updateHealthField = (field: keyof HealthMetrics, value: string) => {
    const numValue = parseFloat(value);
    setHealthData(prev => ({
      ...prev,
      [field]: isNaN(numValue) && value !== '' ? prev[field] : (value === '' ? 0 : numValue)
    }));
  };

  return (
    <div className="p-6 pb-24 max-w-5xl mx-auto space-y-16">
      {/* Header Profile */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-10"
      >
        <div className="w-48 h-48 rounded-[3.5rem] border-4 border-[#CA9B00] overflow-hidden shadow-[0_0_60px_rgba(202,155,0,0.2)] relative group flex-shrink-0">
          <img 
            src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
            alt={profile?.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <button 
            onClick={() => { setTempProfile(profile); setIsEditingProfile(true); }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
             <Edit2 className="text-[#CA9B00]" size={32} />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4 pointer-events-none">
            <span className="text-[10px] font-black italic uppercase text-[#CA9B00] tracking-[0.3em]">Status: ELITE</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-6xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none"
            >
              {profile?.name}
            </motion.h2>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="bg-neutral-900 border border-white/10 px-6 py-2 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 font-bold shadow-xl">
              <Activity size={14} className="text-[#CA9B00]" /> {healthData.goal}
            </span>
            <span className="bg-neutral-900 border border-white/10 px-6 py-2 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 font-bold shadow-xl">
              <Calendar size={14} className="text-[#CA9B00]" /> Membro Ativo
            </span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end ml-4 mb-4">
           <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 font-black">Métricas Corporais</h3>
           
           {!isEditingMetrics ? (
             <button 
               onClick={() => setIsEditingMetrics(true)}
               className="text-[#CA9B00] text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:text-white transition-colors"
             >
               <Edit2 size={12} /> Atualizar
             </button>
           ) : (
             <button 
               onClick={handleSaveMetrics}
               disabled={saving}
               className="text-emerald-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:text-white transition-colors"
             >
               {saving ? "Salvando..." : <><Check size={14} /> Confirmar</>}
             </button>
           )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Peso (kg)', field: 'weight', val: healthData.weight, icon: Scale, color: 'text-[#CA9B00]', step: '0.1' },
            { label: 'Altura (m)', field: 'height', val: healthData.height, icon: TrendingUp, color: 'text-blue-500', step: '0.01' },
            { label: 'Gordura (%)', field: 'bf', val: healthData.bf, icon: Heart, color: 'text-red-500', step: '0.1' },
            { label: 'Freq (bpm)', field: 'heartRate', val: healthData.heartRate, icon: Activity, color: 'text-emerald-500', step: '1' },
          ].map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 sm:p-8 bg-neutral-900 border ${isEditingMetrics ? 'border-[#CA9B00]/40 shadow-[0_0_20px_rgba(202,155,0,0.1)]' : 'border-white/5'} rounded-[3rem] hover:border-[#CA9B00]/20 transition-all group overflow-hidden relative shadow-2xl`}
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
                  className={`w-full bg-black/50 border-b-2 border-[#CA9B00] text-3xl font-black italic text-white tracking-tight outline-none py-1 focus:bg-black/80 transition-colors`}
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
          <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 ml-4 font-black">Evolução Atlética</h3>
          <div className="bg-[#CA9B00] p-10 rounded-[3.5rem] text-black shadow-2xl shadow-[#CA9B00]/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingUp size={120} />
              </div>
              <h4 className="text-3xl font-black italic uppercase mb-3 leading-none tracking-tighter">Power Score: 8.5</h4>
              <p className="text-sm font-bold opacity-90 leading-relaxed italic">Você superou suas cargas em 12% nos últimos 30 dias. Mantendo essa cadência atingimos o objetivo em Outubro.</p>
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
                      className="w-full py-5 bg-[#CA9B00] text-black font-black italic uppercase rounded-2xl tracking-tighter flex items-center justify-center gap-3 text-lg shadow-xl shadow-[#CA9B00]/10"
                    >
                      {saving ? "Salvando DNA..." : <>Salvar Alterações <Save size={24} /></>}
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
