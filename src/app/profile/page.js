"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <Image
          src="/profile.png"
          alt="Profile"
          width={140}
          height={140}
          className={styles.avatar}
        />
        <h1 className={styles.userName}>Naina Sharma</h1>
        <p className={styles.userEmail}>naina@example.com</p>
      </div>

      {/* Profile Cards Grid */}
      <div className={styles.profileGrid}>
        {/* Personal Information */}
        <div className={`${styles.profileCard} ${styles.personalInfo}`}>
          <h3 className={styles.cardTitle}> Personal Information</h3>
          <div className={styles.cardContent}>
            <p><strong>Full Name:</strong> Naina Sharma</p>
            <p><strong>Phone:</strong> +91 1234567890</p>
            <p><strong>Location:</strong> Delhi, India</p>
            <p><strong>Member Since:</strong> January 2024</p>
          </div>
        </div>

        {/* Account Status */}
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}> Account Status</h3>
          <div className={styles.cardContent}>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Access Level:</strong> Manager</p>
            <p><strong>Last Login:</strong> 2 hours ago</p>
            <p><strong>Profile Updated:</strong> 5 days ago</p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}> Activity Summary</h3>
          <div className={styles.cardContent}>
            <p><strong>Assets Added This Month:</strong> 23</p>
            <p><strong>Reports Generated:</strong> 12</p>
            <p><strong>Total Insights:</strong> 1,247</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}> Quick Actions</h3>
          <div className={styles.cardContent}>
            <p>• Updated security settings</p>
            <p>• Added 5 new assets</p>
            <p>• Generated monthly report</p>
            <p>• Enabled notifications</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Link href="/edit-profile" className={styles.editBtn}>Edit Profile</Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}
