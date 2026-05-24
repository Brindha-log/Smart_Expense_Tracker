import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { profileService } from './services/profileService';

// Component Imports
import { Navbar } from './components/Navbar';
import type { ViewType } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginForm } from './components/LoginForm';
import { RegistrationForm } from './components/RegistrationForm';
import { Home } from './pages/HomePage';
import { Expenses } from './pages/Expenses';
import { Budgets } from './pages/Budgets';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import CreditCardDashboard from '../src/pages/CreditCardDashboard';

type AppView = ViewType | 'landing' | 'login' | 'register';

const App: React.FC = () => {
  const { login, logout, user } = useApp();
  const [isInitializing, setIsInitializing] = useState(true);
  const [analyticsKey, setAnalyticsKey] = useState(0);

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedView = localStorage.getItem('currentAppView') as AppView | null;
    const hasToken = !!localStorage.getItem('jwt_token');
    
    if (hasToken) {
      const isProtectedView = savedView && savedView !== 'landing' && savedView !== 'login' && savedView !== 'register';
      return isProtectedView ? savedView : 'home';
    } else {
      const isPublicView = savedView === 'landing' || savedView === 'login' || savedView === 'register';
      return isPublicView ? savedView : 'landing';
    }
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const profile = await profileService.getMyProfile();
          login(profile);
          if (currentView === 'landing' || currentView === 'login' || currentView === 'register') {
            setCurrentView('home');
          }
        } catch (error) {
          // Token is invalid or expired
          logout();
          localStorage.removeItem('jwt_token');
          setCurrentView('landing');
        }
      } else {
        if (currentView !== 'landing' && currentView !== 'login' && currentView !== 'register') {
           setCurrentView('landing');
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('currentAppView', currentView);
  }, [currentView]);

  const handleLogout = (): void => {
    logout(); // Properly reset global context (user, transactions, budgets)
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('registeredUser');
    localStorage.removeItem('currentAppView');
    setCurrentView('landing');
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={(view) => setCurrentView(view)} />;
      case 'login':
        return <LoginForm onLoginSuccess={() => setCurrentView('home')} />;
      case 'register':
        return <RegistrationForm />;
      case 'home':
        return <Home />;
      case 'expenses':
        return <Expenses />;
      case 'budgets':
        return <Budgets />;
      case 'dashboard':
        return <Dashboard />;
     case 'analytics':
    return <Analytics key={analyticsKey} />;
      case 'credit-card':
        return <CreditCardDashboard />;
      case 'profile':
        return <Profile />;
      default:
        return <LandingPage onNavigate={(view) => setCurrentView(view)} />;
    }
  };

  const isUserAuthenticated = currentView !== 'landing' && currentView !== 'login' && currentView !== 'register';

  if (isInitializing) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Loading Smart Expense Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans flex flex-col antialiased transition-colors duration-200">
      
      {/* 1. DYNAMIC NAVIGATION HEADERS */}
      {isUserAuthenticated ? (
        <Navbar 
    currentView={currentView as ViewType} 
    setView={(view) => {
        if (view === 'analytics') setAnalyticsKey(k => k + 1);
        setCurrentView(view);
    }} 
    onLogout={handleLogout} 
/>
      ) : (
        currentView !== 'landing' && (
          <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-200">
            <button 
              onClick={() => setCurrentView('landing')}
              className="font-bold text-slate-900 dark:text-white text-lg tracking-tight bg-transparent border-none cursor-pointer"
            >
              SpendWize
            </button>
            <button 
              onClick={() => setCurrentView('landing')}
              className="text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </nav>
        )
      )}

      {/* 2. MAIN CONTENT LAYOUT AREA */}
      <main 
        className={`flex-1 w-full box-border flex justify-center 
          ${isUserAuthenticated 
            ? 'max-w-7xl mx-auto pt-20 pb-12 items-start justify-stretch px-4 sm:px-6 lg:px-8' 
            : 'items-start pt-24 pb-8 px-4 overflow-y-auto min-h-screen'
          }`}
      >
        <div className={isUserAuthenticated ? 'w-full' : 'w-full max-w-md flex flex-col gap-4'}>
          {renderViewContent()}

          {/* Inline switcher footer text layout */}
          {!isUserAuthenticated && currentView !== 'landing' && (
            <div className="text-center mt-1">
              {currentView === 'login' ? (
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                 <button
    onClick={() => setCurrentView('register')}
    className="text-blue-400 font-semibold underline bg-transparent border-none p-0 cursor-pointer text-sm"
>
    Sign Up
</button>
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                 <button
    onClick={() => setCurrentView('login')}
    className="text-blue-400 font-semibold underline bg-transparent border-none p-0 cursor-pointer text-sm"
>
    Sign In
</button>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;