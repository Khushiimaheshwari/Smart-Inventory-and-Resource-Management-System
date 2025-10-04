"use client";

import { useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      access: {
        dashboard: true,
        assetManagement: true,
        analytics: true,
        userManagement: true,
        settings: true
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      access: {
        dashboard: true,
        assetManagement: true,
        analytics: true,
        userManagement: false,
        settings: false
      }
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Viewer",
      access: {
        dashboard: true,
        assetManagement: false,
        analytics: true,
        userManagement: false,
        settings: false
      }
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer",
    access: {
      dashboard: true,
      assetManagement: false,
      analytics: false,
      userManagement: false,
      settings: false
    }
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setShowAddModal(false);
      setNewUser({
        name: "",
        email: "",
        role: "Viewer",
        access: {
          dashboard: true,
          assetManagement: false,
          analytics: false,
          userManagement: false,
          settings: false
        }
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
    setNewUser(user);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
    setShowAddModal(false);
    setEditingUser(null);
    setNewUser({
      name: "",
      email: "",
      role: "Viewer",
      access: {
        dashboard: true,
        assetManagement: false,
        analytics: false,
        userManagement: false,
        settings: false
      }
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const toggleAccess = (module) => {
    setNewUser({
      ...newUser,
      access: {
        ...newUser.access,
        [module]: !newUser.access[module]
      }
    });
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafb 0%, #f1f5f7 100%)',
      fontFamily: "Times New Roman, Times, serif",
    },
    sidebar: {
      width: '260px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid #e2e8f0',
      padding: '20px 0',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px 20px',
      gap: '10px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      borderRadius: '8px'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#2d3748'
    },
    navMenu: {
      listStyle: 'none',
      padding: '0 20px',
      margin: 0
    },
    navItem: {
      marginBottom: '5px'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      textDecoration: 'none',
      color: '#718096',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      fontWeight: 500,
      cursor: 'pointer'
    },
    navLinkActive: {
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white'
    },
    navIcon: {
      width: '20px',
      height: '20px',
      marginRight: '12px'
    },
    mainContent: {
      flex: 1,
      marginLeft: '260px',
      padding: '20px 30px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '20px 25px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#2d3748',
      margin: 0
    },
    addButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    tableContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      borderBottom: '2px solid #e2e8f0',
      color: '#718096',
      fontWeight: 600,
      fontSize: '14px'
    },
    td: {
      padding: '16px 12px',
      borderBottom: '1px solid #e2e8f0',
      color: '#2d3748'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600
    },
    badgeAdmin: {
      background: 'rgba(0, 201, 123, 0.1)',
      color: '#00c97b'
    },
    badgeManager: {
      background: 'rgba(0, 184, 217, 0.1)',
      color: '#00b8d9'
    },
    badgeViewer: {
      background: 'rgba(246, 173, 85, 0.1)',
      color: '#f6ad55'
    },
    checkIcon: {
      color: '#00c97b',
      fontSize: '18px'
    },
    crossIcon: {
      color: '#fc8181',
      fontSize: '18px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      padding: '8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    editButton: {
      color: '#00b8d9'
    },
    deleteButton: {
      color: '#fc8181'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#2d3748',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      background: 'white'
    },
    accessSection: {
      marginTop: '24px'
    },
    accessTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '16px'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      background: '#f8fafb',
      borderRadius: '8px',
      marginBottom: '8px',
      cursor: 'pointer'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      marginRight: '12px',
      cursor: 'pointer'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      background: 'white',
      color: '#718096',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px'
    },
    saveButton: {
      flex: 1,
      padding: '12px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Account Management</h1>
          <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Add New User
          </button>
        </header>

       {/* Users Table */}
<div style={styles.tableContainer}>
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>Name</th>
        <th style={styles.th}>Email</th>
        <th style={styles.th}>Password</th>
        <th style={styles.th}>Role</th>
        <th style={styles.th}>Profile Image</th>
        <th style={styles.th}>Phone Number</th>
        <th style={styles.th}>Location</th>
        <th style={styles.th}>Account Status</th>
        <th style={styles.th}>Account Access</th>
        <th style={styles.th}>Labs</th>
        <th style={styles.th}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id}>
          <td style={styles.td}>{user.name}</td>
          <td style={styles.td}>{user.email}</td>
          <td style={styles.td}>{user.Password ? "******" : "N/A"}</td>
          <td style={styles.td}>
            <span style={{
              ...styles.badge,
              ...(user.role === 'Admin' ? styles.badgeAdmin : 
                  user.role === 'Manager' ? styles.badgeManager : 
                  styles.badgeViewer)
            }}>
              {user.role}
            </span>
          </td>
          <td style={styles.td}>
            {user.ProfileImage ? (
              <img src={user.ProfileImage} alt="Profile" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
            ) : "N/A"}
          </td>
          <td style={styles.td}>{user.PhoneNumber || "N/A"}</td>
          <td style={styles.td}>{user.Location || "N/A"}</td>
          <td style={styles.td}>{user.AccountStatus || "active"}</td>
          <td style={styles.td}>{user.AccountAccess || "View Only"}</td>
          <td style={styles.td}>
            {user.Labs && user.Labs.length > 0 ? user.Labs.join(", ") : "No Labs"}
          </td>
          <td style={styles.td}>
            <div style={styles.actionButtons}>
              <button 
                style={{...styles.iconButton, ...styles.editButton}}
                onClick={() => handleEditUser(user)}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </button>
              <button 
                style={{...styles.iconButton, ...styles.deleteButton}}
                onClick={() => handleDeleteUser(user.id)}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* Add/Edit User Modal */}
        {showAddModal && (
          <div style={styles.modal} onClick={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalHeader}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input 
                  type="email"
                  style={styles.input}
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select 
                  style={styles.select}
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div style={styles.accessSection}>
                <div style={styles.accessTitle}>Access Rights</div>
                
                <div style={styles.checkboxGroup} onClick={() => toggleAccess('dashboard')}>
                  <input 
                    type="checkbox"
                    style={styles.checkbox}
                    checked={newUser.access.dashboard}
                    onChange={() => {}}
                  />
                  <span>Dashboard</span>
                </div>

                <div style={styles.checkboxGroup} onClick={() => toggleAccess('assetManagement')}>
                  <input 
                    type="checkbox"
                    style={styles.checkbox}
                    checked={newUser.access.assetManagement}
                    onChange={() => {}}
                  />
                  <span>Asset Management</span>
                </div>

                <div style={styles.checkboxGroup} onClick={() => toggleAccess('analytics')}>
                  <input 
                    type="checkbox"
                    style={styles.checkbox}
                    checked={newUser.access.analytics}
                    onChange={() => {}}
                  />
                  <span>Analytics & Reports</span>
                </div>

                <div style={styles.checkboxGroup} onClick={() => toggleAccess('userManagement')}>
                  <input 
                    type="checkbox"
                    style={styles.checkbox}
                    checked={newUser.access.userManagement}
                    onChange={() => {}}
                  />
                  <span>User Management</span>
                </div>

                <div style={styles.checkboxGroup} onClick={() => toggleAccess('settings')}>
                  <input 
                    type="checkbox"
                    style={styles.checkbox}
                    checked={newUser.access.settings}
                    onChange={() => {}}
                  />
                  <span>Settings</span>
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
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}