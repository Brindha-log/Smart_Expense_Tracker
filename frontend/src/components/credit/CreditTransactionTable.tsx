import React, { useState } from 'react';
import { type CreditTransaction, creditCardService } from '../../services/creditCardService';

interface Props {
    transactions: CreditTransaction[];
    onUpdate: () => void;
}

export default function CreditTransactionTable({ transactions, onUpdate }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<CreditTransaction>>({
        amount: '' as any,
        category: 'SHOPPING',
        merchant: '',
        transactionDate: new Date().toISOString().split('T')[0],
        description: '',
        isEmi: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await creditCardService.addTransaction(formData as CreditTransaction);
            setShowForm(false);
            setFormData({
                amount: '' as any, category: 'SHOPPING', merchant: '', 
                transactionDate: new Date().toISOString().split('T')[0], 
                description: '', isEmi: false
            });
            onUpdate();
        } catch (error: any) {
            console.error('Failed to add transaction', error);
            alert(error.response?.data?.message || 'Failed to add transaction. Check limits.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (isSubmitting) return;
        if (confirm('Delete this transaction? Your available limit will be restored.')) {
            setIsSubmitting(true);
            try {
                await creditCardService.deleteTransaction(id);
                onUpdate();
            } catch (error: any) {
                alert(error.response?.data?.message || 'Failed to delete');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                    <p className="text-sm text-slate-500">Purchases reduce your available limit.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                    {showForm ? 'Cancel' : '+ New Purchase'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                            <input
                                required type="number" min="0.01" step="0.01"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Merchant</label>
                            <input
                                required type="text"
                                value={formData.merchant}
                                onChange={e => setFormData({ ...formData, merchant: e.target.value })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            >
                                <option value="SHOPPING">Shopping</option>
                                <option value="DINING">Dining</option>
                                <option value="TRAVEL">Travel</option>
                                <option value="GROCERIES">Groceries</option>
                                <option value="ENTERTAINMENT">Entertainment</option>
                                <option value="UTILITY">Utility</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                            <input
                                required type="date"
                                value={formData.transactionDate}
                                onChange={e => setFormData({ ...formData, transactionDate: e.target.value })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center space-x-2">
                            <input 
                                type="checkbox" id="isEmi" 
                                checked={formData.isEmi}
                                onChange={e => setFormData({ ...formData, isEmi: e.target.checked })}
                                disabled={isSubmitting}
                                className="w-4 h-4 rounded text-blue-600"
                            />
                            <label htmlFor="isEmi" className="text-sm font-medium text-slate-700 dark:text-slate-300">This is an EMI purchase</label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center gap-2">
                            {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            Save Purchase
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No active transactions found.
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
                                                disabled={isSubmitting}
                                                className="text-slate-400 hover:text-rose-500 transition-colors p-1 disabled:opacity-50 cursor-pointer"
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
