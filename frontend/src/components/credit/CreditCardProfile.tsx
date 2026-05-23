import React, { useState } from 'react';
import { type CreditCard, creditCardService } from '../../services/creditCardService';

interface Props {
    card: CreditCard | null;
    onUpdate: () => void;
}

export default function CreditCardProfile({ card, onUpdate }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<CreditCard>>(
        card || {
            cardName: '',
            bankName: '',
            cardType: 'VISA',
            creditLimit: '' as any,
            billingDate: 5,
            dueDate: 20,
            interestRate: 3.5
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await creditCardService.saveCard(formData as CreditCard);
            onUpdate();
        } catch (error: any) {
            console.error('Failed to save credit card setup', error);
            alert(error.response?.data?.message || 'Failed to save setup');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {card ? 'Edit Card Details' : 'Setup Credit Card'}
                </h3>
                <p className="text-sm text-slate-500">
                    {card ? 'Update your card configuration.' : 'Add your credit card details to start tracking liability independently.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Name (Alias)</label>
                        <input
                            required type="text" placeholder="e.g. Amazon Pay ICICI"
                            value={formData.cardName}
                            onChange={e => setFormData({ ...formData, cardName: e.target.value })}
                            disabled={isSubmitting}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                        <input
                            required type="text" placeholder="e.g. ICICI Bank"
                            value={formData.bankName}
                            onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                            disabled={isSubmitting}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Type</label>
                        <select
                            value={formData.cardType}
                            onChange={e => setFormData({ ...formData, cardType: e.target.value as any })}
                            disabled={isSubmitting}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                        >
                            <option value="VISA">Visa</option>
                            <option value="MASTERCARD">Mastercard</option>
                            <option value="RUPAY">RuPay</option>
                            <option value="AMEX">Amex</option>
                            <option value="DISCOVER">Discover</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Credit Limit</label>
                        <input
                            required type="number" min="1" step="0.01"
                            value={formData.creditLimit}
                            onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                            disabled={!!card || isSubmitting} // Immutable after creation
                            title={card ? "Credit limit cannot be changed after setup." : ""}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {card && <p className="text-xs text-slate-400 mt-1">Credit limit is locked after creation.</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Date (1-31)</label>
                        <input
                            required type="number" min="1" max="31"
                            value={formData.billingDate}
                            onChange={e => setFormData({ ...formData, billingDate: Number(e.target.value) })}
                            disabled={isSubmitting}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date (1-31)</label>
                        <input
                            required type="number" min="1" max="31"
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: Number(e.target.value) })}
                            disabled={isSubmitting}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interest Rate (% APR)</label>
                        <input
                            required type="number" min="0" step="0.01"
                            value={formData.interestRate}
                            onChange={e => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                            disabled={isSubmitting}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                        {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {card ? 'Save Changes' : 'Complete Setup'}
                    </button>
                </div>
            </form>
        </div>
    );
}
