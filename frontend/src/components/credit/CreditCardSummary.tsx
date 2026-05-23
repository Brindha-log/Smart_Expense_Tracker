import React from 'react';
import type { CreditCard, CreditBillingSummary } from '../../services/creditCardService';
import CreditUsageBar from './CreditUsageBar';

interface Props {
    card: CreditCard;
    summary: CreditBillingSummary | null;
}

export default function CreditCardSummary({ card, summary }: Props) {
    const usedLimit = card.creditLimit - card.availableLimit;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Card Display */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start z-10">
                    <div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{card.bankName}</p>
                        <h3 className="text-xl font-bold mt-1 tracking-wide">{card.cardName}</h3>
                    </div>
                    <div className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm text-xs font-bold tracking-wider">
                        {card.cardType}
                    </div>
                </div>

                <div className="z-10 mt-6 space-y-4">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Available Credit</p>
                        <p className="text-3xl font-bold tracking-tight">₹{card.availableLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-700/50 pt-4">
                        <div>
                            <p className="text-slate-400 text-xs">Total Limit</p>
                            <p className="font-medium text-sm">₹{card.creditLimit.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs">Interest Rate</p>
                            <p className="font-medium text-sm">{card.interestRate}% APR</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Utilization & Snapshot Details */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Credit Utilization</h3>
                    <CreditUsageBar usedLimit={usedLimit} creditLimit={card.creditLimit} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium uppercase tracking-wider">Outstanding</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">
                            ₹{summary?.outstandingBalance?.toLocaleString('en-IN') || '0.00'}
                        </p>
                    </div>
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                        <p className="text-xs text-rose-600 dark:text-rose-400 mb-1 font-medium uppercase tracking-wider">Current Bill</p>
                        <p className="font-bold text-lg text-rose-700 dark:text-rose-300">
                            ₹{summary?.currentBillAmount?.toLocaleString('en-IN') || '0.00'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
