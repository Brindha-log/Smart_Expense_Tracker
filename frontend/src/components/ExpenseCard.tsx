import React from 'react';
import type { Expense } from '../types/Expense';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-3 transition-all hover:shadow-md">
      {/* Expense Details */}
      <div className="flex flex-col mb-3 sm:mb-0">
        <p className="text-lg font-bold text-slate-900">{expense.title}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
            {expense.category}
          </span>
          <span className="text-sm text-slate-500">{expense.date}</span>
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end space-x-4">
        <p className="text-xl font-extrabold text-slate-900">
          ₹{(expense.amount ?? 0).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}
        </p>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(expense.id)}
            className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
