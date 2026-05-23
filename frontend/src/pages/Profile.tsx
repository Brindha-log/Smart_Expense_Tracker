import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { expenseService } from '../services/expenseService';
import { ProfileImageUpload } from '../components/profile/ProfileImageUpload';
import { PasswordModal } from '../components/profile/PasswordModal';
import { EmailModal } from '../components/profile/EmailModal';

export const Profile: React.FC = () => {
  const { user, login, logout } = useApp();
  
  // Local state for form edits
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
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
      const updatedUser = await profileService.updateProfile({
        name,
        phoneNumber,
        currency
      });
      // Also update monthly income if expenseService is available
      try {
        await expenseService.setMonthlyIncome(user.id, monthlyIncome);
      } catch (e) {
        console.error("Failed to update monthly income", e);
      }
      login({ ...user, ...updatedUser, monthlyIncome });
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error(error);
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <ProfileImageUpload />
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            
            <div className="mt-6 w-full pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Profile Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6">Personal Information</h3>
            
            {saveMessage && (
              <div className={`mb-6 p-3 text-sm rounded-xl font-medium border ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {saveMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Email Address</span>
                    <button type="button" onClick={() => setShowEmailModal(true)} className="text-blue-600 dark:text-blue-400 hover:text-blue-700">Change</button>
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

              <div className="grid grid-cols-1 gap-6">
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
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal 
          email={user.email}
          onClose={() => setShowPasswordModal(false)} 
          onSuccess={() => setShowPasswordModal(false)} 
        />
      )}
      
      {showEmailModal && (
        <EmailModal 
          onClose={() => setShowEmailModal(false)} 
          onSuccess={() => setShowEmailModal(false)} 
        />
      )}
    </div>
  );
};