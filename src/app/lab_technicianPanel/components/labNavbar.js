"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./labNavbar.module.css";

export default function Lab_Technician_Navbar({ onToggleSidebar, session }) {
  const [profilePic, setProfilePic] = useState("/profile.png");

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const res = await fetch("/api/auth/profilePic");

        const data = await res.json();
        console.log(data);

        if (res.ok && data.profileImage) {
          setProfilePic(data.profileImage);
        }
      } catch (err) {
        console.error("Error fetching profile pic:", err);
      }
    };
    fetchProfilePic();
  }, []);

  return (
    <nav className={styles.navbar}>
      {/* Logo - Left Side */}
      <div className={styles.logo}>
        <Link href="/lab_technicianPanel">
          <Image
            src="/logo.png"
            alt="Lab360 Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className={styles.desktopActions}>
        {/* Notification Button */}
        <button className={styles.notificationBtn}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Profile Link */}
        <Link href="/lab_technicianPanel/profile">
          <div className={styles.profileLink}>
            <Image
              src={profilePic || "/profile.png"}
              alt="Profile"
              width={40}
              height={40}
              className={styles.profileImg}
              unoptimized
            />
          </div>
        </Link>

        {/* Hamburger Menu Button - Mobile Only */}
        <button 
          className={styles.hamburgerBtn} 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>
    </nav>
  );
}