// app/layout.js
"use client";
import Navbar from "./components/navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // jin pages pr navbar nahi chahiye
  const hideNavbarRoutes = ["/login", "/signup", "/onboarding"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        {!shouldHideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
