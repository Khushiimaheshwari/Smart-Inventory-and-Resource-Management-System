"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import styles from "./login.module.css"; 
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 
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

    const role = data?.user?.Role;

    if (role === "admin") {
      router.push("/adminPanel");
    } else if (role === "lab_technician") {
      router.push("/lab_technicianPanel");
    } else if (role === "faculty") {
      router.push("/facultyPanel");
    }else {
      router.push("/login");
    }

  } catch (err) {
    console.error(err);
    setError("Something went wrong, try again later.");
  } finally {
    setLoading(false);
  }
};

const handleSignupClick = () => {
  router.push("/signup");
};

const handleSocialLogin = (provider) => {
  if (provider === "Microsoft") {
    signIn("azure-ad", { callbackUrl: "/redirectAfterLogin" }); 
  }
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
