import React, { useState } from 'react';

// Explicit type definition for matching views across pages
export type ViewType = 'home' | 'expenses' | 'dashboard' | 'analytics' | 'profile';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Array of navigation items for clean mapping
  const navItems: { id: ViewType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-200 fixed top-0 left-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Left Side: Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <span className="font-bold text-slate-900 text-lg tracking-tight">SpendWize</span>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`text-sm font-semibold transition-colors pb-1 cursor-pointer border-b-2 outline-none ${
                    isActive 
                      ? 'text-slate-900 border-slate-900' 
                      : 'text-slate-400 border-transparent hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Desktop Logout Button */}
        <div className="hidden md:block">
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-900 font-bold text-sm cursor-pointer"
        >
          {isMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Mobile Dropdown Menu Container */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 mt-4 pt-2 flex flex-col gap-3 pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMenuOpen(false);
              }}
              className={`text-left text-sm font-semibold py-2 px-2 rounded-md ${
                currentView === item.id ? 'bg-slate-50 text-slate-900' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-100 pt-3 mt-1">
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left text-sm font-semibold text-rose-600 py-2 px-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};