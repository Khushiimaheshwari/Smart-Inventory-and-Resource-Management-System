"use client";  

import { useState } from "react";
import Sidebar from "./components/Lab_Technician_Sidebar";
import styles from "./TechnicianLayout.module.css"
import Lab_Technician_Navbar from "./components/labNavbar.js";
import { SessionContext } from "../../context/SessionContext.js";
import './styles/globals.css';

export default function TechnicianPanelLayout({ children, session }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <SessionContext.Provider value={session}>
      <div className={styles.adminContainer}>
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Navbar */}
          <Lab_Technician_Navbar onToggleSidebar={toggleSidebar} session={session}/>

          {/* Page Content */}
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </div>
    </SessionContext.Provider>
  );
}
