import React, { useState, useEffect } from "react";
import { 
  ImageIcon, 
  Plus, 
  Trash2, 
  Calendar, 
  ArrowRightLeft, 
  Maximize2, 
  Heart, 
  MessageCircle,
  Share2,
  Camera,
  Upload,
  Loader2,
  X,
  Target,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, storage } from "../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy, addDoc, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserProfile } from "../types";

interface TransformationPost {
  id: string;
  studentId: string;
  studentName: string;
  beforeUrl: string;
  afterUrl: string;
  description: string;
  date: string;
  likes: number;
}

export const GalleryTab = React.memo(({ profile }: { profile: UserProfile | null }) => {
  const isTrainerOrAdmin = profile?.role === 'trainer' || profile?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [posts, setPosts] = useState<TransformationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState<'before' | 'after' | null>(null);
  
  // Mock videos for demonstration if no DB videos
  const [videos] = useState([
    { id: 'v1', title: 'Técnica de Agachamento PRO', url: 'https://www.youtube.com/embed/n4p_8V27U3A', category: 'Tutorial' },
    { id: 'v2', title: 'Motivação Team Little', url: 'https://www.youtube.com/embed/SzhO5U-6f3Q', category: 'Highlights' },
    { id: 'v3', title: 'Biomecânica do Supino', url: 'https://www.youtube.com/embed/v9QE6T_h9Xg', category: 'Técnica' }
  ]);
  
  const [newPost, setNewPost] = useState<Partial<TransformationPost>>({
    studentName: "",
    beforeUrl: "",
    afterUrl: "",
    description: "",
    date: new Date().toISOString()
  });

  useEffect(() => {
    const q = query(collection(db, "transformations"), orderBy("date", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ ...d.data(), id: d.id } as TransformationPost)));
      setLoading(false);
    }, (err) => {
      console.error("Gallery sync error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(type);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${type}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setNewPost(prev => ({ ...prev, [type === 'before' ? 'beforeUrl' : 'afterUrl']: url }));
    } catch (err) { console.error(err); } finally { setUploading(null); }
  };

  const handleSavePost = async () => {
    if (!newPost.beforeUrl || !newPost.afterUrl || !newPost.studentName) return;
    try {
      await addDoc(collection(db, "transformations"), {
        ...newPost,
        likes: 0,
        date: new Date().toISOString()
      });
      setIsAdding(false);
      setNewPost({ studentName: "", beforeUrl: "", afterUrl: "", description: "" });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 md:p-8 pb-32 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">GALERIA <span className="text-amber-500">PRO</span></h2>
          <p className="text-[#FFFDF5]/60 font-mono text-[10px] uppercase tracking-[0.5em] font-black mt-2">Mural de Transformação & Conteúdo</p>
        </div>
        
        {isTrainerOrAdmin && activeTab === 'photos' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-amber-500 text-black px-6 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-amber-500/20"
          >
            <Plus size={16} /> Nova Transformação
          </button>
        )}
      </div>

      {/* Subtabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {[
          { id: 'photos', label: 'Transformações', icon: ImageIcon },
          { id: 'videos', label: 'Treinos em Vídeo', icon: Target }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] uppercase font-black tracking-widest transition-all ${
              activeTab === tab.id 
              ? 'bg-amber-500 text-black' 
              : 'text-slate-500 hover:text-white bg-white/5'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'photos' ? (
        /* Photos Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/50 border border-white/5 rounded-[3rem] overflow-hidden group"
            >
              <div className="grid grid-cols-2 aspect-video relative group/gallery">
                 <div className="relative overflow-hidden">
                   <img src={post.beforeUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Antes" />
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-white border border-white/10 tracking-widest">Antes</div>
                 </div>
                 <div className="relative overflow-hidden border-l border-white/10">
                   <img src={post.afterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Depois" />
                   <div className="absolute top-4 right-4 bg-amber-500 px-3 py-1 rounded-full text-[9px] font-black uppercase text-black italic tracking-widest">Depois</div>
                 </div>
                 
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-3 bg-amber-500 text-black rounded-full shadow-2xl scale-0 group-hover/gallery:scale-100 transition-transform duration-500">
                      <ArrowRightLeft size={20} />
                    </div>
                 </div>
              </div>

              <div className="p-8 space-y-4">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-black italic uppercase italic text-xl tracking-tight text-white">{post.studentName}</h3>
                      <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500"><Calendar size={12}/> {new Date(post.date).toLocaleDateString()}</p>
                    </div>
                    {isTrainerOrAdmin && (
                      <button onClick={async () => { if(confirm("Deseja apagar?")) await deleteDoc(doc(db, "transformations", post.id)); }} className="text-red-500/40 hover:text-red-500"><Trash2 size={18}/></button>
                    )}
                 </div>
                 <p className="text-slate-400 text-sm italic leading-relaxed">"{post.description}"</p>
                 
                 <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors group">
                      <Heart size={16} className="group-active:scale-150 transition-transform" /> {post.likes || 0} Likes
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
                      <MessageCircle size={16} /> Comentar
                    </button>
                    <button className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors">
                      <Share2 size={16} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Videos Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map(video => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden group shadow-2xl"
            >
              <div className="aspect-video relative">
                <iframe 
                  src={video.url} 
                  className="w-full h-full border-0" 
                  allowFullScreen 
                  title={video.title}
                />
              </div>
              <div className="p-6">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-500 mb-2 block">{video.category}</span>
                <h3 className="font-black italic uppercase text-lg text-white mb-4">{video.title}</h3>
                <button className="w-full py-3 bg-white/5 hover:bg-amber-500 hover:text-black transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Play size={14} /> Assistir Aula
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20 border border-white/5 border-dashed rounded-[3rem]">
          <Target size={48} className="mx-auto text-amber-500/20 mb-6" />
          <p className="text-sm font-mono uppercase tracking-widest text-slate-500">Seja a primeira transformação motivadora!</p>
        </div>
      )}

      {/* Add Transformation Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAdding(false)} />
             <motion.div 
               initial={{scale: 0.9, opacity: 0}} 
               animate={{scale: 1, opacity: 1}} 
               exit={{scale: 0.9, opacity: 0}} 
               className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
             >
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter">Postar <span className="text-amber-500">Resultado</span></h2>
                   <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Foto Antes</label>
                          <label className="w-full aspect-square cursor-pointer group block border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-2xl overflow-hidden relative bg-black transition-all">
                            {newPost.beforeUrl ? (
                              <img src={newPost.beforeUrl} className="w-full h-full object-cover opacity-50 transition-opacity" />
                            ) : null}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                              {uploading === 'before' ? <Loader2 size={24} className="animate-spin text-amber-500" /> : <Camera size={24} className="text-slate-500" />}
                              <span className="text-[10px] font-black uppercase tracking-widest">Antes</span>
                            </div>
                            <input type="file" onChange={(e) => handleFileUpload(e, 'before')} className="hidden" />
                          </label>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Foto Depois</label>
                          <label className="w-full aspect-square cursor-pointer group block border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-2xl overflow-hidden relative bg-black transition-all">
                            {newPost.afterUrl ? (
                              <img src={newPost.afterUrl} className="w-full h-full object-cover opacity-50 transition-opacity" />
                            ) : null}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                              {uploading === 'after' ? <Loader2 size={24} className="animate-spin text-amber-500" /> : <Camera size={24} className="text-slate-500" />}
                              <span className="text-[10px] font-black uppercase tracking-widest">Depois</span>
                            </div>
                            <input type="file" onChange={(e) => handleFileUpload(e, 'after')} className="hidden" />
                          </label>
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome do Aluno</label>
                       <input type="text" value={newPost.studentName} onChange={e => setNewPost({...newPost, studentName: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500" placeholder="Ex: João Silva" />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Relato / Depoimento</label>
                       <textarea rows={3} value={newPost.description} onChange={e => setNewPost({...newPost, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 text-sm" placeholder="Quantos kg foram perdidos? Qual foi a maior mudança?" />
                    </div>

                    <button 
                     onClick={handleSavePost}
                     disabled={!!uploading || !newPost.beforeUrl || !newPost.afterUrl}
                     className="w-full bg-amber-500 text-black py-5 rounded-[2rem] font-black italic uppercase tracking-[0.3em] shadow-xl shadow-amber-500/10 hover:bg-white transition-all disabled:opacity-50"
                    >
                      {uploading ? "Aguarde Upload..." : "Publicar Transformação"}
                    </button>
                 </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

GalleryTab.displayName = 'GalleryTab';
