/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, 
  Wrench, 
  Cpu, 
  ChevronDown,
  User, 
  Menu, 
  X, 
  Bell, 
  HelpCircle,
  Sliders,
  Laptop,
  Smartphone,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginView } from './components/login/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { TodosEquipamentosView } from './components/equipamentos/TodosEquipamentosView';
import { ComponentesView } from './components/equipamentos/ComponentesView';
import { supabase } from './lib/supabaseClient';

// Type definitions for views
type ActiveView = 'dashboard' | 'todos' | 'componentes';

interface UserProfile {
  name: string;
  surname: string;
  role: string;
  avatarUrl?: string;
}

export default function App() {
  // Navigation & view states
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [equipamentosOpen, setEquipamentosOpen] = useState<boolean>(false);
  
  // Responsive sidebar state for mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        supabase.from('profiles').select('name, surname, role').eq('id', session.user.id).single().then(({ data, error }) => {
          if (error) console.error('Error fetching profile:', error);
          else if (data) setUser(data as UserProfile);
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        supabase.from('profiles').select('name, surname, role').eq('id', session.user.id).single().then(({ data, error }) => {
          if (error) console.error('Error fetching profile:', error);
          else if (data) setUser(data as UserProfile);
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogoutConfirmOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Helper for human-readable titles
  const getSectionTitle = (view: ActiveView): string => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'todos':
        return 'Equipamentos > Todos';
      case 'componentes':
        return 'Equipamentos > Componentes';
      default:
        return 'Dashboard';
    }
  };

  // Handle sidebar navigation clicks
  const handleViewChange = (view: ActiveView, componentId: string | null = null) => {
    setCurrentView(view);
    setSelectedComponentId(componentId);
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {!isLoggedIn ? (
        <LoginView onLogin={() => {}} />
      ) : (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-sky-500 selection:text-white">
          {/* BACKGROUND DECORATIONS (Subtle blue ambient orbs) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl pointer-events-none" />

          {/* FIXED HEADER (divided into 2 columns) */}
          <header id="main-header" className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/80 backdrop-blur-md border-b border-sky-100 z-30 flex items-center px-4 md:px-8 transition-all duration-300">
            <div className="w-full grid grid-cols-2 items-center">
              
              {/* Column 1: Left - Menu Toggle (Mobile) + Section Title */}
              <div className="flex items-center gap-3">
                <button 
                  id="mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-sky-50 text-sky-900 transition-colors focus:outline-none"
                  aria-label="Abrir menu"
                >
                  <Menu size={20} />
                </button>
                
                {/* Page Title */}
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-block w-1.5 h-6 bg-sky-600 rounded-full" />
                  <h1 className="font-sans font-bold text-lg md:text-xl text-slate-800 tracking-tight transition-all">
                    {getSectionTitle(currentView)}
                  </h1>
                </div>
              </div>
          {/* Column 2: Right - User info and settings icon */}
          <div className="flex items-center justify-end gap-3 md:gap-6">
            
            {/* User Profile Badge */}
            <div className="relative flex items-center gap-2.5 border-l border-slate-100 pl-3 md:pl-6">
              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-inter font-bold text-sm shadow-md shadow-sky-600/10 hover:bg-sky-700 transition-colors">
                <User size={16} />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <button 
                  className="flex items-center gap-1 font-inter font-semibold text-sm text-slate-800 leading-none"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {user?.name} {user?.surname}
                  <ChevronDown size={14} className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <span className="font-inter text-[10px] text-slate-400 font-medium">
                  {user?.role}
                </span>
              </div>
              
              {/* Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-slate-200 shadow-lg rounded-none py-1 z-50">
                    <button 
                      onClick={() => { setIsLogoutConfirmOpen(true); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Sair
                    </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* SIDEBARS & CONTENT AREA CONTAINER */}
      <div className="flex-1 flex pt-16 pb-8 relative">
        
        {/* DESKTOP SIDEBAR (Fixed Left, always visible on MD+ screens) */}
        <aside 
          id="desktop-sidebar" 
          className="hidden md:flex md:w-64 bg-slate-900 text-slate-300 flex-col fixed inset-y-0 left-0 z-50 border-r border-slate-800 shadow-xl"
        >
          {/* Sidebar Header & Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-white">
            <img src="https://i.postimg.cc/NfvHTQTR/avexas-logo-transp-copy.png" alt="Avexas Logo" className="h-10 w-auto" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-4 space-y-1">
            
            {/* Dashboard Navigation */}
            <button
              id="nav-dashboard-desktop"
              onClick={() => handleViewChange('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none text-sm font-sans font-medium transition-all duration-150 group ${
                currentView === 'dashboard' 
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/10' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className={currentView === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Equipamentos Navigation Block */}
            <div className="space-y-1 pt-2">
              <div 
                id="nav-equipamentos-group"
                className={`flex items-center rounded-none text-sm font-sans font-medium transition-all duration-150 ${
                  currentView === 'todos' || currentView === 'componentes'
                    ? 'bg-sky-600/15 border border-sky-500/30 text-sky-300'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                {/* Clicking directly on "Equipamentos" only toggles the submenu */}
                <button
                  id="nav-equipamentos-text-desktop"
                  onClick={() => setEquipamentosOpen(!equipamentosOpen)}
                  className="flex-1 flex items-center gap-3 px-3 py-2.5 text-left transition-colors focus:outline-none"
                >
                  <Wrench size={18} className={currentView === 'todos' || currentView === 'componentes' ? 'text-sky-300' : 'text-slate-400'} />
                  <span>Equipamentos</span>
                </button>

                {/* Clicking ONLY on the arrow toggles the dropdown submenu */}
                <button
                  id="nav-equipamentos-arrow-desktop"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEquipamentosOpen(!equipamentosOpen);
                  }}
                  className={`p-2.5 hover:bg-slate-800/80 rounded-none transition-transform duration-200 ${
                    equipamentosOpen ? 'rotate-180 text-sky-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Expandir subsetores"
                  aria-label="Toggle submenu"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Sub-menu hierarchical representation */}
              <AnimatePresence initial={false}>
                {equipamentosOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-7 pr-1 space-y-1 border-l border-slate-800 ml-5"
                  >
                    <button
                      id="nav-todos-desktop"
                      onClick={() => handleViewChange('todos')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-inter transition-all duration-150 ${
                        currentView === 'todos'
                          ? 'bg-sky-950 text-sky-300 font-bold border-l-2 border-sky-400 pl-2'
                          : 'hover:bg-slate-800/40 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers size={14} className={currentView === 'todos' ? 'text-sky-400' : 'text-slate-500'} />
                        <span>Todos</span>
                      </div>
                      <ArrowRight size={10} className={`text-sky-400 transition-transform ${currentView === 'todos' ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'}`} />
                    </button>
                    <button
                      id="nav-componentes-desktop"
                      onClick={() => handleViewChange('componentes')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-inter transition-all duration-150 ${
                        currentView === 'componentes'
                          ? 'bg-sky-950 text-sky-300 font-bold border-l-2 border-sky-400 pl-2'
                          : 'hover:bg-slate-800/40 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Cpu size={14} className={currentView === 'componentes' ? 'text-sky-400' : 'text-slate-500'} />
                        <span>Componentes</span>
                      </div>
                      <ArrowRight size={10} className={`text-sky-400 transition-transform ${currentView === 'componentes' ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'}`} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>

        </aside>

        {/* MOBILE SIDEBAR / DRAWER MENU (Triggered by menu button) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950 z-50 md:hidden"
              />

              {/* Sidebar Menu Drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 flex flex-col z-55 md:hidden shadow-2xl"
              >
                {/* Mobile Drawer Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                      <Layers className="text-slate-950" size={18} />
                    </div>
                    <span className="font-sans font-black text-lg tracking-wider text-white">
                      Avexas
                    </span>
                  </div>
                  <button 
                    id="close-mobile-menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    aria-label="Fechar menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation content */}
                <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
                  
                  {/* Dashboard link */}
                  <button
                    id="nav-dashboard-mobile"
                    onClick={() => handleViewChange('dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-sans font-medium transition-all ${
                      currentView === 'dashboard' 
                        ? 'bg-sky-600 text-white font-bold' 
                        : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </div>
                  </button>

                  {/* Equipamentos block */}
                  <div className="space-y-1 pt-2">
                    <div 
                      id="nav-equipamentos-group-mobile"
                      className={`flex items-center rounded-lg text-sm font-sans font-medium transition-all ${
                        currentView === 'todos' || currentView === 'componentes'
                          ? 'bg-sky-600/15 border border-sky-500/30 text-sky-300'
                          : 'text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <button
                        id="nav-equipamentos-text-mobile"
                        onClick={() => setEquipamentosOpen(!equipamentosOpen)}
                        className="flex-1 flex items-center gap-3 px-3 py-3 text-left focus:outline-none"
                      >
                        <Wrench size={18} />
                        <span>Equipamentos</span>
                      </button>
                      <button
                        id="nav-equipamentos-arrow-mobile"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEquipamentosOpen(!equipamentosOpen);
                        }}
                        className={`p-3 hover:bg-slate-800/80 rounded-r-lg transition-transform duration-200 ${
                          equipamentosOpen ? 'rotate-180 text-sky-400' : 'text-slate-500'
                        }`}
                        aria-label="Toggle submenu"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Submenu for Components */}
                    <AnimatePresence initial={false}>
                      {equipamentosOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden pl-7 pr-1 space-y-1 border-l border-slate-800 ml-5"
                        >
                          <button
                            id="nav-todos-mobile"
                            onClick={() => handleViewChange('todos')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-inter transition-all ${
                              currentView === 'todos'
                                ? 'bg-sky-950 text-sky-300 font-bold border-l-2 border-sky-400 pl-2'
                                : 'hover:bg-slate-800/40 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Layers size={14} />
                            <span>Todos</span>
                          </button>
                          <button
                            id="nav-componentes-mobile"
                            onClick={() => handleViewChange('componentes')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-inter transition-all ${
                              currentView === 'componentes'
                                ? 'bg-sky-950 text-sky-300 font-bold border-l-2 border-sky-400 pl-2'
                                : 'hover:bg-slate-800/40 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Cpu size={14} />
                            <span>Componentes</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </nav>

                {/* Mobile sidebar footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-slate-500 text-xs font-inter flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                    <Laptop size={12} className="text-sky-500" />
                  </div>
                  <p className="opacity-70">Avexas Web v1.2.0-Alpha</p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* SETTINGS SIDEBAR DRAWER (Right-side control panel) */}
        {/* SETTINGS SIDEBAR DRAWER REMOVED */}

        {/* MAIN CENTRAL VIEW AREA (Scrollable and positioned nicely next to sidebar) */}
        <main 
          id="main-viewport" 
          className="flex-1 flex flex-col md:pl-64 min-h-0 w-full transition-all duration-300"
        >
          <div className="flex-1 w-full p-2 md:p-4">
            
            {/* VIEW CONTENT TRANSITION FRAMEWORK */}
            <div className="flex-1 flex flex-col">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="w-full h-full flex flex-col overflow-hidden relative"
                >
                  

                  {/* Breadcrumb - Subtle and active */}
                  {currentView !== 'dashboard' && (
                    <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 text-[10px] font-inter text-slate-400">
                      <button onClick={() => handleViewChange('dashboard')} className="hover:text-sky-600 cursor-pointer transition-colors">Avexas</button>
                      <span>/</span>
                      <button onClick={() => handleViewChange('todos')} className="hover:text-sky-600 cursor-pointer transition-colors">Equipamentos</button>
                      <span>/</span>
                      <button 
                        onClick={() => handleViewChange(currentView === 'todos' ? 'todos' : 'componentes')} 
                        className="font-semibold text-slate-600 hover:text-sky-600 cursor-pointer transition-colors"
                      >
                        {currentView === 'todos' ? 'Todos' : 'Componentes'}
                      </button>
                    </div>
                  )}

                  {currentView === 'dashboard' && <DashboardView />}
                  {currentView === 'todos' && <TodosEquipamentosView onNavigateToComponent={(id) => handleViewChange('componentes', id)} />}
                  {currentView === 'componentes' && <ComponentesView selectedComponentId={selectedComponentId} />}


                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </main>

        {/* LOGOUT CONFIRMATION MODAL */}
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white p-6 shadow-2xl w-full max-w-sm text-center">
              <p className="text-slate-800 font-medium mb-6">Tem certeza que pretende encerrar a sessão?</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setIsLogoutConfirmOpen(false)} className="px-6 py-2 text-sm bg-sky-600 text-white hover:bg-sky-700 rounded-none">Não</button>
                <button onClick={handleLogout} className="px-6 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-none">Sim</button>
              </div>
            </div>
          </div>
        )}

      </div>

      <footer 
        id="main-footer" 
        className="fixed bottom-0 right-0 left-0 md:left-64 h-8 bg-slate-50/50 backdrop-blur-sm border-t border-slate-100/60 z-30 flex items-center justify-center px-4 md:px-8 transition-all duration-300"
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 text-[10px] font-inter text-slate-400">
          
          {/* Logo / app name in the left */}
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="font-sans font-bold text-sky-900 tracking-wider">Avexas</span>
          </div>

          {/* Copyright and developer on the right */}
          <div className="flex items-center gap-1 opacity-80">
            <span className="text-[9px] text-slate-400 opacity-60">© 2026 | Todos os direitos reservados</span>
          </div>

        </div>
      </footer>

        </div>
      )}
    </>
  );
}
