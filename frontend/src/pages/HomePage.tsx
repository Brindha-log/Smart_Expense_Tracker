import React, { useState, useRef, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { useApp } from '../context/AppContext';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionCard } from '../components/TransactionCard';
import { EmptyState } from '../components/EmptyState';
import { ActionButton } from '../components/ActionButton';

export const Home: React.FC = () => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [incomeInput, setIncomeInput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, login } = useApp();
  const userId = user?.id || 1; 

  // Fix 1: Single source of truth for calculations.
  // Instead of an independent useEffect that creates state sync race conditions,
  // we update everything collectively when income or expenses explicitly change.
  useEffect(() => {
    setBalance(income - expenses);
  }, [income, expenses]);

  const fetchExpenses = useCallback(async () => {
    try {
      const data = await expenseService.getAllExpenses(userId);
      
      // Fix 2: Explicit defensive check against unparseable or empty backend responses
      const safeData = Array.isArray(data) ? data : [];
      
      let totalExp = 0;
      safeData.forEach((item: any) => {
        if (item && item.type === 'expense') {
          totalExp += parseFloat(item.amount) || 0;
        }
      });

      // Fix 3: Sync local state gracefully with Context
      const currentIncome = user?.monthlyIncome || 0;
      
      setIncome(currentIncome);
      setExpenses(totalExp);
      setTransactions([...safeData].slice(0, 5)); 
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      // Fix 4: Graceful error fallback state so UI doesn't freeze up
      setTransactions([]);
      setExpenses(0);
    }
  }, [userId, user?.monthlyIncome]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await expenseService.uploadCsv(userId, file);
      alert("All expenses uploaded successfully!");
      await fetchExpenses(); // Re-fetch to update UI safely
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Some rows failed to upload. Please check your CSV format.");
    } finally {
      // Fix 5: Always clear the input value so the same file can be uploaded back-to-back if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = async () => {
    try {
      // 1. Fire Backend deletion command
      await expenseService.clearUserExpenses(userId);
      
      // 2. Clear UI state immediately with fresh primitives to avoid race states
      setTransactions([]);
      setExpenses(0);
      setBalance(income); 
      
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // 3. Confirm alignment with database
      await fetchExpenses(); 
      console.log("Cleanup successful");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to clear data from server. Please try again.");
    }
  };

  const handleSaveIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(incomeInput);
    const finalAmount = isNaN(parsedAmount) ? 0 : parsedAmount;
    
    // Set local state instantly
    setIncome(finalAmount);
    
    if (user) {
      try {
        await expenseService.setMonthlyIncome(userId, finalAmount);
        // Direct context trigger
        login({ ...user, monthlyIncome: finalAmount });
      } catch (error) {
        console.error("Failed to update profile income from home page", error);
      }
    }
    
    setIsModalOpen(false);
    setIncomeInput(''); // Clear modal field after submission
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-8 p-4">
      <section className="bg-slate-900 p-8 rounded-2xl text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold">SpendWize</h1>
          <p className="text-slate-400">Manage your finances efficiently.</p>
        </div>
        <button 
          onClick={() => {
            setIncomeInput(income > 0 ? income.toString() : '');
            setIsModalOpen(true);
          }} 
          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-semibold cursor-pointer border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {income > 0 ? 'Update Income' : 'Set Income'}
        </button>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center transition-colors">
        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Import Transactions</h2>
        <div className="flex gap-3 justify-center mt-4">
          <ActionButton label="Upload CSV" onClick={() => fileInputRef.current?.click()} primary />
          {transactions.length > 0 && (
            <button onClick={handleRemoveFile} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 cursor-pointer">
              Remove All Data
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" amount={balance} icon="💰" />
        <SummaryCard title="Monthly Income" amount={income} icon="📈" />
        <SummaryCard title="Monthly Expenses" amount={expenses} icon="📉" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border dark:border-slate-700">
            {transactions.map((tx, idx) => (
              <TransactionCard key={tx.id || idx} title={tx.title} category={tx.category} amount={tx.amount} date={tx.date} />
            ))}
          </div>
        ) : (
          <EmptyState message="No transactions available" />
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md shadow-xl border border-transparent dark:border-slate-800">
            <h2 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Configure Income</h2>
            <form onSubmit={handleSaveIncome}>
              <input 
                type="number" 
                step="0.01"
                value={incomeInput} 
                onChange={(e) => setIncomeInput(e.target.value)} 
                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 p-2.5 rounded-lg mb-4 transition-all" 
                placeholder="0.00" 
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer font-medium transition-colors">Close</button>
                <button type="submit" className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg cursor-pointer font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};