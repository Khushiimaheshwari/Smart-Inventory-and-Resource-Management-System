"use client";

import { useState, useRef, useEffect } from "react";
import { X } from 'lucide-react';

export default function LabTechnicianManagement() {
  const [users, setUsers] = useState([
    // id,
    // name,
    // email,
    // phoneNumber,
    // profileImage,
    // location,
    // status,
    // labAccess,
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        console.log(res);

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
      width: 'calc(100% - 288px)', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '1.5rem',
      boxSizing: 'border-box',
      marginLeft: '245px',
      overflowX: 'hidden',
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "16px",
      padding: "20px 25px",
      boxShadow: "0 4px 20px rgba(0, 201, 123, 0.08)",
      flexWrap: "wrap",
      gap: "15px",
    },
    headerTitle: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#2d3748",
      margin: 0,
    },
    addButton: {
      padding: "12px 24px",
      background: "linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    tableContainer: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0, 201, 123, 0.08)",
      overflowX: "hidden",
      width: "100%",
      maxWidth: "100%",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
    },
    th: {
      textAlign: "left",
      padding: "12px 16px",
      borderBottom: "2px solid #e2e8f0",
      color: "#718096",
      fontWeight: 600,
      fontSize: "14px",
      whiteSpace: "nowrap",
      position: "sticky",
      top: 0,
      background: "rgba(255, 255, 255, 0.98)",
      zIndex: 10,
    },
    td: {
      padding: "14px 12px",
      borderBottom: "1px solid #e2e8f0",
      color: "#2d3748",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "180px",
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
    iconButton: {
      padding: "8px",
      background: "transparent",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    editButton: {
      color: "#00b8d9",
    },
    deleteButton: {
      color: "#fc8181",
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
      borderRadius: "16px",
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
    passwordFormGroup: {
      display: "flex",
      alignItems: "center", 
      marginBottom: "20px",
      gap: "10px",
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

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Profile Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Labs</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.phoneNumber || "N/A"}</td>
                <td style={styles.td}>{user.location || "N/A"}</td>
                <td style={styles.td}>{(user.status).charAt(0).toUpperCase() + user.status.slice(1) || "N/A"}</td>
                <td style={styles.td}>
                  {user.labAccess && user.labAccess.length > 0
                    ? user.labAccess.join(", ")
                    : "No Labs"}
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={{ ...styles.iconButton, ...styles.editButton }}
                      onClick={() => handleEditUser(user)}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      style={{ ...styles.iconButton, ...styles.deleteButton }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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