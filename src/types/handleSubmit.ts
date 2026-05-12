import type { User } from "../types/users";

export const handleRegisterSubmit = (userData: User): void => {
  const existingData = localStorage.getItem("users");
  const users = existingData ? JSON.parse(existingData) : [];
  
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
  
  console.log("User stored in localStorage:", userData);
};