"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./styles/home.module.css";
import './styles/globals.css'

export default function Home() {
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const targets = [15000, 500, 2, 99.9];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    targets.forEach((target, index) => {
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = current;
          return newCounters;
        });
      }, stepDuration);
    });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      console.log(res);

      if (res.ok) {
        console.log("Logged out Successfully");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>Lab360°</h1>
          <h3>All-in-One Lab Management Platform.</h3>
          <p>
            Simplify laboratory scheduling, equipment tracking, and maintenance with AI-powered analytics and QR-based transparency.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Get Started</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className={styles.heroImage}>
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#e8f5f0', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#e1f3f8', stopOpacity:1}} />
              </linearGradient>
              
              <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00c97b', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#00b8d9', stopOpacity:1}} />
              </linearGradient>
              
              <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.9}} />
                <stop offset="100%" style={{stopColor:'#f0f9ff', stopOpacity:0.9}} />
              </linearGradient>
              
              <filter id="shadow">
                <feDropShadow dx="0" dy="10" stdDeviation="20" floodColor="#00c97b" floodOpacity="0.2"/>
              </filter>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <circle cx="250" cy="250" r="240" fill="url(#bgGradient)" opacity="0.5"/>
            
            <circle cx="100" cy="120" r="40" fill="#00c97b" opacity="0.15">
              <animate attributeName="cy" values="120;100;120" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="400" cy="380" r="60" fill="#00b8d9" opacity="0.15">
              <animate attributeName="cy" values="380;400;380" dur="4s" repeatCount="indefinite"/>
            </circle>
            
            <g filter="url(#shadow)">
              <rect x="100" y="120" width="300" height="260" rx="20" fill="url(#cardGradient)" stroke="#00c97b" strokeWidth="2"/>
              
              <rect x="100" y="120" width="300" height="50" rx="20" fill="url(#mainGradient)" opacity="0.1"/>
              <circle cx="125" cy="145" r="8" fill="#ff5f57"/>
              <circle cx="150" cy="145" r="8" fill="#ffbd2e"/>
              <circle cx="175" cy="145" r="8" fill="#28ca42"/>
              <text x="200" y="150" fontFamily="Arial, sans-serif" fontSize="14" fill="#1d2b36" fontWeight="600">Asset Dashboard</text>
              
              <rect x="130" y="280" width="30" height="70" rx="5" fill="url(#mainGradient)" opacity="0.8">
                <animate attributeName="height" values="70;85;70" dur="2s" repeatCount="indefinite"/>
              </rect>
              <rect x="175" y="250" width="30" height="100" rx="5" fill="url(#mainGradient)" opacity="0.85">
                <animate attributeName="height" values="100;115;100" dur="2.5s" repeatCount="indefinite"/>
              </rect>
              <rect x="220" y="270" width="30" height="80" rx="5" fill="url(#mainGradient)" opacity="0.75">
                <animate attributeName="height" values="80;95;80" dur="2.2s" repeatCount="indefinite"/>
              </rect>
              <rect x="265" y="240" width="30" height="110" rx="5" fill="url(#mainGradient)" opacity="0.9">
                <animate attributeName="height" values="110;125;110" dur="2.8s" repeatCount="indefinite"/>
              </rect>
              <rect x="310" y="260" width="30" height="90" rx="5" fill="url(#mainGradient)" opacity="0.8">
                <animate attributeName="height" values="90;105;90" dur="2.3s" repeatCount="indefinite"/>
              </rect>
              
              <g>
                <rect x="130" y="200" width="70" height="40" rx="8" fill="#00c97b" opacity="0.2"/>
                <text x="140" y="218" fontFamily="Arial, sans-serif" fontSize="12" fill="#00c97b" fontWeight="700">10K+</text>
                <text x="140" y="232" fontFamily="Arial, sans-serif" fontSize="9" fill="#666">Assets</text>
              </g>
              
              <g>
                <rect x="215" y="200" width="70" height="40" rx="8" fill="#00b8d9" opacity="0.2"/>
                <text x="225" y="218" fontFamily="Arial, sans-serif" fontSize="12" fill="#00b8d9" fontWeight="700">99.9%</text>
                <text x="225" y="232" fontFamily="Arial, sans-serif" fontSize="9" fill="#666">Uptime</text>
              </g>
              
              <g>
                <rect x="300" y="200" width="70" height="40" rx="8" fill="#1AAE92" opacity="0.2"/>
                <text x="310" y="218" fontFamily="Arial, sans-serif" fontSize="12" fill="#1AAE92" fontWeight="700">500M</text>
                <text x="310" y="232" fontFamily="Arial, sans-serif" fontSize="9" fill="#666">Tracked</text>
              </g>
            </g>
            
            <g filter="url(#glow)">
              <circle cx="80" cy="250" r="25" fill="url(#mainGradient)" opacity="0.8">
                <animate attributeName="cy" values="250;240;250" dur="3s" repeatCount="indefinite"/>
              </circle>
              <text x="68" y="260" fontSize="24">☁️</text>
              
              <circle cx="420" cy="200" r="25" fill="url(#mainGradient)" opacity="0.8">
                <animate attributeName="cy" values="200;190;200" dur="3.5s" repeatCount="indefinite"/>
              </circle>
              <text x="408" y="210" fontSize="24">🔒</text>
              
              <circle cx="430" cy="300" r="25" fill="url(#mainGradient)" opacity="0.8">
                <animate attributeName="cy" values="300;310;300" dur="4s" repeatCount="indefinite"/>
              </circle>
              <text x="418" y="310" fontSize="24">📊</text>
            </g>
            
            <line x1="105" y1="250" x2="130" y2="240" stroke="url(#mainGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
            </line>
            <line x1="370" y1="240" x2="395" y2="200" stroke="url(#mainGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
            </line>
            <line x1="370" y1="310" x2="405" y2="300" stroke="url(#mainGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
            </line>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Powerful Features</h2>
          <p>Everything you need to manage your assets efficiently</p>
        </div>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Real-Time Tracking</h3>
            <p>Monitor all your assets in real-time with live updates and notifications</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security to keep your data safe and protected</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Analytics & Insights</h3>
            <p>Get detailed reports and analytics to make informed decisions</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Automation</h3>
            <p>Automate repetitive tasks and save time with smart workflows</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌐</div>
            <h3>Cloud Integration</h3>
            <p>Seamlessly integrate with popular cloud platforms and services</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3>Team Collaboration</h3>
            <p>Work together with your team with shared access and permissions</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
          <p>Get started in three simple steps</p>
        </div>
        
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Sign Up & Setup</h3>
              <p>Create your account and configure your workspace in minutes</p>
            </div>
          </div>
          
          <div className={styles.stepConnector}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Add Your Assets</h3>
              <p>Import or manually add your digital and physical assets to the platform</p>
            </div>
          </div>
          
          <div className={styles.stepConnector}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Track & Optimize</h3>
              <p>Monitor, analyze, and optimize your assets with powerful tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section ref={statsRef} className={styles.statsSection}>
        <div className={styles.sectionHeader}>
          <h2>Trusted by Thousands</h2>
          <p>Real numbers from real companies</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🚀</div>
            <div className={styles.statNumber}>
              <span className={styles.countUp}>{Math.floor(counters[0]).toLocaleString()}</span>
              <span className={styles.plus}>+</span>
            </div>
            <div className={styles.statLabel}>Active Users</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💼</div>
            <div className={styles.statNumber}>
              <span className={styles.countUp}>{Math.floor(counters[1]).toLocaleString()}</span>
              <span className={styles.plus}>+</span>
            </div>
            <div className={styles.statLabel}>Companies Trust Us</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statNumber}>
              <span className={styles.countUp}>{counters[2].toFixed(1)}</span>
              <span className={styles.plus}>M+</span>
            </div>
            <div className={styles.statLabel}>Assets Managed</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⚡</div>
            <div className={styles.statNumber}>
              <span className={styles.countUp}>{counters[3].toFixed(1)}</span>
              <span className={styles.plus}>%</span>
            </div>
            <div className={styles.statLabel}>Uptime Guarantee</div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 Lab360. All rights reserved.</p>
      </footer>
    </div>
  );
}