import React from 'react';

interface CardProps {
  title: string;
  amount?: string; 
  children?: React.ReactNode; 
  isPrimary?: boolean; 
  // Added new optional props to support custom action menus and structural layout additions
  extra?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  amount, 
  children, 
  isPrimary = false,
  extra,
  className = ''
}) => {
  
  // Upgraded styling configurations while fully respecting your original design system states
  const cardStyles = isPrimary
    ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl border border-slate-900'
    : 'bg-white text-slate-900 shadow-sm border border-slate-100 hover:shadow-md duration-300';

  const titleStyles = isPrimary ? 'text-indigo-200/80' : 'text-slate-500';

  return (
    <div className={`p-6 rounded-2xl transition-all ${cardStyles} ${className}`}>
      {/* Header section that accommodates your original title while enabling contextual tools on the right */}
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${titleStyles}`}>
          {title}
        </h3>
        {extra && <div className="flex items-center space-x-1">{extra}</div>}
      </div>
      
      {amount && <p className="text-2xl font-bold tracking-tight">{amount}</p>}
      
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};