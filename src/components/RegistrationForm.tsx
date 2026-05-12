import React, { useState } from "react";

// 1. Types (Integrated)
interface User {
  name: string;
  email: string;
  password: string;
}

export default function RegistrationForm() {
  // 2. State Management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [status, setStatus] = useState({ type: "", message: "" });

  // 3. Logic Handler
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!name || !email || !password || !confirmPassword) {
      setStatus({ type: "error", message: "All fields are required" });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    // Storage Logic
    const userData: User = { name, email, password };
    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    
    setStatus({ type: "success", message: "Account created successfully!" });
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
  };

  // 4. Professional Navy & White Styles
  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      backgroundColor: "white",
      padding: "2.5rem",
      borderRadius: "1rem",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      fontFamily: "sans-serif",
      color: "#001f3f",
    },
    title: { fontSize: "1.8rem", fontWeight: "bold", textAlign: "center", marginBottom: "0.5rem" },
    subtitle: { textAlign: "center", color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" },
    group: { marginBottom: "1.2rem" },
    label: { display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.4rem" },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    passWrapper: { position: "relative", display: "flex", alignItems: "center" },
    emojiBtn: {
      position: "absolute",
      right: "0.75rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      padding: 0,
      display: "flex",
      alignItems: "center",
      userSelect: "none",
    },
    button: {
      width: "100%",
      backgroundColor: "#001f3f",
      color: "white",
      padding: "0.8rem",
      border: "none",
      borderRadius: "0.5rem",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      marginTop: "1rem",
    },
    error: { backgroundColor: "#fee2e2", color: "#ef4444", padding: "0.7rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" },
    success: { backgroundColor: "#d1fae5", color: "#10b981", padding: "0.7rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", textAlign: "center" }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Sign Up </h1>
      <p style={styles.subtitle}>Connect With Us !</p>

      {status.type === "error" && <div style={styles.error}>{status.message}</div>}
      {status.type === "success" && <div style={styles.success}>{status.message}</div>}

      <form onSubmit={onSubmit}>
        <div style={styles.group}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <div style={styles.passWrapper}>
            <input
              style={{ ...styles.input, paddingRight: "2.5rem" }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.emojiBtn}
              tabIndex={-1}
            >
              {/* {showPassword ? "👁️" : "🙈"} */}
            </button>
          </div>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Confirm Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
    </div>
  );
}