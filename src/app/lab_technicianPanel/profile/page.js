"use client";

import Link from "next/link";
import styles from "./profile.module.css";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (session) {
        await signOut({ callbackUrl: "/login" });
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
      }
      
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          credentials: "include", 
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch profile");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>No user data found</p>;

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <img
          src={user.ProfileImage}
          alt="Profile"
          width={140}
          height={140}
          className={styles.avatar}
        />
        <h1 className={styles.userName}>{user.Name}</h1>
        <p className={styles.userEmail}>{user.Email}</p>
      </div>

      {/* Profile Cards Grid */}
      <div className={styles.profileGrid}>
        {/* Personal Information */}
        <div className={`${styles.profileCard} ${styles.personalInfo}`}>
          <h3 className={styles.cardTitle}> Personal Information</h3>
          <div className={styles.cardContent}>
            <p><strong>Full Name: </strong>{user.Name}</p>
            <p><strong>Phone: </strong>{user.PhoneNumber}</p>
            <p><strong>Location: </strong>{user.Location}</p>
            <p><strong>Member Since: </strong>{new Date(user.createdAt).toDateString()}</p>
          </div>
        </div>

        {/* Account Status */}
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}> Account Status</h3>
          <div className={styles.cardContent}>
            <p><strong>Status: </strong> Active</p>
            <p><strong>Access Level: </strong> Manager</p>
            <p><strong>Last Login: </strong> 2 hours ago</p>
            <p><strong>Profile Updated: </strong> 5 days ago</p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}> Activity Summary</h3>
          <div className={styles.cardContent}>
            <p><strong>Assets Added This Month: </strong> 23</p>
            <p><strong>Reports Generated: </strong> 12</p>
            <p><strong>Total Insights: </strong> 1,247</p>
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
