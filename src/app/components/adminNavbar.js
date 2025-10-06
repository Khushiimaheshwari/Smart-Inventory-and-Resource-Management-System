"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/logo.jpg"
            alt="Asserta Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      

      {/* Desktop Right Side: Login + Profile */}
      <div className={styles.desktopActions}>
         <button
  style={{
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    border: "none",
    background: "rgba(0, 201, 123, 0.1)",
    color: "#00c97b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(0, 201, 123, 0.2)";
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(0, 201, 123, 0.1)";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
</button>

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

      {/* Mobile Hamburger Button */}
      <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>

      {/* Mobile Menu */}
      <ul className={`${styles.mobileNavLinks} ${menuOpen ? styles.active : ""}`}>
        <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        
        <li><Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
      </ul>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}