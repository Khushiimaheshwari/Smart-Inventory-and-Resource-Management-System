"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // router import
import styles from "./login.module.css"; // tumhara CSS module

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // initialize router

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login details:", { email, password });
    // yaha apna login logic add kar sakti ho (API call etc.)
  };

  const handleSignupClick = () => {
    router.push("/signup"); // redirect to signup page
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
