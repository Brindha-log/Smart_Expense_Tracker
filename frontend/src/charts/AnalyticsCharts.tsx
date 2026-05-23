import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import type { TrendData, CategoryBreakdown } from '../../services/analyticsService';

interface ChartProps {
    data: any[];
    isDarkMode: boolean;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

export const SpendingTrendChart: React.FC<ChartProps & { dataKey: string, syncId?: string }> = ({ data, isDarkMode, dataKey, syncId }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} syncId={syncId} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} dx={-10} />
                <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '8px', color: isDarkMode ? '#fff' : '#000' }}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={dataKey === 'income' ? '#10b981' : '#f43f5e'} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const CategoryPieChart: React.FC<ChartProps> = ({ data, isDarkMode }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey="category"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '8px' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Simulated prediction chart using last 3 points + 1 projected point
export const PredictionChart: React.FC<ChartProps & { predictedNextMonth: number }> = ({ data, isDarkMode, predictedNextMonth }) => {
    
    const recentData = data.slice(-3); // Get last 3 months
    const projectedData = [...recentData, { label: 'Next Month (Est.)', expense: predictedNextMonth, isProjected: true }];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={projectedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} dx={-10} />
                <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', borderRadius: '8px' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Bar dataKey="expense" barSize={40} radius={[4, 4, 0, 0]}>
                    {projectedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isProjected ? (isDarkMode ? '#334155' : '#cbd5e1') : '#3b82f6'} />
                    ))}
                </Bar>
                <Line type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};
