import Sidebar from "./components/Faculty_Sidebar";
// import Navbar from "@/components/Navbar";
import "./adminDashboard.module.css";

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
