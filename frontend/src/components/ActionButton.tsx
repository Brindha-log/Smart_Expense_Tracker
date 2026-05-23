import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, disabled = false, primary = false }) => {
  const baseClasses = "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm text-sm";
  const enabledClasses = primary 
    ? "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900" 
    : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50";
  const disabledClasses = "bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed opacity-70";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
    >
      {label}
    </button>
  );
};
