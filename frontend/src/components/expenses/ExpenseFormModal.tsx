import React, { useState, useEffect } from 'react';
import type { Expense } from '../../types';
import { Button } from '../common/Button';

interface ExpenseFormProps {
    onSubmit: (expense: Omit<Expense, 'id' | 'userId'>) => void;
    initialData: Expense | null;
    onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormProps> = ({ onSubmit, initialData, onClose }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAmount(initialData.amount ? initialData.amount.toString() : '0');
            setCategory(initialData.category || '');
            setDate(initialData.date || new Date().toISOString().split('T')[0]);
            setType(initialData.type || 'expense');
        } else {
            setTitle('');
            setAmount('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]); // Default to today
            setType('expense');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !category || !date) {
            alert("Please fill in all fields.");
            return;
        }
        
        onSubmit({
            title,
            amount: parseFloat(amount),
            category,
            date,
            type
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Groceries"
                    required
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                    <select 
                        value={type} 
                        onChange={e => setType(e.target.value as 'income' | 'expense')}
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <input 
                        type="text" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="e.g. Food"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)} 
                        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save Transaction</Button>
            </div>
        </form>
    );
};
