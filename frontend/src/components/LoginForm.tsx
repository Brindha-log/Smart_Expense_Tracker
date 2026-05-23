import React, { useState, useEffect } from 'react';
import { handleLoginSubmit } from '../types/handleLogin'; 
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';

export const INITIAL_LOGIN_STATE = {
  email: '',
  password: '',
};

type ViewState = 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { login } = useApp();
  const [view, setView] = useState<ViewState>('login');
  const [formData, setFormData] = useState(INITIAL_LOGIN_STATE);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const clearMessages = () => {
    setGlobalError(null);
    setSuccessMessage(null);
    setErrors({});
  };

  const handleSwitchView = (newView: ViewState) => {
    clearMessages();
    setView(newView);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    handleLoginSubmit({
      event: e,
      formData,
      setErrors,
      setGlobalError,
      setSuccessMessage: async (message) => {
        setSuccessMessage(message);
        if (message && onLoginSuccess) {
          try {
            const profile = await profileService.getMyProfile();
            login(profile);
          } catch (err) {
            console.error("Failed to load user profile", err);
          }
          setTimeout(() => {
            onLoginSuccess();
          }, 800);
        }
      },
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrors({ email: 'Valid email is required' });
      return;
    }
    setIsLoading(true);
    try {
      await authService.sendOtp(forgotEmail);
      setSuccessMessage('OTP sent to your email.');
      setCooldown(60);
      handleSwitchView('forgot-otp');
    } catch (err: any) {
      setGlobalError(err.response?.data || err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!otp || otp.length < 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }
    setIsLoading(true);
    try {
      await authService.verifyOtp(forgotEmail, otp);
      setSuccessMessage('OTP Verified.');
      handleSwitchView('forgot-reset');
    } catch (err: any) {
      setGlobalError(err.response?.data || err.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(forgotEmail, newPassword, otp);
      setSuccessMessage('Password reset successfully. You can now login.');
      // Reset all forgot password state
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => handleSwitchView('login'), 2000);
    } catch (err: any) {
      setGlobalError(err.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Smart Expense Tracker</h2>
      <p className="text-sm text-slate-500 text-center mb-6">
        {view === 'login' && 'Sign in to manage your finances'}
        {view === 'forgot-email' && 'Reset your password'}
        {view === 'forgot-otp' && 'Verify your identity'}
        {view === 'forgot-reset' && 'Create new password'}
      </p>

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md text-center border border-emerald-200">
          {successMessage}
        </div>
      )}

      {globalError && (
        <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm font-medium rounded-md text-center border border-rose-200">
          {globalError}
        </div>
      )}

      {view === 'login' && (
        <form onSubmit={onSubmitLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-900">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900"
              placeholder="Your email"
            />
            {errors.email && <span className="text-xs text-rose-600 mt-0.5">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-900">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900 pr-12"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-xs font-bold text-slate-900 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="text-xs text-rose-600 mt-0.5">{errors.password}</span>}
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => handleSwitchView('forgot-email')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3 rounded-md text-sm transition-colors mt-2 shadow-sm focus:outline-none cursor-pointer"
          >
            Sign In
          </button>
        </form>
      )}

      {view === 'forgot-email' && (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-900">Registered Email</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900"
              placeholder="Enter your email"
            />
            {errors.email && <span className="text-xs text-rose-600 mt-0.5">{errors.email}</span>}
          </div>
          <button
            type="submit"
            disabled={isLoading || cooldown > 0}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold p-3 rounded-md text-sm transition-colors mt-2 shadow-sm focus:outline-none cursor-pointer"
          >
            {isLoading ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Send OTP'}
          </button>
          <button 
            type="button" 
            onClick={() => handleSwitchView('login')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 text-center mt-2"
          >
            Back to Login
          </button>
        </form>
      )}

      {view === 'forgot-otp' && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-900">6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900 tracking-[0.5em] text-center font-bold"
              placeholder="------"
            />
            {errors.otp && <span className="text-xs text-rose-600 mt-0.5">{errors.otp}</span>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold p-3 rounded-md text-sm transition-colors mt-2 shadow-sm focus:outline-none cursor-pointer"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="flex justify-between items-center mt-2 px-1">
            <button 
              type="button" 
              onClick={() => handleSwitchView('login')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSendOtp}
              disabled={isLoading || cooldown > 0}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}

      {view === 'forgot-reset' && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-900">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900 pr-12"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-xs font-bold text-slate-900 hover:text-slate-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPassword && <span className="text-xs text-rose-600 mt-0.5">{errors.newPassword}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-900">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <span className="text-xs text-rose-600 mt-0.5">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold p-3 rounded-md text-sm transition-colors mt-2 shadow-sm focus:outline-none cursor-pointer"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};