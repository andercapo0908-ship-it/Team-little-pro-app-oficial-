import React from "react";
import { DollarSign } from "lucide-react";
import { UserProfile } from "../types";

export const FinancialTab = React.memo(({ profile }: { profile: UserProfile | null }) => {
  return (
    <div className="p-6 md:p-8 pb-32 max-w-6xl mx-auto space-y-10">
      <div className="text-center py-20 border border-white/5 border-dashed rounded-[3rem]">
        <DollarSign size={48} className="mx-auto text-amber-500/20 mb-6" />
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Painel <span className="text-amber-500">Financeiro</span></h2>
        <p className="text-sm font-mono uppercase tracking-widest text-slate-500">Em Breve</p>
      </div>
    </div>
  );
});

FinancialTab.displayName = 'FinancialTab';
