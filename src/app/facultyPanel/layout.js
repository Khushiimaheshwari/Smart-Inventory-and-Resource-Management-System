// app/facultyPanel/layout.js
"use client";  

import Sidebar from "./components/Faculty_Sidebar.js";
import FacultyNavbar from "./components/facultyNavbar.js";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

export default function FacultyPanelLayout({ children }) {

  // const token = cookies().get("token")?.value;

  // if (!token) {
  //   redirect("/login");
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   console.log("Decoded Token in Faculty Layout:", decoded);
    
  //   if (decoded.role !== "faculty") {
  //     redirect("/unauthorized");
  //   }
  // } catch (err) {
  //   redirect("/login");
  // }
  
  return (
    <div className="faculty-panel">
      <FacultyNavbar />

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
