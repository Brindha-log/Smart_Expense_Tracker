import React from 'react';
import { Button } from '../components/Button';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {


  const handleLoginClick = () => {
    console.log('Login button clicked');
    onNavigate('login');
  };

  const handleSignUpClick = () => {
    console.log('Sign Up button clicked');
    onNavigate('register');
  };

  return (
    <div className="w-full max-w-lg text-center flex flex-col items-center px-8 py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/60 dark:border-slate-800 transition-all duration-300">
      
      {/* App Branding Header Section */}
      <header className="mb-10">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
          SpendWize
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
          The smart, minimal way to track your expenses and optimize your budget.
        </p>
      </header>

      {/* Interactive Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <Button
          label="Login"
          onClick={handleLoginClick}
          variant="secondary"
        />
        <Button
          label="Sign Up"
          onClick={handleSignUpClick}
          variant="primary"
        />

      </div>

    </div>
  );
};