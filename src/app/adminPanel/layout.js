"use client";

import { useState } from "react";
import Sidebar from "./components/Admin_Sidebar.js";
import AdminNavbar from "./components/adminNavbar.js";
import styles from "./AdminLayout.module.css";


export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Navbar */}
        <AdminNavbar onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}