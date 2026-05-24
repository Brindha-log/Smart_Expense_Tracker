import React from 'react';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register' | string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8 w-full">

      {/* 1. HERO SECTION */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto min-h-screen justify-center">
        {/* Logo/Brand Name */}
        {/* Logo/Brand Name */}
        <div className="w-full flex justify-center mb-8">
          <span className="text-6xl md:text-7xl font-extrabold tracking-tight">
  <span className="text-white">Spend</span><span className="text-blue-500">Wize</span>
</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-700 text-slate-400 text-xs mb-6">
          ✨ Smart Finance Management
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
          Manage Your Finances With Confidence
        </h1>

        <p className="text-base text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
          Track expenses, set budgets, and analyze spending patterns — all in one beautiful dashboard.
        </p>

        <div className="flex flex-row items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate('register')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors duration-200 text-sm cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="bg-transparent border border-slate-600 hover:border-slate-500 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-2.5 transition-colors duration-200 text-sm cursor-pointer"
          >
            Sign In
          </button>
        </div>

        <p className="text-slate-500 text-xs">
          Free to use • No credit card required
        </p>
      </div>

      {/* 2. HOW IT WORKS SECTION */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-slate-400 text-sm">Get started in minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors duration-300 rounded-2xl p-6 flex flex-col items-start">
            <div className="text-blue-500 text-3xl font-bold mb-4">01</div>
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-bold text-white mb-2">Track Expenses</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Add your daily expenses in seconds and stay on top of your spending habits
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors duration-300 rounded-2xl p-6 flex flex-col items-start">
            <div className="text-blue-500 text-3xl font-bold mb-4">02</div>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-white mb-2">Set Budgets</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create smart budgets for different categories and reach your financial goals
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors duration-300 rounded-2xl p-6 flex flex-col items-start">
            <div className="text-blue-500 text-3xl font-bold mb-4">03</div>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-white mb-2">Analyze Patterns</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get insights into your spending with beautiful charts and detailed reports
            </p>
          </div>
        </div>
      </div>

      {/* 3. FEATURES ROW */}
      <div className="w-full max-w-3xl mx-auto mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="border border-slate-700 rounded-full px-3 py-1.5 text-slate-400 text-xs">✓ Expense Tracking</span>
          <span className="border border-slate-700 rounded-full px-3 py-1.5 text-slate-400 text-xs">✓ Budget Management</span>
          <span className="border border-slate-700 rounded-full px-3 py-1.5 text-slate-400 text-xs">✓ Credit Card Tracking</span>
          <span className="border border-slate-700 rounded-full px-3 py-1.5 text-slate-400 text-xs">✓ Analytics & Reports</span>
          <span className="border border-slate-700 rounded-full px-3 py-1.5 text-slate-400 text-xs">✓ OTP Security</span>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="w-full border-t border-slate-800/50 pt-6 mt-auto">
        <p className="text-center text-slate-600 text-xs pb-6">
          © 2025 SpendWize. All rights reserved.
        </p>
      </footer>
    </div>
  );
};