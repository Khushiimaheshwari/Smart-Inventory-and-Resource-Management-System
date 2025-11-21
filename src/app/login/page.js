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

// const handleLogin = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   const res = await signIn("credentials", {
//     redirect: false, 
//     email,
//     password,
//   });

//   if (res?.error) {
//     setError(res.error);

//   } else {
//     const sessionRes = await fetch("/api/auth/session");
//     const sessionData = await sessionRes.json();

//     const role = sessionData?.user?.role;
//     if (role === "admin") window.location.href = "/adminPanel";
//     else if (role === "faculty") window.location.href = "/facultyPanel";
//     else if (role === "lab_technician") window.location.href = "/lab_technicianPanel";
//     else window.location.href = "/login";
//   }

//   setLoading(false);
// };

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (res?.error) {
    setError(res.error);
    setLoading(false);
    return;
  }

  const sessionRes = await fetch("/api/auth/session");
  const sessionData = await sessionRes.json();

  const userRes = await fetch("/api/auth/userDetails");
  const { user } = await userRes.json();

  const needsOnboarding =
    !user.PhoneNumber ||
    !user.ProfileImage ||
    !user.Location;

  if (needsOnboarding) {
    window.location.href = "/onboarding";
    return;
  }

  const role = sessionData?.user?.role;
  if (role === "admin") window.location.href = "/adminPanel";
  else if (role === "faculty") window.location.href = "/facultyPanel";
  else if (role === "lab_technician") window.location.href = "/lab_technicianPanel";
  else window.location.href = "/login";

  setLoading(false);
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

        {/* <div className={styles["signup-option"]}>
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
        </div> */}
      </form>
    </div>
  );
}
