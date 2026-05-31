import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Search, 
  User as UserIcon, 
  MessageSquare, 
  Flame, 
  CheckCheck, 
  Dumbbell, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  doc,
  setDoc,
  onSnapshot, 
  query, 
  where,
  getDocs 
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { UserProfile } from '../types';

interface ChatMessage {
  id: string;
  studentId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface ChatTabProps {
  profile: UserProfile | null;
}

export const ChatTab = React.memo(({ profile }: ChatTabProps) => {
  if (!profile) return null;

  const isTrainerOrAdmin = profile.role === 'trainer' || profile.role === 'admin';
  
  // State for trainer view
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Common States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick suggestions for easy interactive taps
  const studentSuggestions = [
    "🔥 Treino pago mestre!",
    "💪 Dúvida sobre a execução",
    "🏃 Prontinho pro cardio!",
    "⚖️ Relatório de peso atualizado"
  ];

  const trainerSuggestions = [
    "🔥 Excelente! Técnica em primeiro lugar.",
    "💪 Mantenha a consistência, campeão!",
    "🥗 Atenção total na hidratação hoje.",
    "🚀 O processo é lento mas o resultado é garantido!"
  ];

  const currentSuggestions = isTrainerOrAdmin ? trainerSuggestions : studentSuggestions;

  // 1. Fetch Students lists if current user is Trainer
  useEffect(() => {
    if (!isTrainerOrAdmin) return;

    setLoading(true);
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentList = snapshot.docs.map(doc => doc.data() as UserProfile);
      setStudents(studentList.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
      
      // Auto select first student if available and none selected yet
      if (studentList.length > 0 && !selectedStudent) {
        setSelectedStudent(studentList[0]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "users");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isTrainerOrAdmin]);

  // 2. Fetch Chat Messages in RT depending on active student
  useEffect(() => {
    // Determine which student's partition of the chat we are listening to
    const targetStudentId = isTrainerOrAdmin ? selectedStudent?.uid : profile.uid;
    
    if (!targetStudentId) {
      if (!isTrainerOrAdmin) setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "chat_messages"),
      where("studentId", "==", targetStudentId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as ChatMessage;
      });

      // Sort in-memory safely to prevent index requirements crash
      const sortedMsgs = msgs.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setMessages(sortedMsgs);
      setLoading(false);

      // Scroll to bottom immediately
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `chat_messages/${targetStudentId}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedStudent, profile.uid, isTrainerOrAdmin]);

  // Scroll on messages count increase
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Send message function
  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const targetStudentId = isTrainerOrAdmin ? selectedStudent?.uid : profile.uid;
    if (!targetStudentId) return;

    setSending(true);
    const docRef = doc(collection(db, "chat_messages"));
    const newMessageDoc = {
      id: docRef.id,
      studentId: targetStudentId,
      senderId: profile.uid,
      senderName: profile.name,
      text: trimmed,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(docRef, newMessageDoc);
      setInputMessage("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chat_messages/${docRef.id}`);
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="chat-tab-container" className="p-4 md:p-8 pb-32 max-w-6xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
            CHAT <span className="text-amber-500">DIRETO</span>
          </h2>
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-[0.5em] font-black mt-1">
            Conexão instantânea de alta performance
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/5 rounded-2xl">
          <Lock size={12} className="text-amber-500/60 animate-pulse" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Canal Seguro do Team Little</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px] rounded-[3rem] overflow-hidden border border-white/5 bg-neutral-950/80 backdrop-blur-xl">
        
        {/* LEFT COLUMN: Student selector (Trainers only) */}
        {isTrainerOrAdmin && (
          <div className="lg:col-span-4 border-r border-white/5 flex flex-col h-full bg-neutral-900/40">
            {/* Search Box */}
            <div className="p-6 border-b border-white/5 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black text-amber-500">Seus Atletas Ativos</span>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Buscar aluno..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-mono tracking-wider outline-none text-white placeholder-slate-600 focus:border-amber-500 focus:bg-black transition-all"
                />
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {loading && students.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase animate-pulse">Sincronizando Atletas...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12 text-slate-600 font-mono text-xs uppercase">Nenhum atleta encontrado</div>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.uid === student.uid;
                  return (
                    <button
                      key={student.uid}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 relative ${
                        isSelected 
                          ? 'bg-amber-500 text-black font-black italic shadow-lg shadow-amber-500/20' 
                          : 'bg-white/2 hover:bg-white/5 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-black text-amber-500' : 'bg-neutral-800 text-white border border-white/10'}`}>
                          {student.photoURL ? (
                            <img src={student.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <UserIcon size={16} />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-xs uppercase tracking-wider ${isSelected ? 'font-black text-black' : 'font-bold text-neutral-200'}`}>
                            {student.name}
                          </h4>
                          <span className={`text-[9px] font-mono block ${isSelected ? 'text-black/60' : 'text-slate-500'}`}>
                            {student.email}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className={isSelected ? 'text-black' : 'text-slate-600'} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Chat Area */}
        <div className={`${isTrainerOrAdmin ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col h-full bg-black/40 relative`}>
          
          {/* Active Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-neutral-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
                {isTrainerOrAdmin ? <UserIcon size={18} /> : <Flame size={18} className="animate-pulse" />}
              </div>
              <div>
                <h3 className="text-sm font-black uppercase italic tracking-widest text-[#FFFDF5]">
                  {isTrainerOrAdmin 
                    ? (selectedStudent ? selectedStudent.name : 'Nenhum Selecionado') 
                    : 'WARLYSON PERSONAL'
                  }
                </h3>
                <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
                  Canal Direto On-line
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-500" />
              <span>Team Little Pro</span>
            </div>
          </div>

          {/* Messages display stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-radial-gradient">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest animate-pulse">Sincronizando histórico...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <MessageSquare className="text-neutral-800" size={48} />
                <div className="space-y-1">
                  <p className="text-neutral-500 text-xs uppercase tracking-widest font-mono">Nenhuma mensagem registrada</p>
                  <p className="text-slate-600 text-[10px] max-w-xs uppercase leading-relaxed">
                    Comece enviando um alô ou use um dos atalhos rápidos abaixo!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === profile.uid;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[8px] font-mono text-slate-600 mb-1 px-1 uppercase tracking-wider">
                      {isMine ? 'Você' : msg.senderName}
                    </span>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      isMine 
                        ? 'bg-amber-500 text-black font-semibold rounded-tr-none shadow-lg shadow-amber-500/5' 
                        : 'bg-neutral-900 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap selection:bg-black selection:text-white">{msg.text}</p>
                      <div className="flex items-center gap-1 justify-end mt-1.5 opacity-60">
                        <span className={`text-[8px] font-mono ${isMine ? 'text-black/60' : 'text-slate-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && <CheckCheck size={10} className="text-black/60" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTED TAPS (Quick replies) */}
          <div className="px-6 py-2 border-t border-white/5 flex gap-2 overflow-x-auto whitespace-nowrap scroll-none bg-neutral-950/40">
            {currentSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="bg-neutral-900 hover:bg-amber-500 hover:text-black border border-white/5 hover:border-transparent text-slate-400 font-mono text-[9px] uppercase tracking-wider py-2 px-4 rounded-full transition-all shrink-0 duration-300"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Send Input Area */}
          <form onSubmit={handleFormSubmit} className="p-6 border-t border-white/5 bg-neutral-900/30 flex items-center gap-4">
            <input 
              type="text"
              placeholder="Digite sua mensagem de treino..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={sending}
              className="flex-1 bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none text-white focus:border-amber-500 focus:bg-black transition-all"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="p-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl transition-all shadow-xl shadow-amber-500/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
});

ChatTab.displayName = 'ChatTab';
