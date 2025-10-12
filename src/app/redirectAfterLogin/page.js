"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectAfterLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 

    if (!session) {
      alert("No active session found, redirecting to login.");
      window.location.href("/login");
      return;
    }

    const role = session?.user?.role;

    if (role === "admin") {
      window.location.href = "/adminPanel";
    } else if (role === "lab_technician") {
      window.location.href = "/lab_technicianPanel";
    } else if (role === "faculty") {
      window.location.href = "/facultyPanel";
    }else {
      router.push("/login");
    }
  }, [session, status, router]);

  return <p className="text-center mt-8 text-gray-600">Redirecting...</p>;
}
