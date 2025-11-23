"use client";

import React, { useEffect, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function HandoverFormPage() {
  const [handoverForms, setHandoverForms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [expandedForm, setExpandedForm] = useState(null);
  const [newHandoverForm, setNewHandoverForm] = useState({
    formName: '',
    labName: '',
    handoverDate: '',
    handoverByName: '',
    handoverByDesignation: '',
    handoverToName: '',
    handoverToDesignation: '',
    purpose: '',
    equipment: [{ serialNo: '', equipmentType: '', brand: '', remarks: '' }],
    status: 'Pending'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchHandoverForms = async () => {
    try {
      const res = await fetch("/api/admin/getHandoverForms");
      const data = await res.json();
      if (res.ok) {
        setHandoverForms(data.handoverForms);
      } else {
        console.error("Failed to fetch handover forms:", data.error);
      }
    } catch (err) {
      console.error("Error fetching handover forms:", err);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await fetchHandoverForms();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  const dummyHandoverForms = [
    {
      _id: '1',
      formName: 'Lab Equipment Handover - CS Lab 1',
      labName: 'Computer Science Lab 1',
      handoverByName: 'Dr. John Smith',
      handoverByDesignation: 'Professor',
      handoverToName: 'Dr. Sarah Johnson',
      handoverToDesignation: 'Associate Professor',
      handoverDate: '2024-01-15',
      purpose: 'Annual Lab Maintenance',
      status: 'Completed',
      equipment: [
        { serialNo: 'SN001', equipmentType: 'Computer', brand: 'Dell XPS 15', remarks: 'Working condition' },
        { serialNo: 'SN002', equipmentType: 'Projector', brand: 'Epson EB-X41', remarks: 'Good' }
      ]
    },
    {
      _id: '2',
      formName: 'Network Equipment Transfer',
      labName: 'Networking Lab',
      handoverByName: 'Prof. Mike Wilson',
      handoverByDesignation: 'Head of Department',
      handoverToName: 'Dr. Emily Brown',
      handoverToDesignation: 'Lab Coordinator',
      handoverDate: '2024-01-20',
      purpose: 'Lab Upgrade',
      status: 'Pending',
      equipment: [
        { serialNo: 'RT001', equipmentType: 'Router', brand: 'Cisco 2901', remarks: 'New' },
        { serialNo: 'SW001', equipmentType: 'Switch', brand: 'D-Link 24 Port', remarks: 'Working' }
      ]
    },
    {
      _id: '3',
      formName: 'Laboratory Tools Handover',
      labName: 'Electronics Lab',
      handoverByName: 'Dr. Robert Davis',
      handoverByDesignation: 'Senior Lecturer',
      handoverToName: 'Prof. Lisa Anderson',
      handoverToDesignation: 'Lab Manager',
      handoverDate: '2024-01-18',
      purpose: 'Equipment Audit',
      status: 'In Progress',
      equipment: [
        { serialNo: 'OSC001', equipmentType: 'Oscilloscope', brand: 'Tektronix TBS1052B', remarks: 'Calibrated' },
        { serialNo: 'MM001', equipmentType: 'Multimeter', brand: 'Fluke 87V', remarks: 'Good condition' }
      ]
    }
  ];

  const displayForms = handoverForms.length > 0 ? handoverForms : dummyHandoverForms;

  const handleAddEquipment = () => {
    setNewHandoverForm({
      ...newHandoverForm,
      equipment: [...newHandoverForm.equipment, { serialNo: '', equipmentType: '', brand: '', remarks: '' }]
    });
  };

  const handleRemoveEquipment = (index) => {
    const updatedEquipment = newHandoverForm.equipment.filter((_, i) => i !== index);
    setNewHandoverForm({ ...newHandoverForm, equipment: updatedEquipment });
  };

  const handleEquipmentChange = (index, field, value) => {
    const updatedEquipment = [...newHandoverForm.equipment];
    updatedEquipment[index][field] = value;
    setNewHandoverForm({ ...newHandoverForm, equipment: updatedEquipment });
  };

  const handleAddHandoverForm = async () => {
    if (!newHandoverForm.formName || !newHandoverForm.handoverByName || !newHandoverForm.handoverToName) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = {
      formName: newHandoverForm.formName,
      labName: newHandoverForm.labName,
      handoverDate: newHandoverForm.handoverDate,
      handoverByName: newHandoverForm.handoverByName,
      handoverByDesignation: newHandoverForm.handoverByDesignation,
      handoverToName: newHandoverForm.handoverToName,
      handoverToDesignation: newHandoverForm.handoverToDesignation,
      purpose: newHandoverForm.purpose,
      equipment: newHandoverForm.equipment,
      status: newHandoverForm.status
    }

    try {
      const res = await fetch("/api/admin/addHandoverForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Handover form added successfully!");
        setShowAddModal(false);
        setNewHandoverForm({ 
          formName: '', 
          labName: '',
          handoverDate: '',
          handoverByName: '',
          handoverByDesignation: '',
          handoverToName: '',
          handoverToDesignation: '',
          purpose: '',
          equipment: [{ serialNo: '', equipmentType: '', brand: '', remarks: '' }],
          status: 'Pending' 
        });
        fetchHandoverForms();
      } else {
        alert(data.error || "Failed to add handover form");
      }
    } catch (error) {
      console.error("Error adding handover form:", error);
      alert("Something went wrong while adding the handover form.");
    }
  };

  const styles = {
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f9fafb',
      flexDirection: 'column',
      gap: '1rem',
    },
    loaderText: {
      color: '#6b7280',
      fontSize: '16px',
      fontWeight: '500',
    },
    container: {
      width: (isMobile || isTablet) ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: (isMobile || isTablet) ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: (isMobile || isTablet) ? '0' : '255px',
      overflowX: 'hidden',
      fontFamily: "'Times New Roman', Times, serif",
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
    tableHeader: {
      display: "grid",
      gridTemplateColumns: "minmax(380px, 1.5fr) 145px 145px 135px 50px 50px",
      alignItems: "center",
      padding: "12px 24px",
      background: "#f3f4f6",
      borderRadius: "8px",
      marginBottom: "1rem",
      fontWeight: 600,
      fontSize: "13px",
      color: "#4b5563",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      gap: "0.5rem",
    },
    headerColumn: {
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
      padding: "1.25rem 1.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
    },
    cardHeader: {
      display: "grid",
      gridTemplateColumns: "minmax(380px, 1.5fr) 145px 145px 135px 50px 50px",
      alignItems: "center",
      gap: "0.5rem",
    },
    cardLeft: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
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
      fontSize: "14px",
      color: "#6b7280",
      fontWeight: "700",
      flexShrink: 0,
    },
    cardInfo: {
      flex: "1",
      minWidth: 0,
    },
    cardName: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#1f2937",
      margin: "0 0 4px 0",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    cardEmail: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    cardText: {
      fontSize: "14px",
      color: "#4b5563",
      fontWeight: 500,
      textAlign: "center",
      margin: 0,
    },
    statusWrapper: {
      display: "flex",
      justifyContent: "center",
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 600,
    },
    statusCompleted: {
      background: "#d1fae5",
      color: "#065f46",
    },
    statusPending: {
      background: "#fef3c7",
      color: "#92400e",
    },
    statusInProgress: {
      background: "#dbeafe",
      color: "#1e40af",
    },
    actionButtons: {
      display: "flex",
      gap: "2px",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    iconButton: {
      width: "30px",
      height: "30px",
      background: "transparent",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      flexShrink: 0,
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
    },
    detailsSection: {
      padding: "1.25rem",
      background: "#f0fdf4",
      borderRadius: "8px",
      border: "1px solid #d1fae5",
      marginBottom: "1rem",
    },
    detailsLabel: {
      fontSize: "13px",
      color: "#065f46",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
    },
    detailItem: {
      fontSize: "14px",
      color: "#059669",
      fontWeight: 500,
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #e5e7eb",
    },
    detailLabel: {
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: 600,
    },
    detailValue: {
      fontSize: "13px",
      color: "#1f2937",
      fontWeight: 500,
    },
    equipmentSection: {
      padding: "1.25rem",
      background: "#eff6ff",
      borderRadius: "8px",
      border: "1px solid #bfdbfe",
    },
    equipmentTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      overflow: "hidden",
    },
    tableHead: {
      background: "#f3f4f6",
    },
    tableRow: {
      borderBottom: "1px solid #e2e8f0",
    },
    tableCell: {
      padding: "12px",
      textAlign: "left",
      fontSize: "13px",
      color: "#4b5563",
    },
    tableHeaderCell: {
      padding: "12px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: 600,
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    equipmentInput: {
      width: "100%",
      padding: "8px",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      fontSize: "13px",
      boxSizing: "border-box",
    },
    removeButton: {
      padding: "6px 12px",
      background: "#fee2e2",
      color: "#ef4444",
      border: "none",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    addEquipmentButton: {
      padding: "10px 20px",
      background: "#e0f2fe",
      color: "#0369a1",
      border: "none",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
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
      maxWidth: "800px",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    modalHeader: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "20px",
      textAlign: "center",
      borderBottom: "2px solid #10b981",
      paddingBottom: "12px",
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
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading handover forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Equipment Handover Forms</h1>
        
      </header>

      <div style={styles.tableHeader}>
        <div>Form Details</div>
        <div style={styles.headerColumn}>Handover By</div>
        <div style={styles.headerColumn}>Handover To</div>
        <div style={styles.headerColumn}>Status</div>
        <div style={styles.headerColumn}>Actions</div>
        <div></div>
      </div>

      <div style={styles.cardContainer}>
        {displayForms && displayForms.length > 0 ? (
          displayForms.map((form, index) => (
            <div key={form._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <div style={styles.profileImage}>H{index + 1}</div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardName}>{form.formName}</h3>
                    <p style={styles.cardEmail}>{form.labName || 'Lab not specified'} • {form.handoverDate}</p>
                  </div>
                </div>

                <div style={{textAlign: "center"}}>
                  <p style={styles.cardText}>{form.handoverByName}</p>
                  <p style={{...styles.cardEmail, textAlign: "center"}}>{form.handoverByDesignation}</p>
                </div>

                <div style={{textAlign: "center"}}>
                  <p style={styles.cardText}>{form.handoverToName}</p>
                  <p style={{...styles.cardEmail, textAlign: "center"}}>{form.handoverToDesignation}</p>
                </div>

                <div style={styles.statusWrapper}>
                  <span style={{
                    ...styles.statusBadge, 
                    ...(form.status?.toLowerCase() === "completed" && styles.statusCompleted), 
                    ...(form.status?.toLowerCase() === "pending" && styles.statusPending),
                    ...(form.status?.toLowerCase() === "in progress" && styles.statusInProgress)
                  }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      {form.status?.toLowerCase() === "completed" ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      ) : form.status?.toLowerCase() === "in progress" ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    {form.status}
                  </span>
                </div>

                <div style={styles.actionButtons}>
                  <button 
                    style={{...styles.iconButton, ...styles.expandButton, transform: expandedForm === form._id ? "rotate(180deg)" : "rotate(0deg)"}} 
                    onClick={() => setExpandedForm(expandedForm === form._id ? null : form._id)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    title="Expand Details">
                    <ChevronDown size={16} />
                  </button>
                  <button 
                    style={{...styles.iconButton, ...styles.editButton}}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#d1fae5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    title="Edit">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <button 
                  style={{...styles.iconButton, ...styles.deleteButton}}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  title="Delete">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {expandedForm === form._id && (
                <div style={styles.expandedContent}>
                  <div style={styles.detailsSection}>
                    <span style={styles.detailsLabel}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: "6px"}}>
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      General Information
                    </span>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Lab Name/Number:</span>
                      <span style={styles.detailValue}>{form.labName || 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Purpose of Handover:</span>
                      <span style={styles.detailValue}>{form.purpose || 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Date of Handover:</span>
                      <span style={styles.detailValue}>{form.handoverDate}</span>
                    </div>
                  </div>

                  {form.equipment && form.equipment.length > 0 && (
                    <div style={styles.equipmentSection}>
                      <span style={{...styles.detailsLabel, color: "#1e40af"}}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: "6px"}}>
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        Hardware Details
                      </span>
                      <table style={styles.equipmentTable}>
                        <thead style={styles.tableHead}>
                          <tr style={styles.tableRow}>
                            <th style={styles.tableHeaderCell}>S.NO.</th>
                            <th style={styles.tableHeaderCell}>Equipment Type</th>
                            <th style={styles.tableHeaderCell}>Brand/Model</th>
                            <th style={styles.tableHeaderCell}>Serial No.</th>
                            <th style={styles.tableHeaderCell}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.equipment.map((item, idx) => (
                            <tr key={idx} style={styles.tableRow}>
                              <td style={styles.tableCell}>{idx + 1}</td>
                              <td style={styles.tableCell}>{item.equipmentType}</td>
                              <td style={styles.tableCell}>{item.brand}</td>
                              <td style={styles.tableCell}>{item.serialNo}</td>
                              <td style={styles.tableCell}>{item.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{color: "#555", fontSize: "1.1rem", fontWeight: 500, textAlign: "center"}}>No handover forms found.</p>
        )}
      </div>

      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>EQUIPMENT HANDOVER FORM</h2>
            
            <div style={{marginBottom: "24px", padding: "16px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #d1fae5"}}>
              <h3 style={{fontSize: "16px", fontWeight: 600, color: "#065f46", marginBottom: "12px"}}>1. General Information</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Form Name *</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={newHandoverForm.formName} 
                  onChange={(e) => setNewHandoverForm({...newHandoverForm, formName: e.target.value})} 
                  placeholder="Enter form name" 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date of Handover *</label>
                <input 
                  type="date" 
                  style={styles.input} 
                  value={newHandoverForm.handoverDate} 
                  onChange={(e) => setNewHandoverForm({...newHandoverForm, handoverDate: e.target.value})} 
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lab Name/Number</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={newHandoverForm.labName} 
                  onChange={(e) => setNewHandoverForm({...newHandoverForm, labName: e.target.value})} 
                  placeholder="Enter lab name/number" 
                />
              </div>

              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Handover From (Name) *</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={newHandoverForm.handoverByName} 
                    onChange={(e) => setNewHandoverForm({...newHandoverForm, handoverByName: e.target.value})} 
                    placeholder="Enter name" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Designation</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={newHandoverForm.handoverByDesignation} 
                    onChange={(e) => setNewHandoverForm({...newHandoverForm, handoverByDesignation: e.target.value})} 
                    placeholder="Enter designation" 
                  />
                </div>
              </div>

              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Handover To (Name) *</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={newHandoverForm.handoverToName} 
                    onChange={(e) => setNewHandoverForm({...newHandoverForm, handoverToName: e.target.value})} 
                    placeholder="Enter name" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Designation</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={newHandoverForm.handoverToDesignation} 
                    onChange={(e) => setNewHandoverForm({...newHandoverForm, handoverToDesignation: e.target.value})} 
                    placeholder="Enter designation" 
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Purpose of Handover</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={newHandoverForm.purpose} 
                  onChange={(e) => setNewHandoverForm({...newHandoverForm, purpose: e.target.value})} 
                  placeholder="Enter purpose" 
                />
              </div>
            </div>

            <div style={{marginBottom: "24px"}}>
              <h3 style={{fontSize: "16px", fontWeight: 600, color: "#2d3748", marginBottom: "12px"}}>2. Hardware Details</h3>
              
              <div style={{overflowX: "auto"}}>
                <table style={styles.equipmentTable}>
                  <thead style={styles.tableHead}>
                    <tr style={styles.tableRow}>
                      <th style={styles.tableHeaderCell}>S.NO.</th>
                      <th style={styles.tableHeaderCell}>Equipment Type</th>
                      <th style={styles.tableHeaderCell}>Brand/Model</th>
                      <th style={styles.tableHeaderCell}>Serial No.</th>
                      <th style={styles.tableHeaderCell}>Remarks</th>
                      <th style={styles.tableHeaderCell}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newHandoverForm.equipment.map((item, index) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.tableCell}>{index + 1}</td>
                        <td style={styles.tableCell}>
                          <input 
                            type="text" 
                            style={styles.equipmentInput}
                            value={item.equipmentType}
                            onChange={(e) => handleEquipmentChange(index, 'equipmentType', e.target.value)}
                            placeholder="e.g., Computer"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input 
                            type="text" 
                            style={styles.equipmentInput}
                            value={item.brand}
                            onChange={(e) => handleEquipmentChange(index, 'brand', e.target.value)}
                            placeholder="e.g., Dell XPS"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input 
                            type="text" 
                            style={styles.equipmentInput}
                            value={item.serialNo}
                            onChange={(e) => handleEquipmentChange(index, 'serialNo', e.target.value)}
                            placeholder="e.g., SN123456"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <input 
                            type="text" 
                            style={styles.equipmentInput}
                            value={item.remarks}
                            onChange={(e) => handleEquipmentChange(index, 'remarks', e.target.value)}
                            placeholder="Optional"
                          />
                        </td>
                        <td style={styles.tableCell}>
                          {newHandoverForm.equipment.length > 1 && (
                            <button 
                              style={styles.removeButton}
                              onClick={() => handleRemoveEquipment(index)}
                              onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                              onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button 
                style={styles.addEquipmentButton}
                onClick={handleAddEquipment}
                onMouseEnter={(e) => e.target.style.background = '#bae6fd'}
                onMouseLeave={(e) => e.target.style.background = '#e0f2fe'}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Equipment Row
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select 
                style={styles.select} 
                value={newHandoverForm.status} 
                onChange={(e) => setNewHandoverForm({...newHandoverForm, status: e.target.value})}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton} 
                onClick={() => {
                  setShowAddModal(false); 
                  setNewHandoverForm({
                    formName: '', 
                    labName: '',
                    handoverDate: '',
                    handoverByName: '',
                    handoverByDesignation: '',
                    handoverToName: '',
                    handoverToDesignation: '',
                    purpose: '',
                    equipment: [{ serialNo: '', equipmentType: '', brand: '', remarks: '' }],
                    status: 'Pending'
                  });
                }}
                onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.background = 'white'}>
                Cancel
              </button>
              <button 
                style={styles.saveButton} 
                onClick={handleAddHandoverForm}
                onMouseEnter={(e) => e.target.style.background = '#059669'}
                onMouseLeave={(e) => e.target.style.background = '#10b981'}>
                Add Handover Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}