"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RedirectAfterLogin() {
  const { data: session, status } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    const checkUserStatus = async () => {
      if (!session) {
        router.push("/login");
        return;
      }

      const userRes = await fetch("/api/auth/userDetails");
      const { user } = await userRes.json();

      const needsOnboarding =
        !user.PhoneNumber ||
        !user.ProfileImage ||
        !user.Location;

      if (needsOnboarding) {
        router.push("/onboarding");
        return;
      }

      const role = user.Role;

      if (role === "admin") router.push("/adminPanel");
      else if (role === "lab_technician") router.push("/lab_technicianPanel");
      else if (role === "faculty") router.push("/facultyPanel");
      else router.push("/login");
    };

    checkUserStatus();
  }, [session, status, router]);

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
