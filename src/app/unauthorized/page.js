"use client";

import React from 'react';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  const handleGoToHome = () => {
    window.location.href = '/';
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '2rem',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '48px',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      textAlign: 'center',
      border: '2px solid rgba(0, 0, 0, 0.05)',
      position: 'relative',
      zIndex: 10
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100px',
      height: '100px',
      margin: '0 auto 24px',
      background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
      borderRadius: '50%',
      border: '3px solid rgba(251, 113, 133, 0.3)',
      position: 'relative'
    },
    heading: {
      fontSize: '32px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #fb7185 0%, #8b5cf6 50%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '12px'
    },
    text: {
      fontSize: '16px',
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '32px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexDirection: 'column',
      width: '100%'
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #fb7185 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
      width: '100%'
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '14px 28px',
      background: 'white',
      color: '#8b5cf6',
      border: '2px solid #c4b5fd',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%'
    },
    decorativeCircle1: {
      position: 'absolute',
      top: '10%',
      right: '15%',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0
    },
    decorativeCircle2: {
      position: 'absolute',
      bottom: '15%',
      left: '10%',
      width: '250px',
      height: '250px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0
    },
    decorativeCircle3: {
      position: 'absolute',
      top: '50%',
      left: '5%',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, rgba(251, 113, 133, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0
    },
    decorativeCircle4: {
      position: 'absolute',
      bottom: '25%',
      right: '8%',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.decorativeCircle1}></div>
      <div style={styles.decorativeCircle2}></div>
      <div style={styles.decorativeCircle3}></div>
      <div style={styles.decorativeCircle4}></div>
      
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <ShieldAlert size={48} color="#fb7185" strokeWidth={2.5} />
        </div>
        
        <h1 style={styles.heading}>Access Denied</h1>
        <p style={styles.text}>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={handleGoToLogin}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
            }}
          >
            <LogIn size={20} />
            Go to Login
          </button>
          
          <button
            style={styles.secondaryButton}
            onClick={handleGoToHome}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(139, 92, 246, 0.05)';
              e.target.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#c4b5fd';
            }}
          >
            <Home size={20} />
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}