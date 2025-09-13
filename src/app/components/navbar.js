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

      {/* Navigation Links */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/features">Features</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      {/* Right Side: Login + Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/signup">
          <button className={styles.loginBtn}>Login
            /Signup</button>
        </Link>

        <Link href="/profile">
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

      {/* Mobile Hamburger */}
      <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>
    </nav>
  );
}
