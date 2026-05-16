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
    <div className="w-full max-w-md text-center flex flex-col items-center px-4">
      
      {/* App Branding Header Section */}
      <header className="mb-8">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
          SpendWize
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium max-w-xs mx-auto">
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