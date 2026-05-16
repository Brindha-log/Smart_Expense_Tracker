import React, { useState } from 'react';

// Component Imports
import { Navbar } from './components/Navbar';
import type { ViewType } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginForm } from './components/LoginForm';
import { RegistrationForm } from './components/RegistrationForm';
import { Home } from './pages/HomePage';
import { Expenses } from './pages/Expenses';
import { Dashboard } from './pages/Dashboard';

type AppView = ViewType | 'landing' | 'login' | 'register';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const handleLogout = (): void => {
    localStorage.removeItem('registeredUser');
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
      case 'dashboard':
        return <Dashboard />;
      default:
        return <LandingPage onNavigate={(view) => setCurrentView(view)} />;
    }
  };

  // FIXED: Simplified check. If we are NOT in landing, login, or register, the user MUST be authenticated.
  const isUserAuthenticated = currentView !== 'landing' && currentView !== 'login' && currentView !== 'register';

  return (
    <div className="min-h-screen w-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* 1. DYNAMIC NAVIGATION HEADERS */}
      {isUserAuthenticated ? (
        <Navbar 
          currentView={currentView as ViewType} 
          setView={(view) => setCurrentView(view)} 
          onLogout={handleLogout} 
        />
      ) : (
        /* Back banner option for standalone login/signup cards */
        currentView !== 'landing' && (
          <nav className="w-full bg-white border-b border-slate-200 fixed top-0 left-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
            <button 
              onClick={() => setCurrentView('landing')}
              className="font-bold text-slate-900 text-lg tracking-tight bg-transparent border-none cursor-pointer"
            >
              SpendWize
            </button>
            <button 
              onClick={() => setCurrentView('landing')}
              className="text-xs font-semibold text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </nav>
        )
      )}

      {/* 2. MAIN CONTENT LAYOUT AREA */}
      <main 
        className={`flex-1 w-full box-border p-4 flex justify-center 
          ${isUserAuthenticated 
            ? 'max-w-4xl mx-auto pt-24 pb-12 items-start justify-stretch' 
            : 'items-center'
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
                    className="text-slate-900 font-semibold underline bg-transparent border-none p-0 cursor-pointer text-sm"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-slate-900 font-semibold underline bg-transparent border-none p-0 cursor-pointer text-sm"
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