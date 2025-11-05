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
          </svg>
        </div>
      </section>

      {/* Challenges Section */}
      <section className={styles.challengesSection}>
        <div className={styles.sectionHeader}>
          <h2>The Challenges We Solve</h2>
          <p>Managing educational labs comes with numerous obstacles</p>
        </div>
        
        <div className={styles.challengesGrid}>
          <div className={styles.challengeCard}>
            <div className={styles.challengeIconWrapper}>
              <div className={styles.challengeIcon}>📦</div>
            </div>
            <h3>Equipment Misplacement</h3>
            <p>Loss and misplacement of valuable lab equipment and PCs due to poor tracking and manual record-keeping systems</p>
          </div>
          
          <div className={styles.challengeCard}>
            <div className={styles.challengeIconWrapper}>
              <div className={styles.challengeIcon}>📋</div>
            </div>
            <h3>Inaccurate Records</h3>
            <p>Outdated and inconsistent data during audits and inspections, leading to compliance issues and financial discrepancies</p>
          </div>
          
          <div className={styles.challengeCard}>
            <div className={styles.challengeIconWrapper}>
              <div className={styles.challengeIcon}>🔄</div>
            </div>
            <h3>Lifecycle Tracking</h3>
            <p>Inability to properly track asset lifecycle including purchase details, maintenance schedules, and depreciation values</p>
          </div>
          
          <div className={styles.challengeCard}>
            <div className={styles.challengeIconWrapper}>
              <div className={styles.challengeIcon}>⚠️</div>
            </div>
            <h3>Accountability Gap</h3>
            <p>Difficulty in assigning and tracking equipment responsibilities among faculty and lab technicians</p>
          </div>
          
          <div className={styles.challengeCard}>
            <div className={styles.challengeIconWrapper}>
              <div className={styles.challengeIcon}>🗂️</div>
            </div>
            <h3>Fragmented Systems</h3>
            <p>Absence of centralized platform for managing timetables, experiments, and subject-lab mappings across departments</p>
          </div>
          
          <div className={styles.challengeCard}>
            <div className={styles.challengeIconWrapper}>
              <div className={styles.challengeIcon}>🤝</div>
            </div>
            <h3>Poor Coordination</h3>
            <p>Inefficient communication and coordination between faculty, lab technicians, and administrative staff</p>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className={styles.solutionsSection}>
        <div className={styles.sectionHeader}>
          <h2>Our Comprehensive Solutions</h2>
          <p>AI-powered features designed to transform lab management</p>
        </div>
        
        <div className={styles.solutionsContainer}>
          <div className={styles.solutionItem}>
            <div className={styles.solutionNumber}>01</div>
            <div className={styles.solutionContent}>
              <h3>Unified Asset Management</h3>
              <p>Centralized platform to manage multiple laboratories with structured asset registration, detailed specifications, serial numbers, purchase history, warranty tracking, and vendor information—all in one place.</p>
            </div>
          </div>

          <div className={styles.solutionItem}>
            <div className={styles.solutionNumber}>02</div>
            <div className={styles.solutionContent}>
              <h3>Smart Maintenance Tracker</h3>
              <p>Automated maintenance scheduling with AMC tracking, warranty alerts, service history, and complaint management to ensure equipment is always in optimal condition.</p>
            </div>
          </div>

          <div className={styles.solutionItem}>
            <div className={styles.solutionNumber}>03</div>
            <div className={styles.solutionContent}>
              <h3>Advanced Analytics Dashboard</h3>
              <p>Comprehensive reports on department-wise lab usage, equipment performance, maintenance summaries, and resource utilization with AI-driven predictive insights.</p>
            </div>
          </div>

          <div className={styles.solutionItem}>
            <div className={styles.solutionNumber}>04</div>
            <div className={styles.solutionContent}>
              <h3>Role-Based Access Control</h3>
              <p>Secure authentication with dedicated dashboards for admins, lab technicians, and faculty. Automated credential management and granular permissions for enhanced security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Benefits Section */}
      <section className={styles.adminSection}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsLeft}>
            <div className={styles.roleIcon}>👨‍💼</div>
            <h2>Benefits for Administrators</h2>
            <p className={styles.roleSubtitle}>Complete control and oversight of all laboratory operations</p>
          </div>
          
          <div className={styles.benefitsRight}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🎛️</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Centralized Dashboard</h4>
                <p>Manage multiple labs, users, and assets from a single unified interface with real-time visibility</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>👥</span>
              </div>
              <div className={styles.benefitText}>
                <h4>User Management</h4>
                <p>Create and manage lab technicians and faculty accounts with automated credential distribution via email</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🔍</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Complete Visibility</h4>
                <p>Track every asset transaction, maintenance activity, and user action with detailed audit trails</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🛡️</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Compliance & Security</h4>
                <p>Ensure data integrity with automated backups, secure authentication, and compliance-ready audit logs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Technician Benefits Section */}
      <section className={styles.technicianSection}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsRight}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>📦</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Asset Management</h4>
                <p>Easily assign, return, and track equipment with unique asset IDs and serial number search functionality</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🔧</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Maintenance Logging</h4>
                <p>Record servicing activities, log complaints, track warranty status, and schedule preventive maintenance</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>⚡</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Quick Issue Resolution</h4>
                <p>Receive instant notifications for equipment issues and respond quickly with streamlined workflows</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>📅</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Timetable Management</h4>
                <p>View and edit lab schedules, manage experiment bookings, and optimize lab utilization efficiently</p>
              </div>
            </div>
          </div>

          <div className={styles.benefitsLeft}>
            <div className={styles.roleIcon}>👨‍🔧</div>
            <h2>Benefits for Lab Technicians</h2>
            <p className={styles.roleSubtitle}>Streamlined operations and efficient lab management tools</p>
          </div>
        </div>
      </section>

      {/* Faculty Benefits Section */}
      <section className={styles.facultySection}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsLeft}>
            <div className={styles.roleIcon}>👨‍🏫</div>
            <h2>Benefits for Faculty</h2>
            <p className={styles.roleSubtitle}>Easy access to lab resources and scheduling information</p>
          </div>
          
          <div className={styles.benefitsRight}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🗓️</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Timetable Access</h4>
                <p>View lab schedules, check availability, and plan experiments according to your teaching requirements</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🔍</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Asset Search & Details</h4>
                <p>Quickly search equipment by serial number or asset ID to check specifications and availability status</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>📝</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Issue Reporting</h4>
                <p>Report equipment malfunctions or request maintenance directly through the platform with photo uploads</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <span className={styles.benefitIcon}>🧪</span>
              </div>
              <div className={styles.benefitText}>
                <h4>Experiment Planning</h4>
                <p>Access experiment guides, check required equipment availability, and coordinate with lab technicians</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.newFooter}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <h3 className={styles.logo}>Lab360°</h3>
            <p>
              AI-powered lab management platform designed for educational institutions.
              Simplify scheduling, asset tracking, and maintenance with transparency.
            </p>
            <div className={styles.socialIcons}>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
              <a href="mailto:info@lab360.com"><i className="fas fa-envelope"></i></a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#demo">Demo</a></li>
                <li><a href="#solutions">Solutions</a></li>
              </ul>
            </div>

            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2025 Lab360 AI. All rights reserved.</p>
          <div className={styles.policyLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}