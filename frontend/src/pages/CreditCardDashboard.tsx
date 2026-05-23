import React, { useState, useEffect } from 'react';
import { creditCardService, type CreditCard, type CreditTransaction, type CreditPayment, type CreditBillingSummary } from '../services/creditCardService';
import CreditCardProfile from '../components/credit/CreditCardProfile';
import CreditCardSummary from '../components/credit/CreditCardSummary';
import BillingCycleCard from '../components/credit/BillingCycleCard';
import CreditTransactionTable from '../components/credit/CreditTransactionTable';
import CreditPaymentHistory from '../components/credit/CreditPaymentHistory';

export default function CreditCardDashboard() {
    const [card, setCard] = useState<CreditCard | null>(null);
    const [summary, setSummary] = useState<CreditBillingSummary | null>(null);
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [payments, setPayments] = useState<CreditPayment[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payments' | 'settings'>('overview');

    const loadData = async () => {
        setLoading(true);
        const cardData = await creditCardService.getCard();
        setCard(cardData);
        if (cardData) {
            const [summaryData, txPage, payPage] = await Promise.all([
                creditCardService.getBillingSummary(),
                creditCardService.getTransactions(0, 50),
                creditCardService.getPayments(0, 50)
            ]);
            setSummary(summaryData);
            setTransactions(txPage.content);
            setPayments(payPage.content);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm mb-6">
                    <strong>Welcome to the Credit Card Module!</strong> This section is completely isolated from your normal expenses. Set up your card below to start tracking.
                </div>
                <CreditCardProfile card={null} onUpdate={loadData} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Credit Card Hub</h1>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['overview', 'transactions', 'payments', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab 
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <CreditCardSummary card={card} summary={summary} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <BillingCycleCard card={card} summary={summary} />
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <CreditTransactionTable transactions={transactions.slice(0, 5)} onUpdate={loadData} />
                            <div className="text-center">
                                <button onClick={() => setActiveTab('transactions')} className="text-sm text-blue-600 hover:underline">View All Transactions</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <CreditTransactionTable transactions={transactions} onUpdate={loadData} />
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <CreditPaymentHistory payments={payments} onUpdate={loadData} />
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                    <CreditCardProfile card={card} onUpdate={loadData} />
                </div>
            )}
        </div>
    );
}
