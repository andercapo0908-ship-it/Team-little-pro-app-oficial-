import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap, 
  Dumbbell, 
  Clock, 
  User, 
  BrainCircuit,
  MessageSquare,
  ArrowDownCircle,
  Mic,
  Smile,
  ShieldCheck,
  TrendingUp,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AICoachTab = React.memo(({ profile }: { profile: UserProfile | null }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Olá! Sou seu Coach Inteligente do TEAM LITTLE PRO. Como posso otimizar seu treino ou dieta hoje?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: userMsg }]
          }
        ],
        config: {
          systemInstruction: `Você é o "Coach Little Pro AI", o assistente virtual inteligente e ultra-motivado do TEAM LITTLE PRO.
          Seu tom é: Energético, Profissional, Direto e levemente "hardcore" (estilo musculação de alta performance).
          Sua missão é:
          1. Sanar dúvidas técnicas sobre exercícios, biomecânica e nutrição.
          2. Motivar o atleta em momentos de desânimo.
          3. Sugerir ajustes baseados na filosofia Little Pro: Constância e Foco.
          
          Perceba que você está falando com ${profile?.name || "um atleta"} do time.
          Mantenha as respostas concisas, use emojis de academia e termine sempre com um grito de motivação curto como "FOCO!", "PRA CIMA!" ou "NO LIMITS!".
          Sempre fale em Português do Brasil.
          Se perguntarem sobre pagamentos ou problemas técnicos graves, peça para falarem com o coach humano no WhatsApp.`
        }
      });

      const aiText = response.text || "Desculpe, tive um lapso de memória nos meus circuitos. Vamos de novo?";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Ops! Deu um curto aqui. Verifique sua conexão e tente novamente!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-neutral-900 border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={80} className="text-amber-500" />
         </div>
         <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-amber-500/10 rounded-2xl">
               <BrainCircuit size={32} className="text-amber-500" />
            </div>
            <div>
               <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter">Personal <span className="text-amber-500">Inteligente</span></h2>
               <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Team Little Pro AI Coach</p>
            </div>
         </div>
         <div className="hidden md:flex items-center gap-3 bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/20">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Sistema Operacional</span>
         </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-6 px-2 py-4 liquid-scroll"
      >
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-[2rem] shadow-xl relative ${
              msg.role === 'user' 
              ? 'bg-amber-500 text-black font-bold rounded-tr-sm shadow-amber-500/20' 
              : 'bg-neutral-900 border border-white/5 text-slate-200 italic rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' && (
                <div className="absolute -top-3 -left-3 p-2 bg-amber-500 rounded-full text-black shadow-lg">
                   <Zap size={10} />
                </div>
              )}
              <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              <div className={`text-[8px] uppercase font-mono tracking-widest mt-3 opacity-40 ${msg.role === 'user' ? 'text-black' : 'text-slate-500'}`}>
                {msg.role === 'user' ? 'Você' : 'Coach AI'} • Agora
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-neutral-900 border border-white/5 p-6 rounded-[2rem] flex items-center gap-3">
                <div className="flex gap-1">
                   {[0,1,2].map(i => (
                     <motion.div 
                       key={i}
                       animate={{ y: [0, -5, 0] }}
                       transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                       className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                     />
                   ))}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">Processando...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative pt-4">
        <div className="bg-neutral-900 border border-white/10 p-2 rounded-[2.5rem] flex items-center shadow-[0_0_50px_rgba(245,158,11,0.05)]">
           <button className="p-4 text-slate-500 hover:text-amber-500 transition-colors">
              <Smile size={24} />
           </button>
           <input 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             placeholder="Como posso melhorar minha execução de agachamento?"
             className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-slate-600 text-sm md:text-base"
           />
           <div className="flex items-center gap-2 pr-2">
             <button className="p-4 text-slate-500 hover:text-blue-400 transition-colors hidden sm:block">
                <Mic size={24} />
             </button>
             <button 
               onClick={handleSend}
               disabled={!input.trim() || loading}
               className="p-4 bg-amber-500 text-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 font-bold"
             >
                <Send size={24} />
             </button>
           </div>
        </div>
        
        {/* Helper Chips */}
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
           {[
             { label: "Sugira um shake pré-treino", icon: Smile },
             { label: "Dicas para hipertrofia", icon: TrendingUp },
             { label: "Técnica de agachamento", icon: Dumbbell },
             { label: "Como evitar lesões?", icon: ShieldCheck }
           ].map((chip, i) => (
             <button 
               key={i}
               onClick={() => setInput(chip.label)}
               className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono uppercase tracking-widest text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all flex items-center gap-2"
             >
               <chip.icon size={12} /> {chip.label}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
});

AICoachTab.displayName = 'AICoachTab';
