// app/layout.js
"use client";
import Navbar from "./components/navbar";
import AdminNavbar from "./components/adminNavbar";
import { usePathname } from "next/navigation";
import Providers from "./providers";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const adminRoutes = ["/admin", "/user-manage", "/asset-manage","/lab-manage"];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  const hideNavbarRoutes = ["/login", "/signup", "/onboarding"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

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
