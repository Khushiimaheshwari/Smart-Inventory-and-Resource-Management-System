import Sidebar from "./components/Lab_Technician_Sidebar";
// import Navbar from "@/components/Navbar";
import "./lab_technicianDashboard.module.css";

export default function AdminPanelLayout({ children }) {
  return (
    <div className="admin-panel">
      {/* <Navbar /> */}
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "20px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
