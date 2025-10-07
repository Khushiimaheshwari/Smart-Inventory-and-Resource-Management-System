import Sidebar from "./components/Admin_Sidebar";
import AdminNavbar from "./components/adminNavbar"; // ✅ import your admin navbar


export default function AdminPanelLayout({ children }) {
  return (
    <div className="admin-panel">
      {/* ✅ Top Navbar visible on every page */}
      <AdminNavbar />

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
