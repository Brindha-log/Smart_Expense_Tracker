import React from 'react';
import axios from "axios";
// import type { User } from '../types/users';

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

  if (!formData.fullName.trim()) {
    newErrors.fullName = 'Full Name is required';
  }

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

  // Save both the email and password so the login form can verify it later
 try {

  const response = await axios.post(
    "http://localhost:8080/api/auth/signup",
    {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
    }
  );

  setSuccessMessage(response.data);

} catch (error) {

  setErrors({
    email: "Signup failed"
  });

}
};