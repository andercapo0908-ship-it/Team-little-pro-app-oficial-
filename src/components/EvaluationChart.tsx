import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Evaluation } from '../types';

interface Props {
  evaluations: Evaluation[];
}

export const EvaluationChart = ({ evaluations }: Props) => {
  if (evaluations.length < 2) return null;

  // Sort by date ascending to show timeline
  const data = [...evaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(ev => ({
    date: new Date(ev.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    fatMass: ev.fatMass || 0,
    leanMass: ev.leanMass || 0,
    weight: ev.weight || 0,
    bf: ev.bodyFat || 0,
  }));

  return (
    <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 mb-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      <h4 className="text-gold font-black italic uppercase text-lg mb-6 flex items-center justify-between">
         Evolução da Composição Corporal
         <span className="text-[10px] font-mono text-slate-500 font-bold ml-4">({evaluations.length} AVALIAÇÕES)</span>
      </h4>
      
      <div className="h-64 sm:h-80 w-full z-10 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '1rem', fontStyle: 'italic', fontWeight: 900 }}
              itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
              labelStyle={{ color: '#d4af37', marginBottom: '4px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="leanMass" name="Massa Magra (kg)" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorLean)" />
            <Area type="monotone" dataKey="fatMass" name="Massa Gorda (kg)" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFat)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
