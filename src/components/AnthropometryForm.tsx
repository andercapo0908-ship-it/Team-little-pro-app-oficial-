import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, Save, ChevronDown, CheckCircle } from 'lucide-react';
import { Evaluation } from '../types';

interface Props {
  evaluation: Evaluation;
  onChange: (ev: Evaluation) => void;
  userAge: number;
  userGender: 'male' | 'female';
}

const protocols = [
  { id: 'jp3', name: 'Jackson & Pollock 3 Dobras (1984)' },
  { id: 'jp4', name: 'Jackson & Pollock 4 Dobras (1985)' },
  { id: 'jp7', name: 'Jackson & Pollock 7 Dobras' },
  { id: 'durnin', name: 'Durnin & Womersley' },
  { id: 'faulkner', name: 'Faulkner (1968)' },
];

export const AnthropometryForm = ({ evaluation, onChange, userAge, userGender }: Props) => {
  const [protocol, setProtocol] = useState(evaluation.protocol || 'jp7');
  const m = evaluation.measurements || { skinfolds: {}, circumferences: {} };
  const s = m.skinfolds || {};
  const c = m.circumferences || {};

  const handleSkinfold = (field: keyof typeof s, value: string) => {
    const num = parseFloat(value) || undefined;
    onChange({
      ...evaluation,
      measurements: { ...m, skinfolds: { ...s, [field]: num } }
    });
  };

  const handleCircumference = (field: keyof typeof c, value: string) => {
    const num = parseFloat(value) || undefined;
    onChange({
      ...evaluation,
      measurements: { ...m, circumferences: { ...c, [field]: num } }
    });
  };

  useEffect(() => {
    calculateBodyFat();
  }, [s, evaluation.weight, protocol, userAge, userGender]);

  const calculateBodyFat = () => {
    let bf = 0;
    const age = userAge || 30;
    let bd = 0; // Body Density

    const sum3 = (s.chest || 0) + (s.abdominal || 0) + (s.thigh || 0);
    const sum3F = (s.triceps || 0) + (s.suprailiac || 0) + (s.thigh || 0);
    const sum4 = (s.triceps || 0) + (s.suprailiac || 0) + (s.abdominal || 0) + (s.thigh || 0); // approx J&P 4
    const sum7 = (s.chest || 0) + (s.midaxillary || 0) + (s.triceps || 0) + (s.subscapular || 0) + (s.abdominal || 0) + (s.suprailiac || 0) + (s.thigh || 0);
    const sumDurnin = (s.biceps || 0) + (s.triceps || 0) + (s.subscapular || 0) + (s.suprailiac || 0);
    const sumFaulkner = (s.triceps || 0) + (s.subscapular || 0) + (s.suprailiac || 0) + (s.abdominal || 0);

    if (protocol === 'jp3') {
      if (userGender === 'male') {
        bd = 1.10938 - (0.0008267 * sum3) + (0.0000016 * Math.pow(sum3, 2)) - (0.0002574 * age);
      } else {
        bd = 1.0994921 - (0.0009929 * sum3F) + (0.0000023 * Math.pow(sum3F, 2)) - (0.0001392 * age);
      }
      if (bd > 0) bf = (495 / bd) - 450;
    } else if (protocol === 'jp4') {
      if (userGender === 'male') {
         bf = (0.29288 * sum4) - (0.0005 * Math.pow(sum4, 2)) + (0.15845 * age) - 5.8;
      } else {
         bf = (0.29669 * sum4) - (0.00043 * Math.pow(sum4, 2)) + (0.02963 * age) + 1.4072;
      }
    } else if (protocol === 'jp7') {
      if (userGender === 'male') {
        bd = 1.112 - (0.00043499 * sum7) + (0.00000055 * Math.pow(sum7, 2)) - (0.00028826 * age);
      } else {
        bd = 1.097 - (0.00046971 * sum7) + (0.00000056 * Math.pow(sum7, 2)) - (0.00012828 * age);
      }
      if (bd > 0) bf = (495 / bd) - 450;
    } else if (protocol === 'durnin') {
      let cVal = 0; let mVal = 0;
      if (userGender === 'male') {
        if(age < 17) { cVal=1.1533; mVal=0.0643; }
        else if (age <= 19) { cVal=1.1620; mVal=0.0630; }
        else if (age <= 29) { cVal=1.1631; mVal=0.0632; }
        else if (age <= 39) { cVal=1.1422; mVal=0.0544; }
        else if (age <= 49) { cVal=1.1620; mVal=0.0700; }
        else { cVal=1.1715; mVal=0.0779; }
      } else {
        if(age < 17) { cVal=1.1369; mVal=0.0598; }
        else if (age <= 19) { cVal=1.1549; mVal=0.0678; }
        else if (age <= 29) { cVal=1.1599; mVal=0.0717; }
        else if (age <= 39) { cVal=1.1423; mVal=0.0632; }
        else if (age <= 49) { cVal=1.1333; mVal=0.0612; }
        else { cVal=1.1339; mVal=0.0645; }
      }
      if (sumDurnin > 0) {
        bd = cVal - (mVal * Math.log10(sumDurnin));
        bf = (495 / bd) - 450;
      }
    } else if (protocol === 'faulkner') {
       bf = (sumFaulkner * 0.153) + 5.783;
    }

    if (bf > 0 && bf < 60) {
      const w = evaluation.weight || 0;
      const fatM = (bf / 100) * w;
      const leanM = w - fatM;
      onChange({
        ...evaluation,
        bodyFat: parseFloat(bf.toFixed(2)),
        fatMass: parseFloat(fatM.toFixed(2)),
        leanMass: parseFloat(leanM.toFixed(2)),
        protocol: protocol
      });
    }
  };

  return (
    <div className="space-y-6 bg-black/40 p-4 sm:p-6 rounded-3xl border border-white/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <h4 className="font-mono text-gold text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Calculator size={14} /> Antropometria & Dobras
         </h4>
         <select 
            value={protocol} 
            onChange={e => setProtocol(e.target.value)}
            className="bg-black border border-white/10 text-white rounded-xl px-4 py-2 text-[10px] uppercase font-mono tracking-widest outline-none focus:border-gold w-full sm:w-auto"
         >
            {protocols.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
         </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <h5 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4 border-b border-white/5 pb-2">Dobras Cutâneas (mm)</h5>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             <SkinfoldInput label="Tríceps" val={s.triceps} onChange={v => handleSkinfold('triceps', v)} />
             <SkinfoldInput label="Bíceps" val={s.biceps} onChange={v => handleSkinfold('biceps', v)} />
             <SkinfoldInput label="Subescapular" val={s.subscapular} onChange={v => handleSkinfold('subscapular', v)} />
             <SkinfoldInput label="Suprailíaca" val={s.suprailiac} onChange={v => handleSkinfold('suprailiac', v)} />
             <SkinfoldInput label="Abdominal" val={s.abdominal} onChange={v => handleSkinfold('abdominal', v)} />
             <SkinfoldInput label="C. Anterior" val={s.thigh} onChange={v => handleSkinfold('thigh', v)} />
             <SkinfoldInput label="Panturrilha" val={s.calf} onChange={v => handleSkinfold('calf', v)} />
             <SkinfoldInput label="Peitoral" val={s.chest} onChange={v => handleSkinfold('chest', v)} />
             <SkinfoldInput label="Ax. Média" val={s.midaxillary} onChange={v => handleSkinfold('midaxillary', v)} />
           </div>
        </div>
        
        <div>
           <h5 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4 border-b border-white/5 pb-2">Perimetria (cm)</h5>
           <div className="grid grid-cols-2 gap-3">
             <SkinfoldInput label="Tórax" val={c.chest} onChange={v => handleCircumference('chest', v)} />
             <SkinfoldInput label="Cintura" val={c.waist} onChange={v => handleCircumference('waist', v)} />
             <SkinfoldInput label="Abdômen" val={c.abdomen} onChange={v => handleCircumference('abdomen', v)} />
             <SkinfoldInput label="Quadril" val={c.hip} onChange={v => handleCircumference('hip', v)} />
             <SkinfoldInput label="Braço Dir." val={c.armRight} onChange={v => handleCircumference('armRight', v)} />
             <SkinfoldInput label="Coxa Dir." val={c.thighRight} onChange={v => handleCircumference('thighRight', v)} />
             <SkinfoldInput label="Pantu. Dir." val={c.calfRight} onChange={v => handleCircumference('calfRight', v)} />
           </div>
        </div>
      </div>

      <div className="bg-gold/10 border border-gold/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div>
           <p className="text-[9px] uppercase tracking-widest text-gold mb-1 font-black">Resultado Calculado</p>
           <h3 className="text-2xl font-black italic text-white flex items-baseline gap-2">
             {evaluation.bodyFat || 0}% <span className="text-[10px] text-slate-300 normal-case font-mono">Gordura Corporal</span>
           </h3>
        </div>
        <div className="flex gap-6">
           <div className="text-center">
              <span className="block text-[10px] uppercase font-mono text-slate-400">Massa Gorda</span>
              <span className="font-bold text-white text-sm">{evaluation.fatMass || 0}kg</span>
           </div>
           <div className="text-center">
              <span className="block text-[10px] uppercase font-mono text-slate-400">Massa Magra</span>
              <span className="font-bold text-white text-sm">{evaluation.leanMass || 0}kg</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const SkinfoldInput = ({ label, val, onChange }: { label: string, val: number | undefined, onChange: (v: string) => void }) => (
  <div className="bg-neutral-900 border border-white/5 rounded-xl p-2 relative group focus-within:border-gold/50 transition-colors">
     <label className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wider font-mono absolute top-2 left-3">{label}</label>
     <input 
        type="number" 
        value={val || ''} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border-none text-white text-sm sm:text-base font-bold outline-none mt-4 pl-1"
        placeholder="0.0"
     />
  </div>
);
