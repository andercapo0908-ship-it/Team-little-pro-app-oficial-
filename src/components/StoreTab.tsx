import React, { useState, useEffect, useCallback } from "react";
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  QrCode, 
  Copy, 
  Check, 
  X, 
  Filter,
  Tag,
  ArrowRight,
  Package,
  Info,
  Clock,
  Shirt,
  Palette,
  Truck,
  Upload,
  Loader2,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Product, CartItem } from "../types";
import { db, storage } from "../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface StoreTabProps {
  profile: UserProfile | null;
}

export const StoreTab = React.memo(({ profile }: StoreTabProps) => {
  const isTrainerOrAdmin = profile?.role === 'trainer' || profile?.role === 'admin';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [copied, setCopied] = useState(false);
  
  // Admin Mode
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    promoPrice: 0,
    imageUrl: "",
    sizes: [],
    colors: [],
    category: "Roupas",
    stock: 10,
    whatsappNumber: "5511999999999",
    pixKey: "seu-pix@exemplo.com"
  });

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id } as Product)));
      setLoading(false);
    }, (err) => {
      console.error("Store sync error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAddToCart = (product: Product, size: string, color: string) => {
    const existing = cart.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }]);
    }
    setSelectedProduct(null);
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart(cart.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
  };

  const updateQuantity = (id: string, size: string, color: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.quantity, 0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setNewProduct(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error(err); e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  const handleOffer = (product: Product) => {
    const text = encodeURIComponent(`Olá! Gostaria de fazer uma oferta no produto ${product.name}. Aceita R$ ...?`);
    window.open(`https://wa.me/${product.whatsappNumber}?text=${text}`, '_blank');
  };

  const saveProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) return;
    try {
      const id = editingProductId || "prod_" + Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, "products", id), {
        ...newProduct,
        id,
        createdAt: newProduct.createdAt || new Date().toISOString()
      }, { merge: true });
      setIsAddingMode(false);
      setEditingProductId(null);
      setNewProduct({ name: "", description: "", price: 0, promoPrice: 0, imageUrl: "", sizes: [], colors: [], category: "Roupas", stock: 10, whatsappNumber: "5511999999999", pixKey: "seu-pix@exemplo.com" });
    } catch (err) { console.error(err); }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(cart[0]?.pixKey || "PIX_KEY");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8 gpu-accelerated lg:liquid-scroll text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">LOJA <span className="text-amber-500">EXCLUSIVA</span></h2>
          <p className="text-amber-500/60 font-mono text-[10px] uppercase tracking-[0.5em] font-black mt-2">Equipamento de Elite Team Little</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm w-48 md:w-64 outline-none focus:border-amber-500"
            />
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-amber-500 hover:text-black transition-all"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
          {isTrainerOrAdmin && (
            <button 
              onClick={() => setIsAddingMode(true)}
              className="bg-amber-500 text-white px-6 py-4 rounded-xl font-black italic uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-amber-500/20 shimmer-btn-effect"
            >
              <Plus size={14} /> Novo Item
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(prod => (
          <motion.div 
            key={prod.id}
            layout
            className="bg-neutral-900/50 border border-white/5 rounded-3xl overflow-hidden group hover:border-amber-500/30 transition-all flex flex-col"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-black">
              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              {prod.promoPrice && (
                <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-black uppercase italic px-3 py-1 rounded-full">Oferta</div>
              )}
              {isTrainerOrAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewProduct(prod);
                      setEditingProductId(prod.id);
                      setIsAddingMode(true);
                    }}
                    className="p-2 bg-neutral-900/80 hover:bg-amber-500 hover:text-black text-white rounded-xl border border-white/10 transition-all shadow-md"
                    title="Editar"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm("Deseja realmente excluir este produto do catálogo?")) {
                        await deleteDoc(doc(db, "products", prod.id));
                      }
                    }}
                    className="p-2 bg-neutral-900/80 hover:bg-red-500 hover:text-white text-red-500 rounded-xl border border-white/10 transition-all shadow-md"
                    title="Excluir"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <button 
                onClick={() => setSelectedProduct(prod)}
                className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
              <div className="p-6 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">{prod.category}</span>
                  {prod.unit && <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500">{prod.unit}</span>}
                </div>
                <h3 className="font-bold text-lg uppercase tracking-tight">{prod.name}</h3>
              <div className="flex items-center gap-3">
                {prod.promoPrice ? (
                  <>
                    <span className="text-xl font-black text-white">R$ {prod.promoPrice.toFixed(2)}</span>
                    <span className="text-xs text-slate-500 line-through">R$ {prod.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-xl font-black text-white">R$ {prod.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductCard 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAdd={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[2000] flex justify-end">
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
             <motion.div initial={{x: "100%"}} animate={{x: 0}} exit={{x: "100%"}} className="w-full max-w-md bg-neutral-900 h-full relative z-10 border-l border-white/10 flex flex-col">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-2xl font-black italic uppercase italic text-white flex items-center gap-2">Seu <span className="text-amber-500">Carrinho</span></h3>
                  <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} className="p-2 hover:bg-white/10 rounded-full text-white"><X size={24}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {checkoutStep === 'cart' ? (
                    cart.length > 0 ? cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-20 h-24 bg-black rounded-2xl overflow-hidden shrink-0">
                           <img src={item.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm uppercase">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                          </div>
                          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">{item.selectedSize} • {item.selectedColor}</p>
                          <div className="flex items-center justify-between mt-2">
                             <div className="flex items-center gap-3 bg-black rounded-lg px-2 py-1">
                               <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)} className="p-1 text-slate-500 hover:text-white"><Minus size={12}/></button>
                               <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)} className="p-1 text-slate-500 hover:text-white"><Plus size={12}/></button>
                             </div>
                             <span className="font-black text-sm text-white">R$ {((item.promoPrice || item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <ShoppingBag size={48} className="text-slate-800" />
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Seu carrinho está vazio</p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-8">
                       <div className="bg-black/50 border border-white/5 rounded-3xl p-8 text-center space-y-6">
                          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                            <QrCode size={40} className="text-amber-500" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xl font-black italic uppercase text-white">Pagamento via PIX</h4>
                            <p className="text-xs text-slate-400">Escaneie o QR Code ou copie a chave abaixo</p>
                          </div>
                          <div className="aspect-square w-48 mx-auto bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cart[0]?.pixKey || "PIX_KEY")}`} className="w-full h-full" />
                          </div>
                          <button 
                            onClick={copyPix}
                            className="w-full bg-white/5 border border-white/10 hover:border-amber-500/50 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                          >
                            {copied ? <Check size={18} className="text-amber-500" /> : <Copy size={18} className="text-slate-400" />}
                            <span className="text-xs font-bold uppercase tracking-widest text-white">{copied ? "Copiado!" : "Copiar Chave PIX"}</span>
                          </button>
                       </div>

                       <div className="space-y-4">
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-4">
                             <MessageCircle size={24} className="text-green-500 shrink-0" />
                             <div className="space-y-1">
                                <p className="text-xs font-bold text-white">Confirme seu pedido!</p>
                                <p className="text-[10px] text-slate-400">Envie o comprovante no WhatsApp do vendedor para agilizar a entrega.</p>
                             </div>
                          </div>
                          <a 
                            href={`https://wa.me/${cart[0]?.whatsappNumber}?text=Olá! Acabei de fazer um pedido no valor de R$ ${total.toFixed(2)}. Segue o comprovante.`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-green-500 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all text-sm"
                          >
                            <MessageCircle size={20} /> Falar com Vendedor
                          </a>
                       </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-white/5 bg-black/40 space-y-4">
                   <div className="flex justify-between items-center text-slate-400 uppercase font-mono text-xs tracking-widest">
                      <span>Total</span>
                      <span className="text-white font-black text-2xl">R$ {total.toFixed(2)}</span>
                   </div>
                   {checkoutStep === 'cart' && cart.length > 0 && (
                     <button 
                      onClick={() => setCheckoutStep('payment')}
                      className="w-full bg-amber-500 text-white py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-amber-500/20 shimmer-btn-effect"
                     >
                       Finalizar Compra <ArrowRight size={20} />
                     </button>
                   )}
                   {checkoutStep === 'payment' && (
                     <button 
                      onClick={() => setCheckoutStep('cart')}
                      className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                     >
                       Voltar ao Carrinho
                     </button>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin: Add Product Modal */}
      <AnimatePresence>
        {isAddingMode && (
          <ProductEditor 
            onClose={() => {
              setIsAddingMode(false);
              setEditingProductId(null);
              setNewProduct({ name: "", description: "", price: 0, promoPrice: 0, imageUrl: "", sizes: [], colors: [], category: "Roupas", stock: 10, whatsappNumber: "5511999999999", pixKey: "seu-pix@exemplo.com" });
            }}
            onSave={saveProduct}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            handleFileUpload={handleFileUpload}
            uploading={uploading}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// --- SUBCOMPONENTS ---

const ProductCard = ({ product, onClose, onAdd }: { product: Product, onClose: () => void, onAdd: (p: Product, s: string, c: string) => void }) => {
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
       <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
       <motion.div 
         initial={{scale: 0.9, opacity: 0}} 
         animate={{scale: 1, opacity: 1}} 
         exit={{scale: 0.9, opacity: 0}} 
         className="w-full max-w-5xl bg-neutral-900 rounded-[3rem] overflow-hidden relative z-10 border border-white/10 shadow-2xl flex flex-col md:flex-row"
       >
          <div className="w-full md:w-1/2 aspect-square relative bg-black">
             <img src={product.imageUrl} className="w-full h-full object-cover" />
             <div className="absolute top-8 left-8 flex gap-2">
                <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/10">{product.category}</span>
                {product.promoPrice && <span className="bg-amber-500 text-black text-[10px] font-black uppercase px-4 py-2 rounded-full italic">Oferta Relâmpago</span>}
             </div>
          </div>
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
             <div className="space-y-6">
                <div className="flex justify-between items-start">
                   <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{product.name}</h2>
                   <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{product.description}"</p>
                
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-white">R$ {(product.promoPrice || product.price).toFixed(2)}</div>
                      {product.promoPrice && <div className="text-lg text-slate-500 line-through">R$ {product.price.toFixed(2)}</div>}
                   </div>
                   <button 
                     onClick={() => {
                        const text = encodeURIComponent(`Olá! Gostaria de fazer uma oferta no produto ${product.name}. Aceita R$ ...?`);
                        window.open(`https://wa.me/${product.whatsappNumber}?text=${text}`, '_blank');
                     }}
                     className="text-[10px] font-black uppercase text-amber-500 tracking-widest hover:text-white transition-colors flex items-center gap-2"
                   >
                     Solicitar Oferta Especial <ArrowRight size={10} />
                   </button>
                </div>

                <div className="space-y-4 py-6 border-y border-white/5">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-2"><Shirt size={12}/> Escolher Tamanho</label>
                     <div className="flex flex-wrap gap-2">
                        {product.sizes.map(s => (
                          <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${size === s ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>{s}</button>
                        ))}
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-2"><Palette size={12}/> Escolher Cor</label>
                     <div className="flex flex-wrap gap-2">
                        {product.colors.map(c => (
                          <button key={c} onClick={() => setColor(c)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${color === c ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>{c}</button>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                      <Truck size={20} className="text-amber-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-white tracking-widest">Entrega Rápida</p>
                        <p className="text-[9px] text-slate-500 uppercase">Em mãos ou Correios</p>
                      </div>
                   </div>
                   <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                      <Package size={20} className="text-amber-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-white tracking-widest">Estoque Restrito</p>
                        <p className="text-[9px] text-slate-500 uppercase">Apenas {product.stock} un.</p>
                      </div>
                   </div>
                </div>
             </div>

             <button 
              onClick={() => onAdd(product, size, color)}
              className="w-full bg-amber-500 text-black py-6 rounded-[2rem] font-black italic uppercase tracking-[0.3em] text-xl mt-8 hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 group"
             >
               Adicionar <Plus size={24} className="group-hover:rotate-90 transition-transform" />
             </button>
          </div>
       </motion.div>
    </div>
  );
};

const ProductEditor = ({ onClose, onSave, newProduct, setNewProduct, handleFileUpload, uploading }: any) => {
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
       <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
       <motion.div 
         initial={{y: 50, opacity: 0}} 
         animate={{y: 0, opacity: 1}} 
         exit={{y: 50, opacity: 0}} 
         className="w-full max-w-2xl bg-neutral-900 rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
       >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Gerenciar <span className="text-amber-500">Produto</span></h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
          </div>

          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Foto do Produto</label>
                  <label className="w-full aspect-[4/5] cursor-pointer group block border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-[2rem] overflow-hidden relative bg-black transition-all">
                    {newProduct.imageUrl ? (
                      <img src={newProduct.imageUrl} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      {uploading ? <Loader2 size={32} className="animate-spin text-amber-500" /> : <Upload size={32} className="text-slate-500" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Upload Foto</span>
                    </div>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Nome</label>
                    <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Preço (R$)</label>
                        <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Preço Promo</label>
                        <input type="number" value={newProduct.promoPrice} onChange={e => setNewProduct({...newProduct, promoPrice: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono" placeholder="Opcional" />
                     </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Estoque</label>
                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Unidade (Parcela, Par, Kit...)</label>
                    <input type="text" value={newProduct.unit || ""} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 font-mono" placeholder="Ex: Par" />
                  </div>
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Descrição Curta</label>
                <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 text-sm" placeholder="Ex: Tecido dry-fit premium com logo bordada..." />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Tamanhos (P, M, G...)</label>
                  <div className="flex gap-2 mb-2">
                     <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl py-2 px-4 text-xs" />
                     <button onClick={() => { if(sizeInput){ setNewProduct({...newProduct, sizes: [...(newProduct.sizes || []), sizeInput]}); setSizeInput(""); } }} className="bg-white/5 p-2 rounded-xl border border-white/10"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {newProduct.sizes?.map((s: string) => (
                       <span key={s} className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-2 uppercase">
                         {s} <button onClick={() => setNewProduct({...newProduct, sizes: newProduct.sizes.filter((sz: any) => sz !== s)})}><X size={10}/></button>
                       </span>
                     ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Cores</label>
                  <div className="flex gap-2 mb-2">
                     <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl py-2 px-4 text-xs" />
                     <button onClick={() => { if(colorInput){ setNewProduct({...newProduct, colors: [...(newProduct.colors || []), colorInput]}); setColorInput(""); } }} className="bg-white/5 p-2 rounded-xl border border-white/10"><Plus size={16}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {newProduct.colors?.map((c: string) => (
                       <span key={c} className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-2 uppercase">
                         {c} <button onClick={() => setNewProduct({...newProduct, colors: newProduct.colors.filter((cl: any) => cl !== c)})}><X size={10}/></button>
                       </span>
                     ))}
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">WhatsApp de Contato</label>
                   <input type="text" value={newProduct.whatsappNumber || ""} onChange={e => setNewProduct({...newProduct, whatsappNumber: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-green-500/50 font-mono text-xs" placeholder="5511..." />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">Chave PIX Recebimento</label>
                   <input type="text" value={newProduct.pixKey || ""} onChange={e => setNewProduct({...newProduct, pixKey: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500/50 font-mono text-xs" />
                </div>
             </div>

             <button 
              onClick={onSave}
              disabled={uploading}
              className="w-full bg-amber-500 text-black py-6 rounded-[2rem] font-black italic uppercase tracking-[0.3em] text-xl mt-6 hover:bg-white transition-all shadow-2xl disabled:opacity-50"
             >
               {uploading ? "Aguarde Upload..." : "Publicar Produto"}
             </button>
          </div>
       </motion.div>
    </div>
  );
};

StoreTab.displayName = 'StoreTab';
