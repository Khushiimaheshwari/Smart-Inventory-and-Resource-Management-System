"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // router import
import styles from "./login.module.css"; // tumhara CSS module

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const router = useRouter(); // initialize router
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);


 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json();
      setError(errData.error || "Login failed");
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log("Login successful:", data);

    router.push("/profile"); // use router instead of window.location
  } catch (err) {
    console.error(err);
    setError("Something went wrong, try again later.");
  } finally {
    setLoading(false);
  }
};

// Keep signup redirect function
const handleSignupClick = () => {
  router.push("/signup");
};


  return (
    <div className={styles["login-container"]}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2>Login</h2>

        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div className={styles["signup-option"]}>
          <p>
            Don&apos;t have an account?{" "}
            <span 
              className={styles["signup-link"]} 
              onClick={handleSignupClick}
              style={{ cursor: "pointer",  textDecoration: "underline" }}
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
