'use client';

import { useEffect, useState } from 'react';

export default function LabManagement() {
  const [labs, setLabs] = useState([
    {
      id: 'LAB-001',
      name: 'Computer Science Lab',
      location: 'Building A - Floor 3',
      capacity: 40,
      status: 'Active',
      incharge: 'Dr. Sarah Johnson',
      equipment: 35
    },
    {
      id: 'LAB-002',
      name: 'Electronics Lab',
      location: 'Building B - Floor 2',
      capacity: 30,
      status: 'Active',
      incharge: 'Prof. Mike Chen',
      equipment: 28
    },
    {
      id: 'LAB-003',
      name: 'Physics Lab',
      location: 'Building A - Floor 1',
      capacity: 25,
      status: 'Under Maintenance',
      incharge: 'Dr. Priya Sharma',
      equipment: 20
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [newLab, setNewLab] = useState({
    id: '',
    name: '',
    location: '',
    capacity: '',
    status: 'Active',
    incharge: '',
  });

  const totalLabs = labs.length;
  const activeLabs = labs.filter(lab => lab.status === 'Active').length;
  const underMaintenance = labs.filter(lab => lab.status === 'Under Maintenance').length;

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await fetch("/api/admin/getlabTechnicians");
        const data = await res.json();
        if (res.ok) {
          setTechnicians(data.technicians);
          console.log(data);
          
        } else {
          console.error("Failed to fetch technicians:", data.error);
        }
      } catch (err) {
        console.error("Error fetching technicians:", err);
      }
    };

    fetchTechnicians();
  }, []);


  // const handleAddLab = () => {
  //   if (newLab.name && newLab.location && newLab.capacity) {
  //     const labId = `LAB-${String(labs.length + 1).padStart(3, '0')}`;
  //     setLabs([...labs, { ...newLab, id: labId }]);
  //     setShowAddModal(false);
  //     resetForm();
  //   }
  // };

  const handleAddLab = async () => {
    if (!newLab.name || !newLab.location || !newLab.capacity || !newLab.incharge) {
      alert("Please fill in all required fields!");
      return;
    }

    const labId = `LAB-${String(labs.length + 1).padStart(3, '0')}`;

    const payload = {
      labId,
      labName: newLab.name,
      location: newLab.location,
      capacity: newLab.capacity,
      status: newLab.status,
      incharge: newLab.incharge, 
    };

    try {
      const res = await fetch("/api/admin/addLab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Lab added successfully!");
        setLabs([...labs, { ...newLab, id: labId }]);
        setShowAddModal(false);
        resetForm();
      } else {
        alert(data.error || "Failed to add lab");
      }
    } catch (error) {
      console.error("Error adding lab:", error);
      alert("Something went wrong while adding the lab.");
    }
  };

  const handleEditLab = (lab) => {
    setEditingLab(lab);
    setShowAddModal(true);
    setNewLab(lab);
  };

  const handleUpdateLab = () => {
    setLabs(labs.map(l => l.id === editingLab.id ? newLab : l));
    setShowAddModal(false);
    setEditingLab(null);
    resetForm();
  };

  const handleDeleteLab = (labId) => {
    setLabs(labs.filter(l => l.id !== labId));
  };

  const resetForm = () => {
    setNewLab({
      id: '',
      name: '',
      location: '',
      capacity: '',
      status: 'Active',
      incharge: '',
      equipment: ''
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '36px',
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

  return (
    <div style={styles.container}>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Lab Management</h1>
          <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Add New Lab
          </button>
        </header>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Labs</div>
            <div style={styles.statValue}>{totalLabs}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Labs</div>
            <div style={styles.statValue}>{activeLabs}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Under Maintenance</div>
            <div style={styles.statValue}>{underMaintenance}</div>
          </div>
        </div>

        {/* Labs Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Lab ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Capacity</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Lab Incharge</th>
                <th style={styles.th}>Equipment</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labs.map(lab => (
                <tr key={lab.id}>
                  <td style={styles.td}>{lab.id}</td>
                  <td style={styles.td}>{lab.name}</td>
                  <td style={styles.td}>{lab.location}</td>
                  <td style={styles.td}>{lab.capacity}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      ...(lab.status === 'Active' ? styles.badgeActive : styles.badgeMaintenance)
                    }}>
                      {lab.status}
                    </span>
                  </td>
                  <td style={styles.td}>{lab.incharge}</td>
                  <td style={styles.td}>{lab.equipment}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button 
                        style={{...styles.iconButton, ...styles.editButton}}
                        onClick={() => handleEditLab(lab)}
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button 
                        style={{...styles.iconButton, ...styles.deleteButton}}
                        onClick={() => handleDeleteLab(lab.id)}
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

        {/* Add/Edit Lab Modal */}
        {showAddModal && (
          <div style={styles.modal} onClick={() => {
            setShowAddModal(false);
            setEditingLab(null);
          }}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalHeader}>{editingLab ? 'Edit Lab' : 'Add New Lab'}</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Lab ID</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newLab.id}
                  onChange={(e) => setNewLab({...newLab, id: e.target.value})}
                  placeholder="Enter lab Id"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lab Name</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newLab.name}
                  onChange={(e) => setNewLab({...newLab, name: e.target.value})}
                  placeholder="Enter lab name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input 
                  type="text"
                  style={styles.input}
                  value={newLab.location}
                  onChange={(e) => setNewLab({...newLab, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Capacity</label>
                <input 
                  type="number"
                  style={styles.input}
                  value={newLab.capacity}
                  onChange={(e) => setNewLab({...newLab, capacity: e.target.value})}
                  placeholder="Enter capacity"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select 
                  style={styles.select}
                  value={newLab.status}
                  onChange={(e) => setNewLab({...newLab, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lab Incharge</label>
                <select
                  style={styles.input}
                  value={newLab.incharge}
                  onChange={(e) =>
                    setNewLab({ ...newLab, incharge: e.target.value })
                  }
                >
                  <option value="">Select Lab Incharge</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.Name} ({tech.Email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.modalActions}>
                <button 
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLab(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  style={styles.saveButton}
                  onClick={editingLab ? handleUpdateLab : handleAddLab}
                >
                  {editingLab ? 'Update Lab' : 'Add Lab'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}