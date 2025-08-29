"use client";

import Link from "next/link";

export default function Home() {

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
    <div>
      <h1>Welcome to Smart Inventory System</h1>
      <Link href="/login">Go to Login</Link> <br />
      <Link href="/signup">Go to Signup</Link> <br />
       <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
