import React from 'react';

// Maintained your exact original interface props to ensure 100% backward compatibility,
// while extending it with native HTML button features for the upgraded layouts.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string; // Kept optional so you can use both label props or standard custom children
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger'; // Extended with 'danger' for specific dashboard actions
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  children,
  className = '', 
  ...props 
}) => {
  // Base structural classes matching your premium SaaS layout requirements
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Upgraded fintech color palettes while maintaining your Navy Blue vs White logic
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 focus:ring-rose-200"
  };

  // Fluid size tokens to prevent buttons from blowing out to full width unless explicitly styled
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {/* Renders your original 'label' string if passed, otherwise renders standard React children (like icons) */}
      {label ? <span>{label}</span> : children}
    </button>
  );
};