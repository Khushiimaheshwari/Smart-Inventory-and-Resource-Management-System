// app/layout.js
"use client";
import Navbar from "./components/navbar";
import { usePathname } from "next/navigation";
import Providers from "./providers";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/adminPanel");
  
  const hideNavbarRoutes = ["/login", "/signup", "/onboarding"];
  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) || pathname.startsWith("/adminPanel");

  return (
    <html lang="en">
      <body>
        <Providers>
          {!shouldHideNavbar && (
            isAdminRoute ? <AdminNavbar /> : <Navbar />
          )}          
          {children}
        </Providers>  
      </body>
    </html>
  );
}
