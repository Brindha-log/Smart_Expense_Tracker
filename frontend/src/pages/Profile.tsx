import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { expenseService } from '../services/expenseService';
import { ProfileImageUpload } from '../components/profile/ProfileImageUpload';
import { EmailModal } from '../components/profile/EmailModal';

export const Profile: React.FC = () => {
  const { user, login, logout } = useApp();

  // Local state for form edits
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      setCurrency(user.currency || 'INR');
      setMonthlyIncome(user.monthlyIncome || 0);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg"></div>
        <div className="h-64 w-full bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const updatedUser = await profileService.updateProfile({ name, phoneNumber, currency });
      try {
        await expenseService.setMonthlyIncome(user.id, monthlyIncome);
      } catch (e) {
        console.error('Failed to update monthly income', e);
      }
      login({ ...user, ...updatedUser, monthlyIncome });
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset fields to current user values
    setName(user.name || '');
    setPhoneNumber(user.phoneNumber || '');
    setCurrency(user.currency || 'INR');
    setMonthlyIncome(user.monthlyIncome || 0);
    setSaveMessage(null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500">Manage your personal information and security preferences.</p>
      </div>

      <Card className="p-6 sm:p-8">

        {/* ── Always-visible: Avatar + Name + Email ── */}
        <div className="flex flex-col items-center text-center">
          <ProfileImageUpload />
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{name || user.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>

          {/* Edit / Cancel toggle */}
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-5 inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* ── Save message (shown after save attempt) ── */}
        {saveMessage && (
          <div className={`mt-6 p-3 text-sm rounded-xl font-medium border ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            {saveMessage.text}
          </div>
        )}

        {/* ── Expanded edit section ── */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="mt-8 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-8">

            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email (read-only with change link) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Email Address</span>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 normal-case font-medium"
                  >
                    Change
                  </button>
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 outline-none text-sm cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">Click 'Change' to update your email securely.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white dark:bg-slate-800 dark:text-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Base Monthly Income</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="0"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Set a fixed monthly income to base your budget limits on.</p>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSuccess={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};
