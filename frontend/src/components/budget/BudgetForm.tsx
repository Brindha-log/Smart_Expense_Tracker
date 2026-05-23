import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BudgetFormProps {
    onClose: () => void;
    onSubmit: (category: string, amount: number) => Promise<void>;
}

const CATEGORIES = [
    'TOTAL_MONTHLY', // Special flag for overall budget
    'Food', 'Travel', 'Shopping', 'Entertainment', 'Housing', 'Utilities', 'Health', 'Other'
];

export const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, onSubmit }) => {
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;
        
        try {
            setLoading(true);
            await onSubmit(category, Number(amount));
            onClose();
        } catch (error) {
            console.error("Failed to save budget", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Set Budget Limit</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'TOTAL_MONTHLY' ? 'Overall Monthly Limit' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Limit (₹)</label>
                        <input 
                            type="number" 
                            min="1"
                            step="1"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 5000"
                        />
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Budget'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
