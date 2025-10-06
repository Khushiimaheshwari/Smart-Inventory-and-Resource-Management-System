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
      router.push("/login");
      return;
    }

    const role = session?.user?.role;

    if (role === "admin") {
      router.push("/adminPanel");
    } else if (role === "lab_technician") {
      router.push("/lab_technicianPanel");
    } else {
      router.push("/facultyPanel");
    }
  }, [session, status, router]);

  return <p className="text-center mt-8 text-gray-600">Redirecting...</p>;
}
