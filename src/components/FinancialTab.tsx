import React, { useState } from "react";
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  FileText, 
  TrendingUp, 
  PieChart,
  ArrowUpRight,
  QrCode,
  ShieldCheck,
  ChevronRight,
  History,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

const MOCK_PAYMENTS = [
  { id: '1', month: 'Maio 2026', amount: 150.00, status: 'Pendente', dueDate: '15/05/2026', type: 'Mensalidade' },
  { id: '2', month: 'Abril 2026', amount: 150.00, status: 'Pago', dueDate: '15/04/2026', type: 'Mensalidade', paymentDate: '12/04/2026' },
  { id: '3', month: 'Março 2026', amount: 150.00, status: 'Pago', dueDate: '15/03/2026', type: 'Mensalidade', paymentDate: '14/03/2026' },
];

export const FinancialTab = React.memo(({ profile }: { profile: UserProfile | null }) => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  return (
    <div className="p-6 md:p-8 pb-32 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">CONTROLE <span className="text-amber-500">FINANCEIRO</span></h2>
        <p className="text-[#FFFDF5] font-mono text-[10px] uppercase tracking-[0.5em] font-black">Saldos & Transparência Team Little</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-neutral-900 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={64} className="text-amber-500" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500 mb-2">Próximo Vencimento</p>
          <h3 className="text-3xl font-black text-white italic">15/05</h3>
          <p className="text-amber-500 font-black mt-4 flex items-center gap-2">
            R$ 150,00 <ArrowUpRight size={16} />
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-neutral-900 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <History size={64} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500 mb-2">Status da Conta</p>
          <div className="flex items-center gap-2 text-green-500 font-black mt-2">
            <ShieldCheck size={20} />
            <h3 className="text-xl uppercase italic">Regular</h3>
          </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-4">Nenhuma pendência</p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-neutral-900 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart size={64} className="text-purple-500" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-500 mb-2">Total Investido</p>
          <h3 className="text-3xl font-black text-white italic">R$ 4.200</h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-4">Desde o início</p>
        </motion.div>
      </div>

      {/* History Table */}
      <div className="bg-black/50 border border-white/5 rounded-[3rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Histórico de Pagamentos</h3>
          <button className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors flex items-center gap-2">
            <Download size={14} /> Baixar Relatório
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-8 py-5">Referência</th>
                <th className="px-8 py-5">Vencimento</th>
                <th className="px-8 py-5">Valor</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_PAYMENTS.map((payment) => (
                <tr key={payment.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${payment.status === 'Pago' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm uppercase">{payment.type}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">{payment.month}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-mono italic">{payment.dueDate}</td>
                  <td className="px-8 py-6 font-black text-white">R$ {payment.amount.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black italic px-3 py-1 rounded-full uppercase tracking-widest ${
                      payment.status === 'Pago' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedPayment(payment)}
                      className="p-3 bg-white/5 hover:bg-amber-500 hover:text-black rounded-xl transition-all"
                    >
                      {payment.status === 'Pago' ? <Download size={14} /> : <QrCode size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedPayment(null)} />
             <motion.div 
               initial={{scale: 0.9, opacity: 0}} 
               animate={{scale: 1, opacity: 1}} 
               exit={{scale: 0.9, opacity: 0}} 
               className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden"
             >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full" />
                <div className="space-y-8 relative z-10 text-center">
                   <div className="p-4 bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                     <QrCode size={40} className="text-amber-500" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-3xl font-black italic uppercase italic">Pagamento <span className="text-amber-500">PIX</span></h3>
                     <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">{selectedPayment.month} • {selectedPayment.type}</p>
                   </div>
                   
                   <div className="bg-white p-6 rounded-3xl w-64 h-64 mx-auto shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=COPIECOLA_PIX_EXEMPLO" className="w-full h-full" alt="QR Code" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center bg-black/50 p-4 border border-white/5 rounded-2xl">
                         <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Valor Total</span>
                         <span className="text-2xl font-black text-white">R$ {selectedPayment.amount.toFixed(2)}</span>
                      </div>
                      <button className="w-full bg-white/5 border border-white/10 hover:border-amber-500/50 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
                        <ArrowUpRight size={18} className="text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-widest">Copiar Código PIX</span>
                      </button>
                      <button 
                        onClick={() => setSelectedPayment(null)}
                        className="w-full bg-amber-500 text-black py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-xl hover:bg-white transition-all text-sm"
                      >
                        Já realizei o pagamento
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

FinancialTab.displayName = 'FinancialTab';
