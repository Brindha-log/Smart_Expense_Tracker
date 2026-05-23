import React from 'react';
import axios, { isAxiosError } from "axios";

interface SubmitLogicProps {
  event: React.FormEvent<HTMLFormElement>;
  formData: typeof import('../components/RegistrationForm').INITIAL_FORM_STATE;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const handleRegistrationSubmit = async ({
  event,
  formData,
  setErrors,
  setSuccessMessage,
}: SubmitLogicProps): Promise<void> => {
  event.preventDefault();
  setErrors({});
  setSuccessMessage(null);

  const newErrors: Record<string, string> = {};

  // 1. Validation Logic
  if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters long';
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // 2. API Submission
  try {
    const response = await axios.post("https://smart-expense-tracker-youq.onrender.com/api/auth/signup", {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    // Assume success
    setSuccessMessage(response.data.message || "Registration successful! Please log in.");

  } catch (error) {
    // 3. Smart Error Handling
    if (isAxiosError(error) && error.response) {
      // Server returned an error (e.g., 400 Bad Request or 409 Conflict)
      setErrors({
        email: error.response.data.message || "Registration failed. Please try again."
      });
    } else {
      // Network or other unexpected errors
      setErrors({
        email: "Unable to connect to the server. Please check your network."
      });
    }
  }
};