import Image from "next/image";
import styles from "./styles/home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Image src="/logo.jpg" alt="Asserta Logo" width={120} height={100} />
          
        </div>
        <ul className={styles.navLinks}>
          <li>About</li>
          <li>Features</li>
          <li>Contact</li>
          <li>
            <Link href="/signup">
              <button className={styles.loginBtn}>Login / Signup</button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>Asserta</h1>
          <h3>Your Assets, Always in Sight .</h3>
          <p>
            Transform the way you track, manage, and optimize your digital and physical assets with intelligent automation and real-time insights.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Get Started</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.circle}></div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Asserta. All rights reserved.</p>
      </footer>
    </div>
  );
}
