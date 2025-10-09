"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from 'lucide-react';

export default function LabTechnicianManagement() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const dropdownRef = useRef(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    labAccess: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/getlabTechnicians");

        if(!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(
          data.technicians.map(t => ({
            id: t._id,
            name: t.Name,
            email: t.Email,
            phoneNumber: t.PhoneNumber,
            profileImage: t.ProfileImage,
            location: t.Location,
            status: t.AccountStatus,
            labAccess: t.Labs?.map(lab => lab.Lab_Name),
          }))
        );
        console.log(data);
        
      }catch (err) {
        console.error("Fetch Users Error:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/addLabTechnician", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      setUsers([
        ...users,
        {
          id: users.length + 1,
          name: newUser.name,
          email: newUser.email,
        },
      ]);

      alert("Lab Technician added successfully!");
      setShowAddModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        labAccess: [],
      });
    } catch (err) {
      console.error("Add Technician Error:", err);
      alert("Something went wrong while adding user.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
    setNewUser(user);
  };

  const handleUpdateUser = () => {
    setUsers(users.map((u) => (u.id === editingUser.id ? newUser : u)));
    setShowAddModal(false);
    setEditingUser(null);
    setNewUser({
      name: "",
      email: "",
      password: "",
      labAccess: [],
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const allLabs = ["Lab 1", "Lab 2", "Lab 3", "Lab 4"];

  const handleLabSelect = (lab) => {
    if (lab === "No Lab Access") {
      setNewUser((prev) => ({
        ...prev,
        labAccess: [],
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        labAccess: prev.labAccess.includes(lab)
          ? prev.labAccess.filter((l) => l !== lab)
          : [...prev.labAccess, lab],
      }));
    }
  };

  const handleRemoveLab = (labToRemove) => {
    setNewUser((prev) => ({
      ...prev,
      labAccess: prev.labAccess.filter((lab) => lab !== labToRemove),
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  console.log(users);

  const styles = {
    container: {
      width: 'calc(100% - 220px)', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      boxSizing: 'border-box',
      marginLeft: '245px',
      overflowX: 'hidden',
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    headerTitle: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#2d3748",
      margin: 0,
    },
    addButton: {
      padding: "10px 24px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      transition: "all 0.2s ease",
    },
    noUsersText: {
      color: "#555", 
      fontSize: "1.1rem",
      fontWeight: 500,
      textAlign: "center",
    },
    cardContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",     
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap",
    },
    cardLeft: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      flex: "1",
      minWidth: "250px",
    },
    profileImage: {
      width: "48px",
      height: "48px",
      borderRadius: "8px",
      objectFit: "cover",
      background: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      color: "#6b7280",
    },
    cardInfo: {
      flex: "1",
    },
    cardName: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#1f2937",
      margin: "0 0 4px 0",
    },
    cardEmail: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    cardRight: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
    },
    cardPrice: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#1f2937",
      margin: 0,
    },
    cardStock: {
      fontSize: "13px",
      color: "#6b7280",
      margin: 0,
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
    },
    statusApproved: {
      background: "#d1fae5",
      color: "#065f46",
    },
    statusRejected: {
      background: "#fee2e2",
      color: "#991b1b",
    },
    statusPending: {
      background: "#fef3c7",
      color: "#92400e",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    iconButton: {
      width: "36px",
      height: "36px",
      background: "transparent",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    editButton: {
      color: "#10b981",
    },
    deleteButton: {
      color: "#ef4444",
    },
    expandButton: {
      background: "#f3f4f6",
      color: "#4b5563",
      transition: "all 0.2s ease",
    },
    expandedContent: {
      marginTop: "1.5rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #e5e7eb",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1.25rem",
      marginBottom: "1.5rem",
    },
    infoBlock: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "1rem",
      background: "#f9fafb",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    infoLabel: {
      fontSize: "12px",
      color: "#6b7280",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
    },
    infoValue: {
      fontSize: "15px",
      color: "#1f2937",
      fontWeight: 600,
      marginTop: "2px",
    },
    labAccessSection: {
      padding: "1.25rem",
      background: "#f0fdf4",
      borderRadius: "8px",
      border: "1px solid #d1fae5",
    },
    labAccessLabel: {
      fontSize: "13px",
      color: "#065f46",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    labCount: {
      marginLeft: "auto",
      fontSize: "12px",
      padding: "2px 10px",
      background: "#10b981",
      color: "white",
      borderRadius: "12px",
      fontWeight: 700,
    },
    labChipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    labChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 14px",
      background: "white",
      color: "#059669",
      border: "1.5px solid #10b981",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
      transition: "all 0.2s ease",
    },
    noLabChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 14px",
      background: "#fef2f2",
      color: "#dc2626",
      border: "1.5px solid #fecaca",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "white",
      borderRadius: "12px",
      padding: "30px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    modalHeader: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    cancelButton: {
      flex: 1,
      padding: "12px",
      background: "white",
      color: "#718096",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px",
    },
    saveButton: {
      flex: 1,
      padding: "12px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600,
    },
    badgeAdmin: {
      background: "rgba(0, 201, 123, 0.1)",
      color: "#00c97b",
    },
    badgeManager: {
      background: "rgba(0, 184, 217, 0.1)",
      color: "#00b8d9",
    },
    badgeViewer: {
      background: "rgba(246, 173, 85, 0.1)",
      color: "#f6ad55",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    generateButton: {
      padding: "8px",
      background: "transparent",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    passwordFormGroup: {
      display: "flex",
      alignItems: "center", 
      marginBottom: "20px",
      gap: "10px",
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      background: "white",
    },
    accessSection: {
      marginTop: "24px",
    },
    accessTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "16px",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      padding: "12px",
      background: "#f8fafb",
      borderRadius: "8px",
      marginBottom: "8px",
      cursor: "pointer",
    },
    checkbox: {
      width: "20px",
      height: "20px",
      marginRight: "12px",
      cursor: "pointer",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    cancelButton: {
      flex: 1,
      padding: "12px",
      background: "white",
      color: "#718096",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px",
    },
    saveButton: {
      flex: 1,
      padding: "12px",
      background: "linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px",
    },
    accessSection: {
      marginTop: '1rem',
      position: 'relative',
    },
    accessTitle: {
      fontWeight: '600',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
    },
    selectorContainer: {
      position: 'relative',
      width: '100%',
    },
    inputArea: {
      width: '96%',
      minHeight: '42px',
      padding: '2px 12px',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      alignItems: 'center',
    },
    inputAreaFocused: {
      borderColor: '#14b8a6',
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)',
    },
    placeholder: {
      color: '#999',
      fontSize: '14px',
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: '#14b8a6',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '500',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      opacity: '0.8',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      marginTop: '4px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '6px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000,
    },
    dropdownItem: {
      padding: '10px 12px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#333',
      transition: 'background-color 0.15s',
    },
    dropdownItemHover: {
      backgroundColor: '#f5f5f5',
    },
    dropdownItemSelected: {
      backgroundColor: '#e6f7f5',
      color: '#14b8a6',
      fontWeight: '500',
    },
    noAccessItem: {
      borderBottom: '1px solid #eee',
      color: '#666',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Lab Technician Management</h1>
        <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New
        </button>
      </header>

      {/* Card List */}
      <div style={styles.cardContainer}>
        {users && users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <div style={styles.profileImage}>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardName}>{user.name}</h3>
                    <p style={styles.cardEmail}>by {user.email}</p>
                  </div>
                </div>

                <div style={styles.cardRight}>
                  <div style={{ textAlign: "right" }}>
                    <p style={styles.cardStock}>
                      {user.labAccess && user.labAccess.length > 0
                        ? user.labAccess.join(", ")
                        : "No Labs"}
                    </p>
                  </div>

                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(user.status === "active"
                        ? styles.statusApproved
                        : user.status === "inactive"
                        ? styles.statusRejected
                        : styles.statusPending),
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      {user.status === "active" ? (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                    {(user.status).charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>

                  <div style={styles.actionButtons}>
                    <button
                      style={{ ...styles.iconButton, ...styles.editButton }}
                      onClick={() => handleEditUser(user)}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      style={{ ...styles.iconButton, ...styles.deleteButton }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      style={{
                        ...styles.iconButton,
                        ...styles.expandButton,
                        transform: expandedCard === user.id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      onClick={() => setExpandedCard(expandedCard === user.id ? null : user.id)}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedCard === user.id && (
                <div style={styles.expandedContent}>
                  <div style={styles.detailsGrid}>
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Phone 
                      </span>
                      <span style={styles.infoValue}>{user.phoneNumber || "Not provided"}</span>
                    </div>
                    
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Location
                      </span>
                      <span style={styles.infoValue}>{user.location || "Not specified"}</span>
                    </div>
                    
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Status
                      </span>
                      <span style={styles.infoValue}>
                        {(user.status).charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div style={styles.labAccessSection}>
                    <span style={styles.labAccessLabel}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      Lab Access
                      <span style={styles.labCount}>
                        {user.labAccess && user.labAccess.length > 0 ? user.labAccess.length : 0} lab{user.labAccess && user.labAccess.length !== 1 ? 's' : ''}
                      </span>
                    </span>
                    
                    <div style={styles.labChipsContainer}>
                      {user.labAccess && user.labAccess.length > 0 ? (
                        user.labAccess.map((lab, index) => (
                          <span key={index} style={styles.labChip}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {lab}
                          </span>
                        ))
                      ) : (
                        <span style={styles.noLabChip}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                          No lab access assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noUsersMessage}>No users found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
     {showAddModal && (
        <div
          style={styles.modal}
          onClick={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalHeader}>
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                style={styles.input}
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                style={styles.input}
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordFormGroup}>
                <input
                  type="text"
                  style={styles.input}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
                <button
                  style={styles.generateButton}
                >
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-label="Generate icon"
                    role="img">

                    <path d="M3 13.5V17h3.5l9-9-3.5-3.5-9 9z" fill="currentColor" opacity="0.25"/>
                    <path d="M10.5 6.5l-7 7V17h1.5l7-7-1-1z" fill="currentColor"/>
                    <path d="M12.7 4.3l1-1 1.0 1.0-1 1-1-1z" fill="currentColor" opacity="0.6"/>

                    <path d="M15 5l2-2 1 1-2 2-1-1z" fill="currentColor" opacity="0.8"/>
                    <path d="M12 8l-2 2-1-1 2-2 1 1z" fill="currentColor" opacity="0.6"/>

                    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-opacity="0.15" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={styles.accessSection} ref={dropdownRef}>
              <div style={styles.accessTitle}>Lab Access</div>
              
              <div style={styles.selectorContainer}>
                <div
                  style={{
                    ...styles.inputArea,
                    ...(isDropdownOpen ? styles.inputAreaFocused : {}),
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {newUser.labAccess.length === 0 ? (
                    <span style={styles.placeholder}>Select lab access</span>
                  ) : (
                    newUser.labAccess.map((lab) => (
                      <div key={lab} style={styles.chip}>
                        <span>{lab}</span>
                        <button
                          style={styles.removeButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLab(lab);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {isDropdownOpen && (
                  <div style={styles.dropdown}>
                    <div
                      style={{
                        ...styles.dropdownItem,
                        ...styles.noAccessItem,
                        ...(newUser.labAccess.length === 0 ? styles.dropdownItemSelected : {}),
                      }}
                      onClick={() => handleLabSelect("No Lab Access")}
                      onMouseEnter={(e) => {
                        if (newUser.labAccess.length !== 0) {
                          e.currentTarget.style.backgroundColor = styles.dropdownItemHover.backgroundColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newUser.labAccess.length !== 0) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      No Lab Access
                    </div>

                    {allLabs.map((lab) => {
                      const isSelected = newUser.labAccess.includes(lab);
                      return (
                        <div
                          key={lab}
                          style={{
                            ...styles.dropdownItem,
                            ...(isSelected ? styles.dropdownItemSelected : {}),
                          }}
                          onClick={() => handleLabSelect(lab)}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = styles.dropdownItemHover.backgroundColor;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {lab} {isSelected && '✓'}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <strong>Selected Labs:</strong>{' '}
                {newUser.labAccess.length > 0 ? newUser.labAccess.join(', ') : 'None'}
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
              <button
                style={styles.saveButton}
                onClick={editingUser ? handleUpdateUser : handleAddUser}
              >
                {editingUser ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}