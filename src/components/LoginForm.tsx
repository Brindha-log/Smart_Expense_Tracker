import React, { useState } from 'react';
import { handleLoginSubmit } from '../types/handleLogin'; 

export const INITIAL_LOGIN_STATE = {
  email: '',
  password: '',
};

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState(INITIAL_LOGIN_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleLoginSubmit({
      event: e,
      formData,
      setErrors,
      setGlobalError,
      setSuccessMessage: (message) => {
        setSuccessMessage(message);
        
       
        if (message && onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess();
          }, 800);
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Smart Expense Tracker</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Sign in to manage your finances</p>

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

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3 rounded-md text-sm transition-colors mt-2 shadow-sm focus:outline-none cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};