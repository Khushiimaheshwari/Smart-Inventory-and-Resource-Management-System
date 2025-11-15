"use client";  

import { useState } from "react";
import Sidebar from "./components/Faculty_Sidebar.js";
import styles from "./FacultyLayout.module.css"
import FacultyNavbar from "./components/facultyNavbar.js";
import { SessionContext } from "../../context/SessionContext.js";
import './styles/globals.css';

export default function FacultyPanelLayout({ children, session }) {

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
          <FacultyNavbar onToggleSidebar={toggleSidebar} session={session}/>

          {/* Page Content */}
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </div>
    </SessionContext.Provider>
  );
}
