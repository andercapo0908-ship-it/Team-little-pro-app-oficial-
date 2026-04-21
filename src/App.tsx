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
import { LandingPage } from "./components/auth/LandingPage";
import { LoginForm } from "./components/auth/LoginForm";
import { AdminTab } from "./components/AdminTab";

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
          <h1 className="text-2xl font-bold text-red-500 mb-4 uppercase italic">Falha Crítica de Sistema</h1>
          <p className="text-slate-500 mb-6 font-mono text-xs uppercase tracking-widest">{this.state.error?.message || "Erro desconhecido"}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-amber-500 text-black font-black italic rounded-none flex items-center gap-2 uppercase tracking-tighter shadow-2xl">
            Reinicializar DNA
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Initialization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        // Fetch profile
        const profileDoc = await getDocs(query(collection(db, "users"), where("uid", "==", fbUser.uid)));
        if (!profileDoc.empty) {
          const profileData = profileDoc.docs[0].data() as UserProfile;
          setProfile(profileData);
          if (profileData.role === 'student' && activeTab === 'home') setActiveTab('profile');
          setView('dashboard');
        }
        setLoading(false);
      } else {
        const savedUser = localStorage.getItem('tl_current_session');
        if (savedUser) {
           const userObj = JSON.parse(savedUser);
           // We'll try to reach out to DB if possible, but landing is safer if no auth
           setLoading(false);
        } else {
           setTimeout(() => setLoading(false), 800);
        }
      }
    });

    return () => unsubscribe();
  }, [activeTab]);

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
      
      const q = query(collection(db, "users"), where("uid", "==", fbUser.uid));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const userData = snap.docs[0].data() as UserProfile;
        localStorage.setItem('tl_current_session', JSON.stringify(userData));
        setProfile(userData);
        setUser(fbUser);
        if (userData.role === 'student') setActiveTab('profile');
        setView('dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') return false;
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
      if (email.toLowerCase() === 'andercapo0908@gmail.com') {
        role = 'admin';
      }

      const newProfile: UserProfile = {
        uid: fbUser.uid,
        name,
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
      case 'workouts': return <WorkoutsTab profile={profile} />;
      case 'store': return <StoreTab profile={profile} />;
      case 'financial': return <FinancialTab profile={profile} />;
      case 'consulting': return <ConsultingTab profile={profile} />;
      case 'gallery': return <GalleryTab profile={profile} />;
      default: return <HomeTab profile={profile} onNavigate={handleTabChange} />;
    }
  }, [activeTab, profile, handleTabChange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-[1px] bg-neutral-800 relative overflow-hidden">
           <motion.div 
            animate={{ x: [-100, 100] }} 
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-amber-500 w-16" 
           />
        </div>
        <p className="mt-4 text-[9px] uppercase tracking-[0.5em] text-amber-500/40 font-black animate-pulse">Sincronizando DNA</p>
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
              <main className="container mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentTabContent}
                  </motion.div>
                </AnimatePresence>
              </main>
              <BottomNavigationBar activeTab={activeTab} onTabChange={handleTabChange} role={profile?.role} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
