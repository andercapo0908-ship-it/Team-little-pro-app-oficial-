import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface LoginFormProps {
  role: 'student' | 'trainer';
  onBack: () => void;
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
}

export const LoginForm = React.memo(({ role, onBack, onLogin, onRegister }: LoginFormProps) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Preencha todos os campos");
      return;
    }
    
    setError("");
    setLoading(true);

    const finalEmail = identifier.includes("@") ? identifier : `${identifier.toLowerCase().replace(/\s/g, '')}@teamlittle.com`;
    const loginSuccess = await onLogin(finalEmail, password);
    
    if (!loginSuccess) {
      try {
        await onRegister(finalEmail, password, identifier);
      } catch (err: any) {
        if (err.message?.includes("auth/wrong-password") || err.message?.includes("incorrect password")) {
          setError("Senha incorreta para este usuário.");
        } else {
          setError("Erro ao acessar conta. Verifique os dados.");
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <button onClick={onBack} className="mb-12 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-neon transition-colors group">
          <div className="w-8 h-[1px] bg-slate-800 group-hover:bg-neon transition-colors" />
          Voltar
        </button>

        <div className="text-left mb-10 border-l-2 border-neon pl-6">
          <h2 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">ACESSAR {role === 'trainer' ? 'TREINADOR' : 'ALUNO'} <span className="text-neon">PRO</span></h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-mono">Digite seu nome e senha para entrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-slate-500 ml-1">Usuário / Nome</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-neutral-900 border border-white/5 rounded-none py-4 px-4 focus:border-neon outline-none transition-all font-mono text-sm uppercase placeholder:text-slate-700"
              placeholder="EX: JOSE SILVA"
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-slate-500 ml-1">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-white/5 rounded-none py-4 px-4 focus:border-neon outline-none transition-all font-mono text-sm placeholder:text-slate-700"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="text-red-500 text-[10px] uppercase font-mono tracking-wider bg-red-500/10 p-3 border-l-2 border-red-500"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-neon text-black font-black italic rounded-none mt-4 uppercase tracking-tighter flex items-center justify-center gap-2 ${loading ? 'opacity-50' : 'shadow-2xl shadow-neon/10'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>ENTRAR NO DNA PRO <ChevronRight size={18} /></>
            )}
          </motion.button>
        </form>

        <p className="mt-12 text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">
          O acesso será criado automaticamente no primeiro login.
        </p>
      </motion.div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
