"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";

export default function OnboardingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    accessLevel: "User",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/profile");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Complete Your Profile</h2>
        <p className={styles.subtitle}>Just a few more details to get you started</p>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="location"
            placeholder="Location (City, Country)"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <select
            name="accessLevel"
            value={formData.accessLevel}
            onChange={handleChange}
            className={styles.select}
          >
            
            <option value="Lab Attendant">Lab Attendant</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Save & Continue
        </button>

        <div className={styles.progressIndicator}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <span className={styles.progressText}>Step 2 of 2</span>
        </div>
      </form>
    </div>
  );
}