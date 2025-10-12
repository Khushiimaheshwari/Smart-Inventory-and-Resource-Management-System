"use client";
import { usePathname } from "next/navigation";
import Providers from "./providers";
import Navbar from "./components/navbar";
import AdminNavbar from "./adminPanel/components/adminNavbar";
import FacultyNavbar from "./facultyPanel/components/facultyNavbar";
import Lab_Technician_Navbar from "./lab_technicianPanel/components/labNavbar";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login", "/signup", "/onboarding", "/unauthorized"];

  const isAdminRoute = pathname.startsWith("/adminPanel");
  const isLabTechnicianRoute = pathname.startsWith("/lab_technicianPanel");
  const isFacultyRoute = pathname.startsWith("/facultyPanel");

  const shouldHideNavbar =
    hideNavbarRoutes.includes(pathname) ||
    isAdminRoute ||
    isLabTechnicianRoute ||
    isFacultyRoute;

  return (
    <html lang="en">
      <body>
        <Providers>
          {!shouldHideNavbar && <Navbar />}

          {/* {isAdminRoute && <AdminNavbar />}
          {isFacultyRoute && <FacultyNavbar />}
          {isLabTechnicianRoute && <Lab_Technician_Navbar />} */}

          {children}
        </Providers>
      </body>
    </html>
  );
}
