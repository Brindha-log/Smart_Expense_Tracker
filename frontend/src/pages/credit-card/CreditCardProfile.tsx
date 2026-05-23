import React, { useState } from 'react';
import { type CreditCard, creditCardService } from '../../services/creditCardService';

interface Props {
    card: CreditCard | null;
    userId: number;
    onUpdate: () => void;
}

export default function CreditCardProfile({ card, userId, onUpdate }: Props) {
    const [isEditing, setIsEditing] = useState(!card);
    const [formData, setFormData] = useState<Partial<CreditCard>>(
        card || {
            cardName: '',
            bankName: '',
            creditLimit: 0,
            availableLimit: 0,
            billingDate: 1,
            dueDate: 15,
            interestRate: 0,
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Default available limit to credit limit on first setup if not explicitly set differently
            const payload = { ...formData } as CreditCard;
            if (!card && payload.availableLimit === 0) {
                payload.availableLimit = payload.creditLimit;
            }
            await creditCardService.saveCard(userId, payload);
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Failed to save credit card', error);
        }
    };

    if (!isEditing && card) {
        const usagePercentage = ((card.creditLimit - card.availableLimit) / card.creditLimit) * 100;
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{card.bankName}</p>
                            <h3 className="text-xl font-bold mt-1 tracking-wide">{card.cardName}</h3>
                        </div>
                        <svg className="w-10 h-10 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>

                    <div className="z-10 mt-8 space-y-4">
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Available Limit</p>
                            <p className="text-3xl font-bold tracking-tight">₹{card.availableLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex justify-between items-end border-t border-slate-700/50 pt-4">
                            <div>
                                <p className="text-slate-400 text-xs">Total Limit</p>
                                <p className="font-medium">₹{card.creditLimit.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-xs">Billing Date</p>
                                <p className="font-medium">{card.billingDate}th</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Details & Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Card Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500">Utilization</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{usagePercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${usagePercentage > 80 ? 'bg-rose-500' : usagePercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Due Date</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{card.dueDate}th of month</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Interest Rate</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{card.interestRate}% APR</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                            Edit Details
                        </button>
                        <button 
                            onClick={async () => {
                                if (confirm('Are you sure you want to remove this credit card and all its transactions? This cannot be undone.')) {
                                    await creditCardService.deleteCard(userId);
                                    onUpdate();
                                }
                            }}
                            className="flex-none px-4 py-2 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-sm font-medium transition-colors"
                        >
                            Remove Card
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                {card ? 'Edit Credit Card' : 'Credit Card Setup'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Name (e.g. Sapphire Reserve)</label>
                    <input
                        required
                        type="text"
                        value={formData.cardName}
                        onChange={e => setFormData({ ...formData, cardName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                    <input
                        required
                        type="text"
                        value={formData.bankName}
                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Credit Limit</label>
                    <input
                        required
                        type="number"
                        min="0"
                        value={formData.creditLimit}
                        onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                {card && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Available Limit</label>
                        <input
                            required
                            type="number"
                            min="0"
                            max={formData.creditLimit}
                            value={formData.availableLimit}
                            onChange={e => setFormData({ ...formData, availableLimit: Number(e.target.value) })}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Date (1-31)</label>
                    <input
                        required
                        type="number"
                        min="1"
                        max="31"
                        value={formData.billingDate}
                        onChange={e => setFormData({ ...formData, billingDate: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date (1-31)</label>
                    <input
                        required
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dueDate}
                        onChange={e => setFormData({ ...formData, dueDate: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
                    <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.interestRate}
                        onChange={e => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                {card && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                >
                    Save Card Details
                </button>
            </div>
        </form>
    );
}
