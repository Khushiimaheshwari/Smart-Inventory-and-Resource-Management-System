"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function QrRedirectPage({ searchParams }) {
  const { data: session } = useSession();
  const data = searchParams.data;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!data || !session) return;

    try {
      const qrPayload = JSON.parse(atob(data));

      const role = session.user.role;

      let redirectUrl = "";

      if (role === "admin") redirectUrl = qrPayload.admin;
      else if (role === "faculty") redirectUrl = qrPayload.faculty;
      else if (role === "lab_technician") redirectUrl = qrPayload.lab_technician;
      else {
        alert("Invalid role");
        return;
      }

      window.location.href = redirectUrl;

    } catch (err) {
      console.error("QR decode error:", err);
      alert("Invalid QR code!");
    }
  }, [data, session]);

  const styles = {
    container: {
      width: isMobile ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: isMobile ? '0' : '255px',
      overflowX: 'hidden',
    },
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f9fafb',
      flexDirection: 'column',
      gap: '1rem',
    },
    loaderText: {
      color: '#6b7280',
      fontSize: '16px',
      fontWeight: '500',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.loaderContainer}>
        <Loader2 size={48} className="animate-spin" color="#10b981" />
        <p style={styles.loaderText}>Redirecting...</p>
      </div>
    </div>
  );
}
