"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./adminNavbar.module.css";

export default function AdminNavbar({ onToggleSidebar }) {
  return (
    <nav className={styles.navbar}>
      {/* Hamburger Menu Button */}
      <button 
        className={styles.hamburgerBtn} 
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>

      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/adminPanel">
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
        <Link href="/adminPanel/profile">
          <div className={styles.profileLink}>
            <Image
              src="/profile.png"
              alt="Profile"
              width={40}
              height={40}
              className={styles.profileImg}
            />
          </div>
        </Link>
      </div>
    </nav>
  );
}