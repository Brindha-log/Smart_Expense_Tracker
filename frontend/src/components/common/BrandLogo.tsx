import React from 'react';
import logo from '../../assets/logo.png'; // Assuming logo exists or will be added here

export const BrandLogo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <img src={logo} alt="Brand Logo" className="h-8 w-auto object-contain" />
        </div>
    );
};
