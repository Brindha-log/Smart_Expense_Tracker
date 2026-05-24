import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { profileService } from './services/profileService';

// Component Imports
import { Navbar } from './components/Navbar';
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
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const { login, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);
  const [analyticsKey, setAnalyticsKey] = useState(0);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const profile = await profileService.getMyProfile();
          login(profile);
          const publicPaths = ['/', '/login', '/register'];
          if (publicPaths.includes(location.pathname)) {
            navigate('/home');
          }
        } catch (error) {
          logout();
          localStorage.removeItem('jwt_token');
          navigate('/');
        }
      } else {
        const protectedPaths = ['/home', '/expenses', '/dashboard', '/budgets', '/analytics', '/profile', '/credit-card'];
        if (protectedPaths.includes(location.pathname)) {
          navigate('/login');
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const handleLogout = (): void => {
    logout();
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('registeredUser');
    localStorage.removeItem('currentAppView');
    navigate('/');
  };

  const publicPaths = ['/', '/login', '/register'];
  const isUserAuthenticated = !publicPaths.includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  if (isInitializing) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading SpendWize...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-white font-sans flex flex-col antialiased transition-colors duration-200">

      {/* NAVIGATION */}
      {isUserAuthenticated ? (
        <Navbar
          currentView={location.pathname.replace('/', '') as any}
          setView={(view) => {
            if (view === 'analytics') setAnalyticsKey(k => k + 1);
            navigate('/' + view);
          }}
          onLogout={handleLogout}
        />
      ) : (
        !isLandingPage && (
          <nav className="w-full bg-slate-900 border-b border-slate-800 fixed top-0 left-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-200">
            <button
              onClick={() => navigate('/')}
              className="font-bold text-white text-lg tracking-tight bg-transparent border-none cursor-pointer"
            >
              SpendWize
            </button>
            <button
              onClick={() => navigate(-1 as any)}
              className="text-xs font-semibold text-white border border-slate-700 hover:bg-slate-800 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </nav>
        )
      )}

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 w-full box-border flex justify-center
          ${isUserAuthenticated
            ? 'max-w-7xl mx-auto pt-20 pb-12 items-start justify-stretch px-4 sm:px-6 lg:px-8'
            : isLandingPage
              ? 'p-0 items-start overflow-y-auto min-h-screen'
              : 'items-start pt-24 pb-8 px-4 overflow-y-auto min-h-screen'
          }`}
      >
        <div className={isUserAuthenticated ? 'w-full' : isLandingPage ? 'w-full' : 'w-full max-w-md flex flex-col gap-4'}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage onNavigate={(view) => navigate('/' + view)} />} />
            <Route path="/login" element={<LoginForm onLoginSuccess={() => navigate('/home')} />} />
            <Route path="/register" element={<RegistrationForm />} />

            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics key={analyticsKey} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/credit-card" element={<ProtectedRoute><CreditCardDashboard /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Login/Register switcher */}
          {(location.pathname === '/login' || location.pathname === '/register') && (
            <div className="text-center mt-1">
              {location.pathname === '/login' ? (
                <p className="text-sm text-slate-300">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-blue-400 font-semibold underline bg-transparent border-none p-0 cursor-pointer text-sm"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-300">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;