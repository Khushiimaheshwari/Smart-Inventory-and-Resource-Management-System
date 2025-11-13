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
        await signOut({ redirect: false });
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
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
          console.log(data.user);
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
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{user.Name}</h1>
          <p className={styles.userEmail}>{user.Email}</p>
        </div>
      </div>

      {/* Single Profile Card */}
      <div className={styles.singleCardContainer}>
        <div className={styles.profileCard}>
          <h3 className={styles.cardTitle}>👤 Profile Information</h3>
          <div className={styles.cardContent}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Full Name:</span>
              <span className={styles.infoValue}>{user.Name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.Email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone:</span>
              <span className={styles.infoValue}>{user.PhoneNumber}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Location:</span>
              <span className={styles.infoValue}>{user.Location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Member Since:</span>
              <span className={styles.infoValue}>
                {new Date(user.createdAt).toDateString()}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Login:</span>
              <span className={styles.infoValue}>2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Link href="/edit-profile" className={styles.editBtn}>
          Edit Profile
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}