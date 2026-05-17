import React, { useState } from "react";
import { 
  MessageCircle, 
  Users, 
  Send, 
  Video, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ExternalLink,
  Smartphone,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

export const ConsultingTab = React.memo(({ profile }: { profile: UserProfile | null }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'group'>('direct');
  
  const CONSULTING_CARDS = [
    { title: 'Chat Individual', icon: MessageCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Mentoria em Grupo', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Vídeo Chamadas', icon: Video, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="p-6 md:p-8 pb-32 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">SALA <span className="text-neon">PRIVADA PRO</span></h2>
          <p className="text-neon/60 font-mono text-[10px] uppercase tracking-[0.5em] font-black mt-2">Suporte Individualizado Team Little</p>
        </div>
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
           <button 
            onClick={() => setActiveTab('direct')}
            className={`px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${activeTab === 'direct' ? 'bg-neon text-black' : 'text-slate-500 hover:text-white'}`}
           >Direct</button>
           <button 
            onClick={() => setActiveTab('group')}
            className={`px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${activeTab === 'group' ? 'bg-neon text-black' : 'text-slate-500 hover:text-white'}`}
           >Grupo Vip</button>
        </div>
      </div>

      {activeTab === 'direct' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Direct Access Card */}
           <div className="space-y-6">
              <div className="bg-neutral-900 border border-white/5 p-8 rounded-[3rem] space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                       <MessageCircle size={32} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic">Meu Personal</h3>
                       <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Acesso Direto 24/7</p>
                    </div>
                 </div>
                 
                 <p className="text-slate-400 text-sm leading-relaxed italic">
                   "Envie suas dúvidas, vídeos de execução ou fale sobre seus resultados diretamente no meu WhatsApp privado. Estou aqui para garantir que você não erre o caminho."
                 </p>

                 <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                       <CheckCircle2 size={14} className="text-green-500" /> Resposta em até 4 horas
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                       <ShieldCheck size={14} className="text-amber-500" /> Canal 100% Criptografado
                    </div>
                 </div>

                 <a 
                   href="https://wa.me/5511999999999" 
                   target="_blank" 
                   rel="noreferrer"
                   className="w-full py-5 bg-green-500 text-white rounded-2xl font-black italic uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-green-500/20"
                 >
                   <Send size={20} /> Abrir Chat WhatsApp
                 </a>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[3rem] flex items-center justify-between">
                 <div className="space-y-1">
                    <h4 className="text-blue-400 font-bold uppercase italic text-lg">Agendar Video-Call</h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Avaliação Mensal Inclusa</p>
                 </div>
                 <button className="p-4 bg-blue-500 text-white rounded-2xl hover:scale-110 transition-transform">
                    <Video size={24} />
                 </button>
              </div>
           </div>

           {/* Stats / Info */}
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/40 border border-white/5 p-6 rounded-3xl space-y-2">
                    <Clock className="text-amber-500" size={24} />
                    <h5 className="text-2xl font-black text-white italic">12</h5>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Dias para Próxima Aula</p>
                 </div>
                 <div className="bg-black/40 border border-white/5 p-6 rounded-3xl space-y-2">
                    <Zap className="text-purple-500" size={24} />
                    <h5 className="text-2xl font-black text-white italic">84%</h5>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Frequência Mensal</p>
                 </div>
              </div>

              <div className="bg-neutral-900 border border-white/5 rounded-[3.5rem] p-1 shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1541534741688-6078c64b52d3?auto=format&fit=crop&q=80&w=800" 
                    className="w-full aspect-video object-cover rounded-[3.2rem] opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                    alt="Training"
                 />
              </div>

              <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-3xl flex items-start gap-4">
                 <Info size={20} className="text-blue-400 shrink-0" />
                 <p className="text-[11px] text-slate-500 leading-relaxed font-mono uppercase">Lembre-se: O suporte premium está disponível de segunda a sexta, das 08h às 21h. Fins de semana apenas urgências.</p>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-white/5 rounded-[3.5rem] overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 space-y-8 flex flex-col justify-center">
                 <div className="space-y-4">
                    <h3 className="text-4xl font-black italic uppercase italic leading-none">Comunidade <span className="text-amber-500">Elite Little Team</span></h3>
                    <p className="text-slate-400 italic text-sm leading-relaxed">
                      "Exclusivo para membros! Um grupo onde todos compartilham metas, conquistas e trocam experiências sobre a jornada fitness."
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-white font-bold">
                       <CheckCircle2 className="text-amber-500" size={20} />
                       <span>Desafios Semanais</span>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold">
                       <CheckCircle2 className="text-amber-500" size={20} />
                       <span>Tira Dúvidas Coletivo</span>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold">
                       <CheckCircle2 className="text-amber-500" size={20} />
                       <span>Material Complementar Grátis</span>
                    </div>
                 </div>

                 <button className="w-full py-5 bg-white text-black rounded-2xl font-black italic uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-500 transition-all group">
                   Entrar no Grupo <Users size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
              <div className="relative aspect-square md:aspect-auto">
                 <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 transition-all duration-1000" />
                 <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent" />
                 <div className="absolute bottom-10 right-10 flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-neutral-900 bg-amber-500 flex items-center justify-center text-black font-black text-[10px] italic">
                      +120
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
});

ConsultingTab.displayName = 'ConsultingTab';
