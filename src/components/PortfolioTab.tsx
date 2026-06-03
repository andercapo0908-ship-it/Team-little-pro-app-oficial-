import React from "react";
import { 
  GraduationCap, 
  Briefcase, 
  Award 
} from "lucide-react";
import { TrainerPortfolio } from "../types";

export const PortfolioTab = React.memo(({ profile }: { profile: any }) => {
  const mockTrainer: TrainerPortfolio = {
    bio: "Especialista em transformação corporal há 12 anos. Mentor de mais de 500 atletas.",
    education: ["Mestrado em Fisiologia do Exercício", "Bacharel em Ed. Física (USP)"],
    experience: "Coach Pro NPC/IFBB",
    certifications: ["NSCA-CSCS", "Precision Nutrition Level 2"],
    specialties: ["Bodybuilding Prep", "Weight Loss", "Performance Enhancement"],
    photos: []
  };

  return (
    <div className="p-6 pb-24 max-w-5xl mx-auto space-y-16">
      <div className="relative">
        <div className="w-full h-80 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img src="https://picsum.photos/seed/fitness/1200/800" className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>
        <div className="absolute -bottom-10 left-12 w-40 h-40 rounded-full border-[6px] border-neutral-950 overflow-hidden bg-neutral-900 shadow-2xl">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=coach" className="w-full h-full object-cover" alt="Coach Avatar" />
        </div>
      </div>

      <div className="pt-6 mb-10 flex flex-col items-center md:items-start select-none">
        <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-3 leading-none text-white">Coach Little</h2>
        <div className="px-5 py-2 bg-amber-500/10 border border-amber-500/10 rounded-full">
          <p className="text-amber-400 font-mono tracking-[0.4em] text-[9px] uppercase font-black">Elite Head Coach & Performance Engineer Team Little</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <section>
              <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 mb-6 ml-4 font-black">História e Mentoria</h3>
              <p className="text-slate-300 italic leading-relaxed text-2xl font-medium border-l-4 border-amber-500 pl-8 py-2">"{mockTrainer.bio}"</p>
           </section>

           <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-10 bg-neutral-900 border border-white/5 rounded-[3rem] flex items-center gap-6 shadow-2xl hover:border-amber-500/10 transition-colors">
                 <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <GraduationCap size={28} />
                 </div>
                 <div>
                    <h5 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono font-bold">Educação</h5>
                    <p className="text-white font-black italic text-lg leading-tight mt-1">USP / Fisiologia</p>
                 </div>
              </div>
              <div className="p-10 bg-neutral-900 border border-white/5 rounded-[3rem] flex items-center gap-6 shadow-2xl hover:border-amber-500/10 transition-colors">
                 <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <Briefcase size={28} />
                 </div>
                 <div>
                    <h5 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono font-bold">Experiência</h5>
                    <p className="text-white font-black italic text-lg leading-tight mt-1">{mockTrainer.experience}</p>
                 </div>
              </div>
           </section>
        </div>

        <div className="space-y-10">
           <div>
              <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 ml-4 font-black mb-6">Especialidades</h3>
              <div className="flex flex-wrap gap-2.5">
                 {mockTrainer.specialties.map((s, i) => (
                   <span key={i} className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] text-white font-bold hover:bg-amber-500 hover:text-black transition-all cursor-default">
                      {s}
                   </span>
                 ))}
              </div>
           </div>

           <div>
              <h3 className="text-[11px] font-mono uppercase tracking-[0.6em] text-slate-500 ml-4 font-black mb-6">Certificações</h3>
              <div className="space-y-3">
                 {mockTrainer.certifications.map((c, i) => (
                   <div key={i} className="flex items-center gap-4 text-slate-400 bg-neutral-900/50 p-4 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                     <Award size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                     <span className="text-sm font-bold italic group-hover:text-white transition-colors">{c}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
});

PortfolioTab.displayName = 'PortfolioTab';
