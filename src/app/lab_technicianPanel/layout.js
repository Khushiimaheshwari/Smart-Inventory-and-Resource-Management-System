// app/facultyPanel/layout.js
"use client";  

import Sidebar from "./components/Lab_Technician_Sidebar.js";
import Lab_Technician_Navbar from "./components/labNavbar.js";

export default function FacultyPanelLayout({ children }) {
  return (
    <div className="faculty-panel">
    
      <Lab_Technician_Navbar />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* ✅ Left Sidebar */}
        <Sidebar />

        {/* ✅ Main Content Area */}
        <main style={{ flex: 1, padding: "20px", backgroundColor: "#f9fafb" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
