"use client";

import { withRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AssetManagement() {
  const [pcs, setPCs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPC, setEditingPC] = useState(null);
  const [newPC, setNewPC] = useState({
    PC_Name: "",
    Lab: "",
    Assets: []
  });

  useEffect(() => {
    const fetchPCs = async () => {
      try {
        const res = await fetch('/api/admin/getlabPCs');

        if (!res.ok) {
          throw new Error('Failed to fetch PCs');
        }

        const data = await res.json();
        console.log(data);
        
        setPCs(
          data.pcs.map(pc => ({
            id: pc._id,
            PC_Name: pc.PC_Name,
            Lab: pc.Lab,
            Assets: pc.Assets || []
          }))
        );
      } catch (error) {
        console.error("Error fetching PCs:", error);
      }
    };
    fetchPCs();
  }, []);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await fetch("/api/admin/getLabs");
        const data = await res.json();
        console.log(data);       

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch labs");
        }

        setLabs(data.labs);
      } catch (err) {
        console.error("Error fetching labs:", err);
        alert("Failed to load labs. Please try again later.");
      } finally {
        // setLoadingLabs(false);
      }
    };

    fetchLabs();
  }, []);

  const filteredPCs = selectedLab === "all" 
    ? pcs 
    : pcs.filter(pc => pc.Lab._id === selectedLab);

  const handleAddPC = async () => {
    if (!newPC.PC_Name || !newPC.Lab) {
      alert("Please fill all required fields");
      return;
    }
    console.log(newPC.Lab);  

    try {
      const res = await fetch("/api/admin/addLabPCs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PC_Name: newPC.PC_Name,
          Lab: newPC.Lab,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      setPCs([
        ...pcs,
        {
          id: pcs.length + 1,
          PC_Name: newPC.PC_Name,
          Lab: newPC.Lab,
        },
      ]);

      alert("Lab Technician added successfully!");
      setShowAddModal(false);
      setNewPC({
        PC_Name: "",
        Lab: "",
        Assets: [],
      });
      resetForm();
    } catch (err) {
      console.error("Add Technician Error:", err);
      alert("Something went wrong while adding user.");
    }
  };

  const handleEditPC = (pc) => {
    setEditingPC(pc);
    setShowAddModal(true);
    setNewPC(pc);
  };

  const handleUpdatePC = () => {
    setPCs(pcs.map(p => p.id === editingPC.id ? { ...newPC, id: editingPC.id } : p));
    setShowAddModal(false);
    setEditingPC(null);
    resetForm();
  };

  const handleDeletePC = (pcId) => {
    if (window.confirm("Are you sure you want to delete this PC?")) {
      setPCs(pcs.filter(p => p.id !== pcId));
    }
  };

  const resetForm = () => {
    setNewPC({ PC_Name: "", Lab: "", Assets: [] });
  };

  const getLabName = (labData) => {
    if (!labData) return "Unknown Lab";
    return labData.name || labData.Lab_ID || "Unnamed Lab";

}

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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem 2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 600,
      color: '#2d3748',
      margin: 0
    },
    addButton: {
      padding: '0.75rem 1.5rem',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      transition: 'background 0.2s ease'
    },
    filterSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#4a5568',
      marginBottom: '0.75rem',
      display: 'block'
    },
    filterButtons: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap'
    },
    filterButton: {
      padding: '0.5rem 1rem',
      background: '#f7fafc',
      color: '#4a5568',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    },
    filterButtonActive: {
      background: '#10b981',
      color: 'white',
      borderColor: '#10b981'
    },
    pcGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem'
    },
    pcCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      position: 'relative'
    },
    pcCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    pcName: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '0.5rem'
    },
    pcLab: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    assetsSection: {
      marginBottom: '1rem'
    },
    assetsLabel: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#4a5568',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    assetsCount: {
      fontSize: '14px',
      color: '#718096'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e2e8f0'
    },
    iconButton: {
      padding: '0.5rem',
      background: '#f7fafc',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    editButton: {
      color: '#10b981'
    },
    deleteButton: {
      color: '#ef4444'
    },
    redirectButton: {
      color: '#3b82f6'
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
      borderRadius: '12px',
      padding: '2rem',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box',
      background: 'white'
    },
    modalActions: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '2rem'
    },
    cancelButton: {
      flex: 1,
      padding: '0.75rem',
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
      padding: '0.75rem',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px'
    },
    emptyState: {
      padding: '3rem',
      color: '#718096'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Asset Management</h1>
        <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          Add New PC
        </button>
      </header>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Filter by Lab</label>
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterButton,
              ...(selectedLab === "all" ? styles.filterButtonActive : {})
            }}
            onClick={() => setSelectedLab("all")}
          >
            All Labs
          </button>
          {labs.map(lab => (
            <button
              key={lab._id}
              style={{
                ...styles.filterButton,
                ...(selectedLab === lab._id ? styles.filterButtonActive : {})
              }}
              onClick={() => setSelectedLab(lab._id)}
            >
              {lab.Lab_ID}
            </button>
          ))}
        </div>
      </div>

      {/* PC Cards Grid */}
      <div style={styles.pcGrid}>
        {filteredPCs.length > 0 ? (
          filteredPCs.map(pc => (
            <div
              key={pc._id}
              style={styles.pcCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={styles.pcName}>{pc.PC_Name}</div>
              <div style={styles.pcLab}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{color: '#10b981'}}>
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                {getLabName(pc.Lab)}
              </div>
              <div style={styles.assetsSection}>
                <div style={styles.assetsLabel}>Assets</div>
                <div style={styles.assetsCount}>
                  {pc.Assets.length} item{pc.Assets.length !== 1 ? 's' : ''} assigned
                </div>
              </div>
              <div style={styles.actionButtons}>
                <button
                  style={{...styles.iconButton, ...styles.redirectButton}}
                  onClick={() => {
                    window.location.href = `/adminPanel/asset_management/asset/${pc.id}`;
                  }}
                  title="View Details"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </button>
                <button
                  style={{...styles.iconButton, ...styles.editButton}}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPC(pc);
                  }}
                  title="Edit PC"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </button>
                <button
                  style={{...styles.iconButton, ...styles.deleteButton}}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePC(pc.id);
                  }}
                  title="Delete PC"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <p>No PCs found for the selected lab.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => {
          setShowAddModal(false);
          setEditingPC(null);
          resetForm();
        }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>
              {editingPC ? "Edit PC" : "Add New PC"}
            </h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>PC Name</label>
              <input
                type="text"
                style={styles.input}
                value={newPC.PC_Name}
                onChange={(e) => setNewPC({...newPC, PC_Name: e.target.value})}
                placeholder="Enter PC name"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Lab</label>
              <select
                style={styles.select}
                value={newPC.Lab}
                onChange={(e) => setNewPC({...newPC, Lab: e.target.value})}>
                <option value="">Select Lab</option>
                {labs.length > 0 ? (
                  labs.map((lab) => (
                    <option key={lab._id} value={lab._id}>
                      {lab.Lab_ID}
                    </option>
                  ))
                ) : (
                  <option disabled>No labs found</option>
                )}
              </select>
            </div>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPC(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                style={styles.saveButton}
                onClick={editingPC ? handleUpdatePC : handleAddPC}
              >
                {editingPC ? "Update PC" : "Add PC"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
