"use client";

import { useState } from "react";

export default function AssetManagement() {
  const [assets, setAssets] = useState([
    {
      id: 1,
      name: "Dell Laptop XPS 15",
      assetId: "AST-001",
      category: "Electronics",
      status: "Active",
      assignedTo: "John Doe",
      purchaseDate: "2024-01-15",
      value: "₹85,000",
      location: "Office - Floor 2"
    },
    {
      id: 2,
      name: "HP Printer LaserJet",
      assetId: "AST-002",
      category: "Equipment",
      status: "Active",
      assignedTo: "Not Assigned",
      purchaseDate: "2023-11-20",
      value: "₹25,000",
      location: "Office - Floor 1"
    },
    {
      id: 3,
      name: "Office Desk",
      assetId: "AST-003",
      category: "Furniture",
      status: "Active",
      assignedTo: "Jane Smith",
      purchaseDate: "2023-08-10",
      value: "₹15,000",
      location: "Office - Floor 2"
    },
    {
      id: 4,
      name: "MacBook Pro 14",
      assetId: "AST-004",
      category: "Electronics",
      status: "Maintenance",
      assignedTo: "Mike Johnson",
      purchaseDate: "2024-03-05",
      value: "₹1,50,000",
      location: "Service Center"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    assetId: "",
    category: "Electronics",
    status: "Active",
    assignedTo: "",
    purchaseDate: "",
    value: "",
    location: ""
  });

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.assetId) {
      setAssets([...assets, { ...newAsset, id: assets.length + 1 }]);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowAddModal(true);
    setNewAsset(asset);
  };

  const handleUpdateAsset = () => {
    setAssets(assets.map(a => a.id === editingAsset.id ? newAsset : a));
    setShowAddModal(false);
    setEditingAsset(null);
    resetForm();
  };

  const handleDeleteAsset = (assetId) => {
    setAssets(assets.filter(a => a.id !== assetId));
  };

  const resetForm = () => {
    setNewAsset({
      name: "",
      assetId: "",
      category: "Electronics",
      status: "Active",
      assignedTo: "",
      purchaseDate: "",
      value: "",
      location: ""
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
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#2d3748'
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
    badgeActive: {
      background: 'rgba(0, 201, 123, 0.1)',
      color: '#00c97b'
    },
    badgeMaintenance: {
      background: 'rgba(246, 173, 85, 0.1)',
      color: '#f6ad55'
    },
    badgeInactive: {
      background: 'rgba(252, 129, 129, 0.1)',
      color: '#fc8181'
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

  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.status === "Active").length;
  const maintenanceAssets = assets.filter(a => a.status === "Maintenance").length;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <nav>
          <ul style={styles.navMenu}>
            <li style={styles.navItem}>
              <a href="/admin" style={styles.navLink}>
                <svg style={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                Dashboard
              </a>
            </li>
            <li style={styles.navItem}>
              <a href="#" style={{...styles.navLink, ...styles.navLinkActive}}>
                <svg style={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
                Asset Management
              </a>
            </li>
            <li style={styles.navItem}>
              <a href="#" style={styles.navLink}>
                <svg style={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                Analytics & Reports
              </a>
            </li>
            <li style={styles.navItem}>
              <a href="/user-manage" style={styles.navLink}>
                <svg style={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                User Management
              </a>
            </li>
            <li style={styles.navItem}>
              <a href="#" style={styles.navLink}>
                <svg style={styles.navIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Asset Management</h1>
          <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Add New Asset
          </button>
        </header>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Assets</div>
            <div style={styles.statValue}>{totalAssets}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Assets</div>
            <div style={styles.statValue}>{activeAssets}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Under Maintenance</div>
            <div style={styles.statValue}>{maintenanceAssets}</div>
          </div>
        </div>

        {/* Assets Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Asset ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Assigned To</th>
                <th style={styles.th}>Purchase Date</th>
                <th style={styles.th}>Value</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id}>
                  <td style={styles.td}>{asset.assetId}</td>
                  <td style={styles.td}>{asset.name}</td>
                  <td style={styles.td}>{asset.category}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      ...(asset.status === 'Active' ? styles.badgeActive : 
                          asset.status === 'Maintenance' ? styles.badgeMaintenance : 
                          styles.badgeInactive)
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td style={styles.td}>{asset.assignedTo}</td>
                  <td style={styles.td}>{asset.purchaseDate}</td>
                  <td style={styles.td}>{asset.value}</td>
                  <td style={styles.td}>{asset.location}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button 
                        style={{...styles.iconButton, ...styles.editButton}}
                        onClick={() => handleEditAsset(asset)}
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button 
                        style={{...styles.iconButton, ...styles.deleteButton}}
                        onClick={() => handleDeleteAsset(asset.id)}
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

        {/* Add/Edit Asset Modal */}
        {showAddModal && (
          <div style={styles.modal} onClick={() => {
            setShowAddModal(false);
            setEditingAsset(null);
          }}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalHeader}>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Asset ID</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newAsset.assetId}
                  onChange={(e) => setNewAsset({...newAsset, assetId: e.target.value})}
                  placeholder="e.g., AST-001"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Asset Name</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  placeholder="Enter asset name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select 
                  style={styles.select}
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({...newAsset, category: e.target.value})}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select 
                  style={styles.select}
                  value={newAsset.status}
                  onChange={(e) => setNewAsset({...newAsset, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Assigned To</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newAsset.assignedTo}
                  onChange={(e) => setNewAsset({...newAsset, assignedTo: e.target.value})}
                  placeholder="Enter user name or 'Not Assigned'"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Purchase Date</label>
                <input 
                  type="date"
                  style={styles.input}
                  value={newAsset.purchaseDate}
                  onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Value</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newAsset.value}
                  onChange={(e) => setNewAsset({...newAsset, value: e.target.value})}
                  placeholder="e.g., ₹85,000"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newAsset.location}
                  onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                  placeholder="e.g., Office - Floor 2"
                />
              </div>

              <div style={styles.modalActions}>
                <button 
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAsset(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  style={styles.saveButton}
                  onClick={editingAsset ? handleUpdateAsset : handleAddAsset}
                >
                  {editingAsset ? 'Update Asset' : 'Add Asset'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}