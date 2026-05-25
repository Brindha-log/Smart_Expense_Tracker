import React, { useEffect, useState, useCallback } from "react";
import { expenseService } from "../services/expenseService";
import type { Expense } from "../types";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/common/Modal";
import { ExpenseFormModal } from "../components/expenses/ExpenseFormModal";

export const Expenses: React.FC = () => {
    const { user } = useApp();
    const userId = user?.id || 1;
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

    // Month filter state — defaults to current month/year
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [isFiltering, setIsFiltering] = useState(false);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    const fetchExpenses = useCallback(async () => {
        try {
            const data = await expenseService.getExpensesPage(userId, page, 10);
            setExpenses(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Fetch failed", error);
        }
    }, [page, userId]);

    const fetchFilteredExpenses = useCallback(async () => {
        try {
            const data = await expenseService.getExpensesByMonth(userId, selectedMonth, selectedYear);
            setFilteredExpenses(data);
        } catch (error) {
            console.error("Filter fetch failed", error);
        }
    }, [userId, selectedMonth, selectedYear]);

    useEffect(() => {
        fetchExpenses();
        const handleDataUpdate = () => fetchExpenses();
        window.addEventListener('data-updated', handleDataUpdate);
        return () => window.removeEventListener('data-updated', handleDataUpdate);
    }, [fetchExpenses]);

    useEffect(() => {
        if (isFiltering) fetchFilteredExpenses();
    }, [isFiltering, fetchFilteredExpenses]);

    const handleFormSubmit = async (expenseData: Omit<Expense, 'id' | 'userId'>) => {
        try {
            if (expenseToEdit && expenseToEdit.id) {
                await expenseService.updateExpense(expenseToEdit.id, {
                    ...expenseData,
                    id: expenseToEdit.id,
                    userId: userId
                } as Expense);
            } else {
                await expenseService.addExpense(userId, expenseData as Expense);
            }
            setIsFormOpen(false);
            setExpenseToEdit(null);
            await fetchExpenses();
            if (isFiltering) await fetchFilteredExpenses();
            window.dispatchEvent(new Event('data-updated'));
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save transaction.");
        }
    };

    const handleDeleteExpense = async (id: number) => {
        if (!window.confirm("Delete this transaction?")) return;
        try {
            await expenseService.deleteExpense(id);
            setSelectedExpenseId(null);
            await fetchExpenses();
            if (isFiltering) await fetchFilteredExpenses();
            window.dispatchEvent(new Event('data-updated'));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleEditClick = (expense: Expense) => {
        setExpenseToEdit(expense);
        setIsFormOpen(true);
    };

    const closeModal = () => {
        setIsFormOpen(false);
        setExpenseToEdit(null);
    };

    const handleApplyFilter = () => {
        setIsFiltering(true);
        fetchFilteredExpenses();
    };

    const handleClearFilter = () => {
        setIsFiltering(false);
        setFilteredExpenses([]);
        setSelectedMonth(now.getMonth() + 1);
        setSelectedYear(now.getFullYear());
    };

    const handleRowClick = (id: number) => {
        setSelectedExpenseId(prev => prev === id ? null : id);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Years: current year and 2 years back
    const years = [now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear()];

    const displayedExpenses = isFiltering ? filteredExpenses : expenses;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Transactions</h1>
                    <p className="text-slate-500">Manage and track all your income and expenses.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => { setExpenseToEdit(null); setIsFormOpen(true); }}>
                        + Add Transaction
                    </Button>
                </div>
            </div>

            {/* Month Filter Bar */}
            <div className="flex flex-wrap items-end gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Month</label>
                    <select
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    >
                        {monthNames.map((m, i) => (
                            <option key={i + 1} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year</label>
                    <select
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleApplyFilter}>Apply Filter</Button>
                {isFiltering && (
                    <Button variant="secondary" onClick={handleClearFilter}>Clear Filter</Button>
                )}
                {isFiltering && (
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium self-end">
                        Showing {monthNames[selectedMonth - 1]} {selectedYear} ({filteredExpenses.length} transactions)
                    </span>
                )}
            </div>

            {/* Transactions List */}
            <Card>
                {displayedExpenses.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        {isFiltering
                            ? `No transactions found for ${monthNames[selectedMonth - 1]} ${selectedYear}.`
                            : 'No transactions found. Add one to get started!'}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {displayedExpenses.map((expense) => {
                            const isSelected = selectedExpenseId === expense.id;
                            return (
                                <div
                                    key={expense.id}
                                    onClick={() => handleRowClick(expense.id)}
                                    className={`flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 cursor-pointer transition-colors
                                        ${isSelected
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{expense.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{expense.category} • {expense.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-lg font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toFixed(2)}
                                        </span>

                                        {/* Edit & Delete — only visible when this row is selected */}
                                        {isSelected && (
                                            <div
                                                className="flex gap-2"
                                                onClick={e => e.stopPropagation()} // prevent row toggle when clicking buttons
                                            >
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleEditClick(expense)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Pagination — only show when not filtering */}
            {!isFiltering && totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1}>
                        Next
                    </Button>
                </div>
            )}

            {/* Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={closeModal}
                title={expenseToEdit ? "Edit Transaction" : "Add Transaction"}
            >
                <ExpenseFormModal
                    initialData={expenseToEdit}
                    onSubmit={handleFormSubmit}
                    onClose={closeModal}
                />
            </Modal>
        </div>
    );
};
