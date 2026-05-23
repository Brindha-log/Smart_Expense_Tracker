import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategoryBreakdown } from '../../types';

interface ExpensePieChartProps {
    data: CategoryBreakdown[];
    isDarkMode: boolean;
}

const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#0f172a', '#334155', '#64748b'];

export const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data, isDarkMode }) => {
    if (!data || data.length === 0) return null;

    const chartData = data.map(d => ({
        name: d.category,
        value: d.amount
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#1e293b' : '#ffffff'} strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                        contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            color: isDarkMode ? '#f8fafc' : '#0f172a'
                        }}
                    />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
