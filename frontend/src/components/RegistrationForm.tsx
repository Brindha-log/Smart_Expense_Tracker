import React, { useState } from 'react';
import { handleRegistrationSubmit } from '../types/handleSubmit';

export const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleRegistrationSubmit({
      event: e,
      formData,
      setErrors,
      setSuccessMessage,
    });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">SpendWize</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Create your fintech account</p>

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md text-center border border-emerald-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-900">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900"
            placeholder="Your name"
          />
          {errors.fullName && <span className="text-xs text-rose-600 mt-0.5">{errors.fullName}</span>}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-900">Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900"
              placeholder="enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-xs font-bold text-slate-900"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <span className="text-xs text-rose-600 mt-0.5">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-900">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm text-slate-900 outline-none focus:border-slate-900"
            placeholder="confirm password"
          />
          {errors.confirmPassword && <span className="text-xs text-rose-600 mt-0.5">{errors.confirmPassword}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold p-3 rounded-md text-sm transition-colors mt-2 shadow-sm"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};