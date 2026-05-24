import React from 'react';
import axios from "axios";

interface LoginLogicProps {
  event: React.FormEvent<HTMLFormElement>;
  formData: typeof import('../components/LoginForm').INITIAL_LOGIN_STATE;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setGlobalError: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccessMessage: (message: string | null) => void;
}

export const handleLoginSubmit = async ({
  event,
  formData,
  setErrors,
  setGlobalError,
  setSuccessMessage,
}: LoginLogicProps): Promise<void> => {
  event.preventDefault();
  setErrors({});
  setGlobalError(null);
  setSuccessMessage(null);

  const newErrors: Record<string, string> = {};
  if (!formData.email.trim()) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await axios.post(
      "https://smart-expense-tracker-youq.onrender.com/api/auth/login",
      {
        email: formData.email,
        password: formData.password,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const responseString = String(response.data).toLowerCase();
    if (responseString.includes("invalid") || responseString.includes("not found") || responseString.includes("fail")) {
      setGlobalError(response.data || "Invalid email or password");
      setSuccessMessage(null);
      return;
    }

    const token = response.data;
    if (typeof token === 'string' && token.length > 50) {
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('registeredUser', formData.email);
      setSuccessMessage(`Login successful! Welcome back.`);
    } else {
      throw new Error("Invalid token received");
    }

  } catch (error: any) {
    setSuccessMessage(null);
    if (error.response) {
      const serverMessage = typeof error.response.data === 'string'
        ? error.response.data
        : error.response.data.message || "Invalid credentials";
      setGlobalError(serverMessage);
    } else {
      setGlobalError("Cannot connect to backend server.");
    }
  }
};