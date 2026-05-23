import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PredictionCardProps {
    title: string;
    value: string;
    subtitle: string;
    isPositive?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ title, value, subtitle, isPositive }) => {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            {/* Background glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">{title}</span>
                </div>
                <div className="text-3xl font-bold mb-1">{value}</div>
                <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <ArrowRight className="w-3 h-3" />
                    {subtitle}
                </div>
            </div>
        </div>
    );
};
