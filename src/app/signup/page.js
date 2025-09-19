"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";  // 👈 import router
import styles from "./signup.module.css";

export default function SignupPage() {
  const router = useRouter(); // 👈 initialize router

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 👉 yaha tu signup API call kar sakti hai
    console.log("Signup details:", { email, password });

    // Agar signup successful ho to onboarding pe bhej do
    router.push("/onboarding"); // 👈 redirect to onboarding
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // Add your social login logic here
  };

  return (
    <div className={styles["signup-container"]}>
      <form onSubmit={handleSignup} className={styles.form}>
        <h2>Signup</h2>

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
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <button type="submit">Signup</button>

        {/* Divider */}
        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* Social Login Buttons */}
        <div className={styles.socialButtons}>
          <button 
            type="button"
            className={`${styles.socialBtn} ${styles.microsoft}`}
            onClick={() => handleSocialLogin('Microsoft')}
          >
            <svg width="20" height="20" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Continue with Microsoft
          </button>
        </div>

        {/* Login Link */}
        <p className={styles.switch}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
