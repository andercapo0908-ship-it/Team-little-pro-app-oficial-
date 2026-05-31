import React, { useState, useEffect, useCallback, useMemo } from "react";
import { auth, db } from "./lib/firebase";
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc,
  collection, 
  query, 
  where, 
  onSnapshot,
  getDocs
} from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import { Dumbbell } from "lucide-react";
import { UserProfile, UserRole } from "./types";

// Import Components
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { BottomNavigationBar } from "./components/BottomNavigationBar";
import { HomeTab } from "./components/HomeTab";
import { ProfileTab } from "./components/ProfileTab";
import { PortfolioTab } from "./components/PortfolioTab";
import { WorkoutsTab } from "./components/WorkoutsTab";
import { StoreTab } from "./components/StoreTab";
import { FinancialTab } from "./components/FinancialTab";
import { ConsultingTab } from "./components/ConsultingTab";
import { GalleryTab } from "./components/GalleryTab";
import { EducationalTab } from "./components/EducationalTab";
import { LandingPage } from "./components/auth/LandingPage";
import { LoginForm } from "./components/auth/LoginForm";
import { AdminTab } from "./components/AdminTab";
import { AICoachTab } from "./components/AICoachTab";
import { ChatTab } from "./components/ChatTab";

// --- Types & Constants ---
enum OperationType { CREATE = 'create', UPDATE = 'update', DELETE = 'delete', LIST = 'list', GET = 'get', WRITE = 'write' }
interface FirestoreErrorInfo { error: string; operationType: OperationType; path: string | null; authInfo: any; }

// --- Utils ---
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Firestore [${operationType}] Error on ${path}: `, message);
  return message;
}

// --- Error Boundary ---
class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
          <h1 className="text-2xl font-bold text-amber-500 mb-4 uppercase italic">Falha Crítica de Sistema</h1>
          <p className="text-slate-500 mb-6 font-mono text-xs uppercase tracking-widest">{this.state.error?.message || "Erro desconhecido"}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-amber-500 text-black font-black italic rounded-lg flex items-center gap-2 uppercase tracking-tighter shadow-2xl shadow-amber-500/20">
            Reinicializar DNA PRO
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// --- Main App Orchestrator ---
export default function App() {
  const [view, setView] = useState<'landing' | 'login_student' | 'login_trainer' | 'dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Scroll to top upon tab or main view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [activeTab, view]);

  // Initialization
  useEffect(() => {
    let activeUnsub: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (activeUnsub) {
        activeUnsub();
        activeUnsub = null;
      }

      if (fbUser) {
        setUser(fbUser);
        // Fetch profile with onSnapshot for real-time reactivity and better performance
        const profileRef = doc(db, "users", fbUser.uid);
        
        let retryCount = 0;
        const maxRetries = 3;

        const startListening = () => {
          if (activeUnsub) {
            activeUnsub();
          }
          activeUnsub = onSnapshot(profileRef, (snap) => {
            if (snap.exists()) {
              const profileData = snap.data() as UserProfile;
              setProfile(profileData);
              setError(null);
              setView('dashboard');
            } else {
              setError("Perfil não encontrado no sistema. Por favor, verifique se seu cadastro foi concluído.");
            }
            setLoading(false);
          }, (err) => {
            if (err.message.toLowerCase().includes("permission") && retryCount < maxRetries) {
              retryCount++;
              console.warn(`Profile listen permission timing issue, retrying (${retryCount}/${maxRetries}) in ${retryCount * 250}ms...`);
              setTimeout(() => {
                if (auth.currentUser) {
                  startListening();
                }
              }, retryCount * 250);
            } else {
              console.error("Profile listen error:", err);
              setError(`Erro de Permissão: ${err.message}. Verifique seu acesso.`);
              setLoading(false);
            }
          });
        };

        startListening();
      } else {
        localStorage.removeItem('tl_current_session');
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (activeUnsub) {
        activeUnsub();
      }
    };
  }, []); // Only run once on mount

  // Performance Optimization: Memoized Callbacks
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleTabChange = useCallback((id: string) => setActiveTab(id), []);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem('tl_current_session');
    setProfile(null);
    setUser(null);
    setView('landing');
    setActiveTab('home');
  }, []);

  // Auth Handlers
  const handleLogin = useCallback(async (email: string, pass: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = userCred.user;
      
      const docRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const userData = snap.data() as UserProfile;
        localStorage.setItem('tl_current_session', JSON.stringify(userData));
        setProfile(userData);
        setUser(fbUser);
        if (userData.role === 'student') setActiveTab('profile');
        setView('dashboard');
        return true;
      } else {
        // Logged in but no profile - handle profile creation for Warlyson
        if (email.toLowerCase().includes("warlysonpersonal")) {
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            name: "Warlyson Personal",
            email,
            role: "trainer",
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, "users", fbUser.uid), newProfile);
          localStorage.setItem('tl_current_session', JSON.stringify(newProfile));
          setProfile(newProfile);
          setUser(fbUser);
          setView('dashboard');
          return true;
        }
        signOut(auth);
        return false;
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') return false;
      console.error("Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (email: string, pass: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = userCred.user;
      
      let role: UserRole = view === 'login_student' ? 'student' : 'trainer';
      let finalName = name;
      
      if (email.toLowerCase() === 'andercapo0908@gmail.com') {
        role = 'admin';
        finalName = "Anderson Santana";
      } else if (email.toLowerCase().includes("warlysonpersonal")) {
        role = 'trainer';
        finalName = "Warlyson Personal";
      }

      const newProfile: UserProfile = {
        uid: fbUser.uid,
        name: finalName,
        email,
        role,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", fbUser.uid), newProfile);
      
      localStorage.setItem('tl_current_session', JSON.stringify(newProfile));
      setProfile(newProfile);
      setUser(fbUser);
      if (role === 'student') setActiveTab('profile');
      setView('dashboard');
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [view]);

  // View Mapper
  const currentTabContent = useMemo(() => {
    switch(activeTab) {
      case 'home': return <HomeTab profile={profile} onNavigate={handleTabChange} />;
      case 'profile': return <ProfileTab profile={profile} />;
      case 'portfolio': return <PortfolioTab profile={profile} />;
      case 'admin': return <AdminTab currentProfile={profile} />;
      case 'ai_coach': return <AICoachTab profile={profile} />;
      case 'workouts': return <WorkoutsTab profile={profile} />;
      case 'store': return <StoreTab profile={profile} />;
      case 'financial': return <FinancialTab profile={profile} />;
      case 'consulting': return <ConsultingTab profile={profile} />;
      case 'chat': return <ChatTab profile={profile} />;
      case 'gallery': return <GalleryTab profile={profile} />;
      case 'educational': return <EducationalTab profile={profile} />;
      default: return <HomeTab profile={profile} onNavigate={handleTabChange} />;
    }
  }, [activeTab, profile, handleTabChange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-cream-vivid text-center">
        <div className="w-16 h-[1.5px] bg-neutral-900 relative overflow-hidden rounded-full">
           <div 
            className="absolute inset-x-0 top-0 bottom-0 bg-gold animate-fast-shimmer gpu-accelerated" 
           />
        </div>
        <p className="mt-4 text-[9px] uppercase tracking-[0.5em] text-amber-500/40 font-black animate-pulse">Sincronizando DNA PRO</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-cream-vivid text-center">
        <div className="w-20 h-20 rounded-full border-2 border-orange-pure/20 flex items-center justify-center mb-8">
          <Dumbbell className="text-orange-pure animate-bounce" size={40} />
        </div>
        <h2 className="text-orange-pure font-black italic text-3xl uppercase mb-4 tracking-tighter">Erro de Acesso</h2>
        <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.2em] mb-10 max-w-xs leading-relaxed">{error}</p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-5 bg-orange-pure text-black font-black italic uppercase tracking-tighter shadow-[0_10px_30px_rgba(255,102,0,0.3)]"
          >
            Tentar Novamente
          </button>
          <button 
            onClick={handleLogout} 
            className="w-full py-5 bg-transparent text-slate-500 font-black italic uppercase tracking-tighter border border-white/5 hover:border-orange-pure/20 transition-all"
          >
            Sair e Trocar Conta
          </button>
        </div>
        <p className="mt-12 text-[8px] text-slate-700 font-mono uppercase tracking-widest">Team Little Performance v2.0</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-black min-h-screen text-white font-sans selection:bg-amber-500 selection:text-black antialiased">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div key="landing-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingPage onSelectRole={(role) => setView(role === 'student' ? 'login_student' : 'login_trainer', )} />
            </motion.div>
          ) : (view === 'login_student' || view === 'login_trainer') ? (
            <motion.div key="login-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoginForm 
                role={view === 'login_student' ? 'student' : 'trainer'} 
                onBack={() => setView('landing')} 
                onLogin={handleLogin} 
                onRegister={handleRegister} 
              />
            </motion.div>
          ) : view === 'dashboard' && profile ? (
            <motion.div key="db-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 pb-24">
              <TopBar 
                onOpenSidebar={toggleSidebar} 
                onLogout={handleLogout}
                onBack={() => setActiveTab('home')}
                canGoBack={activeTab !== 'home'} 
              />
              <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={closeSidebar} 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
                onLogout={handleLogout}
                role={profile?.role}
              />
              <main className="container mx-auto px-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {currentTabContent}
                  </motion.div>
                </AnimatePresence>

                {/* Silver Elegant Footer */}
                <footer className="mt-16 pb-12 pt-6 border-t border-white/5 text-center flex flex-col items-center justify-center space-y-2">
                  <span className="text-[11px] tracking-[0.2em] font-black uppercase text-neutral-200 font-sans">
                    team little pro app oficial
                  </span>
                  <div className="w-10 h-[10px] flex items-center justify-center">
                    <div className="w-4 h-[1px] bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-white/30 mx-1" />
                    <div className="w-4 h-[1px] bg-white/20" />
                  </div>
                  <span className="text-[9px] tracking-[0.25em] font-bold text-slate-300 uppercase font-mono">
                    DESENVOLVIDO POR ANDERSON DUENDE
                  </span>
                </footer>
              </main>
              <BottomNavigationBar activeTab={activeTab} onTabChange={handleTabChange} role={profile?.role} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
