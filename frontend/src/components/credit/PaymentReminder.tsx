import React from 'react';
import type { CreditCard, CreditBillingSummary } from '../../services/creditCardService';

interface Props {
    card: CreditCard;
    summary: CreditBillingSummary;
}

export default function PaymentReminder({ card, summary }: Props) {
    const today = new Date();
    const currentDay = today.getDate();
    let daysUntilDue = card.dueDate - currentDay;
    
    // If due date has passed this month, it's next month's due date
    if (daysUntilDue < 0) {
        // Simple approx, a true calendar calculation is more robust
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        daysUntilDue = (daysInMonth - currentDay) + card.dueDate;
    }

    const isDueSoon = daysUntilDue <= 5 && daysUntilDue >= 0;
    const hasBalance = summary.outstandingBalance > 0;

    if (!hasBalance) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3">
                <div className="text-emerald-600 mt-0.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">All Caught Up!</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">You have no outstanding balance for this card.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl p-4 border flex items-start gap-3 ${
            isDueSoon 
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30' 
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30'
        }`}>
            <div className={isDueSoon ? 'text-rose-600' : 'text-amber-600'}>
                <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="flex-1">
                <h4 className={`text-sm font-bold ${isDueSoon ? 'text-rose-800 dark:text-rose-400' : 'text-amber-800 dark:text-amber-400'}`}>
                    Payment Due {isDueSoon ? 'Soon' : 'Upcoming'}
                </h4>
                <div className="flex justify-between items-end mt-2">
                    <div>
                        <p className={`text-xs ${isDueSoon ? 'text-rose-600 dark:text-rose-500' : 'text-amber-700 dark:text-amber-500'}`}>
                            Minimum Due: <span className="font-bold">₹{summary.minimumDue.toLocaleString('en-IN')}</span>
                        </p>
                        <p className={`text-xs mt-0.5 ${isDueSoon ? 'text-rose-600 dark:text-rose-500' : 'text-amber-700 dark:text-amber-500'}`}>
                            Due in {daysUntilDue} days (on the {card.dueDate}th)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
