import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Video, 
  FileText, 
  BookOpen, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  X, 
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EducationalContent, UserProfile, ContentType } from '../types';

interface EducationalTabProps {
  profile: UserProfile | null;
}

const CATEGORIES = ['Nutrição', 'Bem-Estar', 'Técnica', 'Mentalidade', 'Recuperação', 'Suplementação', 'Técnicas Avançadas'];
const CONTENT_TYPES: { id: ContentType; label: string; icon: any }[] = [
  { id: 'article', label: 'Artigos', icon: FileText },
  { id: 'video', label: 'Vídeos', icon: Video },
  { id: 'guide', label: 'Guias', icon: BookOpen },
];

export const EducationalTab: React.FC<EducationalTabProps> = ({ profile }) => {
  const isTrainerOrAdmin = profile?.role === 'trainer' || profile?.role === 'admin';
  const [items, setItems] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<ContentType | 'All'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationalContent | null>(null);
  const [activeItem, setActiveItem] = useState<EducationalContent | null>(null);

  const [formData, setFormData] = useState<Partial<EducationalContent>>({
    title: '',
    description: '',
    type: 'article',
    category: CATEGORIES[0],
    url: '',
    body: '',
    tags: []
  });

  useEffect(() => {
    const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EducationalContent[];
      
      if (dbItems.length === 0) {
        // Fallback for demo/initial state with requested articles
        const initialItems: EducationalContent[] = [
          {
            id: 'deadlift-adv',
            title: 'Levantamento Terra: Bracing e Ativação',
            description: 'Técnicas avançadas para um terra pesado e seguro.',
            type: 'article',
            category: 'Técnicas Avançadas',
            body: 'O bracing abdominal é a chave para o levantamento terra pesado. Mantenha a pressão intra-abdominal constante e ative os latíssimos como se estivesse tentando quebrar a barra no meio...',
            trainerId: 'seed',
            trainerName: 'Anderson Santana',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 42,
            tags: ['terra', 'powerlifting', 'bracing']
          },
          {
            id: 'bench-adv',
            title: 'Supino PRO: Leg Drive e Retração',
            description: 'Como usar as pernas para aumentar sua carga no supino.',
            type: 'article',
            category: 'Técnicas Avançadas',
            body: 'O supino não é apenas um exercício de empurrar. A retração escapular cria uma base sólida, e o leg drive transfere força do solo para a barra através da ponte...',
            trainerId: 'seed',
            trainerName: 'Anderson Santana',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 38,
            tags: ['supino', 'peitoral', 'técnica']
          },
          {
            id: 'shoulder-adv',
            title: 'Desenvolvimento: Estabilidade Escapular',
            description: 'Segredos para um desenvolvimento com halteres de elite.',
            type: 'article',
            category: 'Técnicas Avançadas',
            body: 'No desenvolvimento com halteres, a estabilidade das escápulas e o controle da descida são vitais. Evite o excesso de arqueamento lombar e foque em empurrar os halteres em uma trajetória levemente arqueada...',
            trainerId: 'seed',
            trainerName: 'Anderson Santana',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 35,
            tags: ['ombro', 'halteres', 'força']
          }
        ];
        setItems(initialItems);
      } else {
        setItems(dbItems);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const data = {
      ...formData,
      trainerId: profile?.uid,
      trainerName: profile?.name,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingItem) {
        await updateDoc(doc(db, 'content', editingItem.id), data);
      } else {
        await addDoc(collection(db, 'content'), {
          ...data,
          createdAt: new Date().toISOString(),
          likes: 0
        });
      }
      setIsAdding(false);
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        type: 'article',
        category: CATEGORIES[0],
        url: '',
        body: '',
        tags: []
      });
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este conteúdo?")) {
      try {
        await deleteDoc(doc(db, 'content', id));
      } catch (err) {
        console.error("Error deleting content:", err);
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <div className="p-6 md:p-10 pb-32 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2">EDUCACIONAL <span className="text-amber-500">PRO</span></h2>
          <p className="text-amber-500/60 font-mono text-[10px] uppercase tracking-[0.5em] font-black">Biblioteca de Performance e Conhecimento</p>
        </div>
        
        {isTrainerOrAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="group bg-amber-500 text-black px-8 py-5 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-white transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-amber-500/40 h-fit"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Postar Conteúdo
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
             <input 
              type="text" 
              placeholder="Pesquisar artigos, vídeos ou guias..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-white outline-none focus:border-amber-500 transition-all shadow-2xl"
             />
          </div>
          
          <div className="flex bg-neutral-900/50 p-1.5 rounded-[2rem] border border-white/5 shadow-2xl">
              {['All', 'article', 'video'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={`flex-1 py-3 px-4 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    selectedType === type 
                    ? 'bg-amber-500 text-black shadow-lg'
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {type === 'All' ? 'TODOS' : type === 'article' ? 'ARTIGOS' : 'VÍDEOS'}
                </button>
              ))}
          </div>

          <div className="relative group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-900 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-white outline-none focus:border-amber-500 appearance-none font-black italic uppercase text-xs tracking-widest cursor-pointer shadow-2xl"
            >
              <option value="All">CATEGORIAS</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-neutral-900/50 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl hover:border-amber-500/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-black">
                {item.type === 'video' && item.url ? (
                  <div className="w-full h-full relative cursor-pointer" onClick={() => setActiveItem(item)}>
                     <img 
                       src={item.thumbnailUrl || `https://img.youtube.com/vi/${item.url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`} 
                       className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                       alt={item.title} 
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-transform">
                          <Play size={24} fill="currentColor" />
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                     <FileText size={64} className="text-white/10" />
                  </div>
                )}
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                  {item.category}
                </div>
              </div>

              <div className="p-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2 text-amber-500">
                      {item.type === 'video' ? <Video size={14} /> : <FileText size={14} />}
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.type}</span>
                   </div>
                   {isTrainerOrAdmin && (
                     <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(item); setFormData(item); setIsAdding(true); }} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                     </div>
                   )}
                </div>

                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 line-clamp-2">{item.title}</h3>
                <p className="text-slate-500 text-sm italic leading-relaxed mb-8 line-clamp-3">"{item.description}"</p>

                <div className="mt-auto space-y-6">
                  <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.trainerId}`} 
                      className="w-8 h-8 rounded-full border border-white/10"
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">{item.trainerName}</p>
                      <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Coach Team Little</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveItem(item)}
                    className="w-full bg-white/5 hover:bg-amber-500 hover:text-black py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black italic uppercase tracking-[0.2em] transition-all"
                  >
                    {item.type === 'video' ? 'Assistir Agora' : 'Ler Matéria completo'} <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-neutral-900/20 border border-white/5 border-dashed rounded-[4rem]">
          <BookOpen size={64} className="mx-auto text-white/5 mb-8" />
          <h3 className="text-2xl font-black italic uppercase text-slate-500">Nenhum conteúdo encontrado</h3>
          <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest mt-2">Ajuste seus filtros ou tente outra pesquisa</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAdding(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">POSTAR <span className="text-amber-500">CONTEÚDO</span></h2>
                <button onClick={() => setIsAdding(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Tipo de Material</label>
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                      {CONTENT_TYPES.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({...formData, type: type.id})}
                          className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-xl transition-all ${
                            formData.type === type.id ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          <type.icon size={16} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Categoria Principal</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-amber-500 appearance-none font-black italic uppercase text-[10px] tracking-widest"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Título do Conteúdo</label>
                   <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Guia Definitivo de Proteínas"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-amber-500 font-black italic uppercase tracking-widest text-sm" 
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Descrição Curta (Teaser)</label>
                   <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Um resumo de 2-3 linhas que atraia o aluno..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-amber-500 text-sm italic" 
                   />
                </div>

                {formData.type === 'video' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Link do YouTube</label>
                    <input 
                      type="text" 
                      value={formData.url} 
                      onChange={e => setFormData({...formData, url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:border-amber-500 font-mono text-sm" 
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Corpo do Artigo / Guia (Suporta Markdown)</label>
                    <textarea 
                      rows={8} 
                      value={formData.body} 
                      onChange={e => setFormData({...formData, body: e.target.value})}
                      placeholder="Escreva aqui todo o conhecimento..."
                      className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 px-8 text-white outline-none focus:border-amber-500 text-sm leading-relaxed" 
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-black py-6 rounded-3xl font-black italic uppercase tracking-[0.3em] shadow-xl shadow-amber-500/20 hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 shimmer-btn-effect"
                >
                  {editingItem ? 'ATUALIZAR CONTEÚDO' : 'PUBLICAR NO SISTEMA'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reader/Viewer Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 flex items-center justify-center z-[250] p-0 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setActiveItem(null)} />
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="relative w-full max-w-5xl bg-neutral-900 md:rounded-[4rem] shadow-2xl h-full md:h-fit md:max-h-[85vh] overflow-hidden flex flex-col border border-white/5"
            >
              <div className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-amber-500/10 rounded-2xl">
                      {activeItem.type === 'video' ? <Video className="text-amber-500" size={24} /> : <FileText className="text-amber-500" size={24} />}
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em] mb-1">{activeItem.category}</p>
                      <h2 className="text-2xl md:text-3xl font-black italic uppercase italic leading-none">{activeItem.title}</h2>
                   </div>
                </div>
                <button onClick={() => setActiveItem(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all"><X size={28}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                {activeItem.type === 'video' && activeItem.url ? (
                  <div className="space-y-12">
                    <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-black shadow-2xl border border-white/10">
                       <iframe 
                        src={getEmbedUrl(activeItem.url)} 
                        className="w-full h-full border-0" 
                        allowFullScreen 
                        title={activeItem.title}
                       />
                    </div>
                    <div className="max-w-3xl mx-auto space-y-6">
                       <h3 className="text-2xl font-black italic uppercase tracking-tight">Sobre este vídeo</h3>
                       <p className="text-slate-400 text-lg italic leading-relaxed">"{activeItem.description}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-10">
                     <h2 className="text-4xl md:text-6xl font-black italic uppercase italic tracking-tighter leading-tight">{activeItem.title}</h2>
                     <p className="text-amber-500 font-black italic uppercase tracking-[0.3em] border-l-2 border-amber-500 pl-6">Resumo: {activeItem.description}</p>
                     
                     <div className="prose prose-invert max-w-none">
                        <div className="text-slate-300 text-lg leading-relaxed space-y-6 whitespace-pre-wrap font-medium">
                           {activeItem.body || "Conteúdo em desenvolvimento..."}
                        </div>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeItem.trainerId}`} 
                      className="w-12 h-12 rounded-full border-2 border-amber-500/30"
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Publicado por</p>
                      <p className="text-lg font-black italic uppercase text-white leading-none">{activeItem.trainerName}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Team Little Performance © 2024</span>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
