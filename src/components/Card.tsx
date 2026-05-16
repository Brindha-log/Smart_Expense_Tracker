import React from 'react';

interface CardProps {
  title: string;
  amount?: string; 
  children?: React.ReactNode; 
  isPrimary?: boolean; 
}

export const Card: React.FC<CardProps> = ({ title, amount, children, isPrimary = false }) => {
  
  const cardStyles = isPrimary
    ? 'bg-slate-900 text-white shadow-xl border border-slate-900'
    : 'bg-white text-slate-900 shadow-md border border-slate-100';

  const titleStyles = isPrimary ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className={`p-6 rounded-xl transition-all ${cardStyles}`}>
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${titleStyles}`}>
        {title}
      </h3>
      {amount && <p className="text-2xl font-bold tracking-tight">{amount}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};