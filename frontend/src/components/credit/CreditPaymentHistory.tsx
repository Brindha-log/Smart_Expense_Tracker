import React, { useState } from 'react';
import { type CreditPayment, creditCardService } from '../../services/creditCardService';

interface Props {
    payments: CreditPayment[];
    onUpdate: () => void;
}

export default function CreditPaymentHistory({ payments, onUpdate }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<CreditPayment>>({
        amount: '' as any,
        paymentDate: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await creditCardService.addPayment(formData as CreditPayment);
            setShowForm(false);
            setFormData({
                amount: '' as any,
                paymentDate: new Date().toISOString().split('T')[0],
            });
            onUpdate();
        } catch (error: any) {
            console.error('Failed to add payment', error);
            alert(error.response?.data?.message || 'Failed to add payment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (isSubmitting) return;
        if (confirm('Delete this payment record? Your available limit will decrease.')) {
            setIsSubmitting(true);
            try {
                await creditCardService.deletePayment(id);
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
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment History</h3>
                    <p className="text-sm text-slate-500">Record your credit card bill payments.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                    {showForm ? 'Cancel' : 'Record Payment'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Amount</label>
                            <input
                                required type="number" min="0.01" step="0.01"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Date</label>
                            <input
                                required type="date"
                                value={formData.paymentDate}
                                onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                            {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            Save Payment
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {payments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No payments recorded yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Payment Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount Paid</th>
                                    <th className="px-6 py-4 font-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {payments.map(pmt => (
                                    <tr key={pmt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {new Date(pmt.paymentDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-500">
                                            +₹{pmt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => pmt.id && handleDelete(pmt.id)}
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
