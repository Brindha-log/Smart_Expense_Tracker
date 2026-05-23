import React from 'react';
import type { CreditCard, CreditBillingSummary } from '../../services/creditCardService';
import PaymentReminder from './PaymentReminder';

interface Props {
    card: CreditCard;
    summary: CreditBillingSummary | null;
}

export default function BillingCycleCard({ card, summary }: Props) {
    if (!summary) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Billing Overview</h3>
                <p className="text-sm text-slate-500">
                    Cycle: <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(summary.billingCycleStart)} - {formatDate(summary.billingCycleEnd)}</span>
                </p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/50">
                        <span className="text-sm text-slate-500">Previous Unpaid Balance</span>
                        <span className="font-medium text-slate-900 dark:text-white">₹{summary.carryForwardUnpaidBalance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/50">
                        <span className="text-sm text-slate-500">Current Cycle Spend</span>
                        <span className="font-medium text-rose-600 dark:text-rose-400">+ ₹{summary.currentBillAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/50">
                        <span className="text-sm text-slate-500">Payments Made (This Cycle)</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">- ₹{summary.totalPayments.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Total Outstanding</span>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">₹{summary.outstandingBalance.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <PaymentReminder card={card} summary={summary} />
            </div>
        </div>
    );
}
