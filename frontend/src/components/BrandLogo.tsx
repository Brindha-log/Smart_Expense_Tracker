import React from 'react';

export const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      {/* Removed the background, gradient, shadow, and borders */}
      <div className="w-30 h-26 flex items-center justify-center">
        <img 
          src="./src/assets/brand.png" 
          alt="Brand Logo" 
          className="w-full h-full object-contain" 
        />
      </div>
      {/* Decorative inner visual node to represent an editable custom asset location */}
      <div className="hidden border border-dashed border-slate-400 px-1 py-0.5 rounded text-[10px] text-slate-300">
        IMG
      </div>
    </div>
  );
};