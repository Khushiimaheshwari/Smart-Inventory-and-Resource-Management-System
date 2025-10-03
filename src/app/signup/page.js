"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";  
import { signIn } from "next-auth/react";
import styles from "./signup.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const router = useRouter(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

     if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup details:", { email, password });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log(res);

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Signup failed");
        setLoading(false);
        return;
      }

      const data = await res.json();

      console.log("Signup successful:", data);

      router.push("/onboarding");

    } catch (err) {
      console.error(err);
      setError("Something went wrong, try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === "Microsoft") {
      signIn("azure-ad", { callbackUrl: "/onboarding" }); 
    }
  };

  return (
    <div className={styles["signup-container"]}>
      <form onSubmit={handleSignup} className={styles.form}>
        <h2>Signup</h2>

        <input 
          type="name"
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
