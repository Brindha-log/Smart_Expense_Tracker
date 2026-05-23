import React, { useState } from 'react';
import { profileService } from '../../services/profileService';

interface EmailModalProps {
    onClose: () => void;
    onSuccess: (newToken: string) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState<'request' | 'verify'>('request');
    
    // Form states
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !password) {
            setError('Both new email and password fields are required.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // We use the existing sendOtp endpoint which accepts any email
            await profileService.sendOtp(newEmail);
            setStep('verify');
        } catch (err: any) {
            setError(err.response?.data || 'Failed to send OTP to new email.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) {
            setError('OTP is required.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await profileService.updateEmail({ newEmail, password, otp });
            // API returns { token: "..." }
            onSuccess(response.token);
        } catch (err: any) {
            setError(err.response?.data || 'Failed to update email. OTP might be invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Change Email Address</h3>
                
                {error && (
                    <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100">
                        {error}
                    </div>
                )}

                {step === 'request' ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <p className="text-sm text-slate-500 mb-2">
                            Enter your new email and current password. We will send an OTP to your new email to verify this change.
                        </p>
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">New Email</label>
                            <input 
                                type="email" 
                                value={newEmail} 
                                onChange={e => setNewEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="new@example.com"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Current Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="Enter current password"
                            />
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm disabled:opacity-70 flex justify-center items-center">
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyAndChange} className="flex flex-col gap-4">
                        <p className="text-sm text-slate-500 mb-2">
                            An OTP has been sent to <strong>{newEmail}</strong>. Please enter it below to confirm your email change.
                        </p>
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">6-Digit OTP</label>
                            <input 
                                type="text" 
                                maxLength={6}
                                value={otp} 
                                onChange={e => setOtp(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm tracking-widest text-center text-lg font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="------"
                            />
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button type="button" onClick={() => setStep('request')} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                                Back
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm disabled:opacity-70 flex justify-center items-center">
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirm Change'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
