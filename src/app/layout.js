// app/layout.js
"use client";
import Navbar from "./components/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // ✅ Hide Navbar for these routes
  const hideNavbarRoutes = ["/login", "/signup", "/onboarding"];
  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) || pathname.startsWith("/adminPanel");

  return (
    <html lang="en">
      <body>
        {/* ✅ Show Navbar only if not in hidden routes */}
        {!shouldHideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
