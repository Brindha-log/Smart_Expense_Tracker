import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary'; // Allows for easy visual style switching
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  // Styles for the Navy Blue button
  const primaryStyles = 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm';
  
  // Styles for the White/Outline variant button
  const secondaryStyles = 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-900';

  return (
    <button
      onClick={onClick}
      className={`w-full sm:w-32 px-5 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer text-center outline-none ${
        variant === 'primary' ? primaryStyles : secondaryStyles
      }`}
    >
      {label}
    </button>
  );
};