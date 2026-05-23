import React, { useState } from 'react';
import { type CreditCard, type CreditTransaction, creditCardService } from '../../services/creditCardService';

interface Props {
    card: CreditCard;
    transactions: CreditTransaction[];
    userId: number;
    onUpdate: () => void;
}

export default function CreditCardTransactions({ transactions, userId, onUpdate }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<CreditTransaction>>({
        amount: '',
        category: 'Shopping',
        merchant: '',
        transactionDate: new Date().toISOString().split('T')[0],
        description: '',
        isEmi: false
    } as any);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await creditCardService.addTransaction(userId, formData as CreditTransaction);
            setShowForm(false);
            setFormData({
                amount: '', category: 'Shopping', merchant: '', 
                transactionDate: new Date().toISOString().split('T')[0], 
                description: '', isEmi: false
            } as any);
            onUpdate();
        } catch (error) {
            console.error('Failed to add transaction', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this transaction? Your available limit will be restored.')) {
            await creditCardService.deleteTransaction(userId, id);
            onUpdate();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Credit Card Purchases</h3>
                    <p className="text-sm text-slate-500">Record your card spending here. This will automatically reduce your available limit.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ml-4"
                >
                    {showForm ? 'Cancel' : '+ Add Purchase'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                            <input
                                required type="number" min="0" step="0.01"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Merchant</label>
                            <input
                                required type="text"
                                value={formData.merchant}
                                onChange={e => setFormData({ ...formData, merchant: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option>Shopping</option>
                                <option>Dining</option>
                                <option>Travel</option>
                                <option>Groceries</option>
                                <option>Entertainment</option>
                                <option>Utility</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                            <input
                                required type="date"
                                value={formData.transactionDate}
                                onChange={e => setFormData({ ...formData, transactionDate: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-2">
                            <input 
                                type="checkbox" id="isEmi" 
                                checked={formData.isEmi}
                                onChange={e => setFormData({ ...formData, isEmi: e.target.checked })}
                                className="w-4 h-4 rounded text-blue-600"
                            />
                            <label htmlFor="isEmi" className="text-sm font-medium text-slate-700 dark:text-slate-300">This is an EMI purchase</label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-medium transition-colors">
                            Save Purchase
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No credit card transactions yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Merchant & Desc</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                    <th className="px-6 py-4 font-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {new Date(tx.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                                {tx.merchant}
                                                {tx.isEmi && <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded uppercase font-bold">EMI</span>}
                                            </p>
                                            <p className="text-xs text-slate-500">{tx.description}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{tx.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-rose-500">
                                            -₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => tx.id && handleDelete(tx.id)}
                                                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
