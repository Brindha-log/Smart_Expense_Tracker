import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendData } from '../../types';

interface ExpenseBarChartProps {
    data: TrendData[];
    isDarkMode: boolean;
}

export const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({ data, isDarkMode }) => {
    if (!data || data.length === 0) return null;

    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip 
                        formatter={(value: number) => [`₹${value.toFixed(2)}`]}
                        contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            color: isDarkMode ? '#f8fafc' : '#0f172a'
                        }}
                        cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000} />
                    <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
