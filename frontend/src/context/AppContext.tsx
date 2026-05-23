import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions for our state structures
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  monthlyIncome: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

interface AppContextType {
  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth State
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;

  // Financial Data States (Defaulting to empty arrays!)
  transactions: Transaction[];
  budgets: Budget[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;

  // App-wide loading flag
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- 7 & 8. THEME STATE & PERSISTENCE ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  // --- 5 & 6. AUTHENTICATION & DATA FLOW ---
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- 1, 2, 3, 4 & 11. NO MOCK DATA SYSTEM STATE ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Apply dark mode side effects directly to the root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Simulate an initial boot asset fetch loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // 1.2 seconds of clean skeleton UI presentation
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setTransactions([]); // Wipe all transaction arrays on logout safety reset
    setBudgets([]);      // Wipe active structural limits
    localStorage.removeItem('auth_user');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, login, logout,
      transactions, budgets, setTransactions, setBudgets,
      isLoading, setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be inside an AppProvider context element wrapper');
  return context;
};