import React, { useState, useEffect } from 'react';
import type { Expense } from '../types/Expense';

interface Props {
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  initialData: Expense | null;
}

export const ExpenseForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setCategory(initialData.category);
      setDate(initialData.date);
    }
  }, [initialData]);

 const handleSubmit = (e: React.FormEvent) => {

  e.preventDefault();

  onSubmit({

    title,

    amount: parseFloat(amount),

    category,

    date

  });
};

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-xl space-y-4">
      <h3 className="font-bold text-lg">{initialData ? 'Edit Expense' : 'Add Expense'}</h3>
      
      {/* Title Input */}
      <input className="w-full border p-2 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      
      {/* Amount Input - Explicitly tied to amount state */}
      <input 
  type="number" 
  value={amount} 
  onChange={(e) => setAmount(e.target.value)} 
  placeholder="Amount" 
  className="w-full border p-2 rounded" 
  required 
/>
      
      {/* Category Select - Explicitly tied to category state */}
      {/* CATEGORY SELECT */}
<select 
  value={category} 
  onChange={(e) => setCategory(e.target.value)} 
  className="w-full border p-2 rounded"
>
  <option value="Food">Food</option>
  <option value="Travel">Travel</option>
  <option value="Bills">Bills</option>
  <option value="Shopping">Shopping</option>
  <option value="Health">Health</option>
  <option value="Other">Other</option>
</select>
      
      {/* Date Input */}
      <input className="w-full border p-2 rounded" type="date" value={date} onChange={e => setDate(e.target.value)} required />
      
      <button className="w-full bg-black text-white p-2 rounded" type="submit">Save</button>
    </form>
  );
};