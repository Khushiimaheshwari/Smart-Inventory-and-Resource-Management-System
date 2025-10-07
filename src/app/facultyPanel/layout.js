// // app/facultyPanel/layout.js
// "use client";  // ✅ This is required

// import Sidebar from "./components/Faculty_Sidebar.js";
// import AdminNavbar from "./components/facultyNavbar.js";

// export default function FacultyPanelLayout({ children }) {
//   return (
//     <div className="faculty-panel">
//       {/* ✅ Top Navbar visible on every page */}
//       <AdminNavbar />

//       <div style={{ display: "flex", minHeight: "100vh" }}>
//         {/* ✅ Left Sidebar */}
//         <Sidebar />

//         {/* ✅ Main Content Area */}
//         <main style={{ flex: 1, padding: "20px", backgroundColor: "#f9fafb" }}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
