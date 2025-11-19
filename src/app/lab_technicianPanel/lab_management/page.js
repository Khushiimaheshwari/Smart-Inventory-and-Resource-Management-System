'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LabManagement() {
  const [labs, setLabs] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchLab(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  const fetchLab = async () => {
    try {
      const res = await fetch("/api/lab_technician/getLabs");
      const data = await res.json();
      if (res.ok) {
        setLabs(data.labs);
      } else {
        console.error("Failed to fetch lab:", data.error);
      }
    } catch (err) {
      console.error("Error fetching lab:", err);
    }
  };

  const totalLabs = labs.length;
  const activeLabs = labs.filter(lab => lab.Status === 'active').length;
  const underMaintenance = labs.filter(lab => lab.Status === 'under maintenance').length;

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
      width: isMobile ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: isMobile ? '0' : '255px',
      overflowX: 'hidden',
    },
    mainContent: {
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'stretch' : 'center',
      gap: isMobile ? '1rem' : '0',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    headerTitle: {
      fontSize: isMobile ? '20px' : isTablet ? '24px' : '28px',
      fontWeight: 700,
      color: '#2d3748',
      margin: 0
    },
    addButton: {
      padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: isMobile ? '12px' : '14px',
      transition: 'background 0.2s ease',
      width: isMobile ? 'auto' : 'auto',
      justifyContent: 'center'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: isMobile ? '1rem' : '1.25rem',
      marginBottom: isMobile ? '1.5rem' : '2rem',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '1.25rem' : '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    statLabel: {
      fontSize: isMobile ? '13px' : '14px',
      color: '#718096',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: isMobile ? '28px' : isTablet ? '32px' : '36px',
      fontWeight: 700,
      color: '#2d3748'
    },
    cardContainer: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? '0.75rem' : '1rem',
    },
    card: {
      background: "white",
      borderRadius: isMobile ? '10px' : '12px',
      padding: isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem',
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
      border: "1px solid #e5e7eb",
    },
    cardHeader: {
      display: "flex",
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: "space-between",
      gap: isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem',
    },
    cardLeft: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? '0.75rem' : '1rem',
      flex: "1",
      minWidth: isMobile ? 'auto' : '250px',
    },
    labIcon: {
      width: isMobile ? '40px' : '48px',
      height: isMobile ? '40px' : '48px',
      borderRadius: isMobile ? '8px' : '10px',
      background: "linear-gradient(135deg, #e0f7f0 0%, #d1f5ea 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#00c97b",
      flexShrink: 0,
    },
    cardInfo: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    cardIdRow: {
      display: "flex",
      alignItems: "center",
      flexWrap: 'wrap',
      gap: "10px",
    },
    cardId: {
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: 600,
      color: "#6b7280",
      letterSpacing: "0.5px",
    },
    cardName: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 700,
      color: "#1f2937",
      margin: 0,
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.3px",
    },
    statusActive: {
      background: "#d1fae5",
      color: "#065f46",
    },
    statusMaintenance: {
      background: "#fef3c7",
      color: "#92400e",
    },
    cardRight: {
      display: "flex",
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center',
      gap: isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem',
    },
    cardDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      flex: isMobile ? '1' : 'auto',
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      fontSize: isMobile ? '12px' : '13px',
      color: "#4b5563",
      gap: "2px",
    },
    detailLabel: {
      fontWeight: 600,
      color: "#6b7280",
      marginRight: "4px",
    },
    detailValue: {
      fontWeight: 600,
      color: "#1f2937",
    },
    actionButtons: {
      display: "flex",
      gap: isMobile ? '6px' : '8px',
      alignItems: "center",
      justifyContent: isMobile ? 'flex-start' : 'center',
    },
    iconButton: {
      width: isMobile ? '34px' : '36px',
      height: isMobile ? '34px' : '36px',
      background: "transparent",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    editButton: {
      color: "#00c97b",
      background: "#f0fdf4",
    },
    deleteButton: {
      color: "#ef4444",
      background: "#fef2f2",
    },
    viewButton: {
      color: "#00b8d9",
      background: "#ecfeff",
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
      zIndex: 1000,
      padding: isMobile ? '1rem' : '2rem',
    },
    modalContent: {
      background: 'white',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem',
      width: '100%',
      maxWidth: isMobile ? '100%' : isTablet ? '500px' : '600px',
      maxHeight: isMobile ? '90vh' : '95vh',
      overflowY: 'auto'
    },
    modalHeader: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 700,
      color: '#2d3748',
      marginBottom: isMobile ? '1rem' : '1.25rem',
      marginTop: 0
    },
    formGroup: {
      marginBottom: isMobile ? '1rem' : '1.25rem'
    },
    label: {
      display: 'block',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '15px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '15px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      background: 'white'
    },
    modalActions: {
      display: 'flex',
      flexDirection: 'row',
      gap: isMobile ? '0.75rem' : '12px',
      marginTop: isMobile ? '1.25rem' : '1.5rem',
    },
    cancelButton: {
      flex: 1,
      padding: isMobile ? '10px' : '12px',
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
      padding: isMobile ? '10px' : '12px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading lab data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Lab Management</h1>
        </header>

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

        {labs.length > 0 ? (
          <div style={styles.cardContainer}>
            {labs.map((lab) => (
              <div key={lab._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardLeft}>
                    <div style={styles.labIcon}>
                      <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div style={styles.cardInfo}>
                      <div style={styles.cardIdRow}>
                        <span style={styles.cardId}>#{lab.Lab_Name}</span>
                        <span style={{...styles.statusBadge, ...(lab.Status === 'Active' ? styles.statusActive : styles.statusMaintenance)}}>
                          {lab.Status}
                        </span>
                      </div>
                      <h3 style={styles.cardName}>{lab.Lab_ID}</h3>
                    </div>
                  </div>

                  <div style={styles.cardRight}>
                    <div style={styles.cardDetails}>
                      <div style={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        <span style={styles.detailLabel}>Lab Room:</span>
                        <span style={styles.detailValue}>{lab.Lab_Room}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span style={styles.detailLabel}>Capacity:</span>
                        <span style={styles.detailValue}>{lab.Total_Capacity}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span style={styles.detailLabel}>Technician:</span>
                        {lab?.LabTechnician?.length === 0 ? (
                          <span style={{ ...styles.detailValue, fontStyle: 'italic', color: '#9ca3af' }}>Not Assigned</span>
                        ) : (
                          lab.LabTechnician ? (                            
                            <span style={styles.detailValue}>{lab?.LabTechnician[0]?.Name}</span>
                            ) : (
                            <span style={{ ...styles.detailValue, fontStyle: 'italic', color: '#9ca3af' }}>Not Assigned</span>
                            )
                          )
                        }
                      </div>
                    </div>

                    <div style={styles.actionButtons}>
                      <button style={{ ...styles.iconButton, ...styles.viewButton }} onClick={() => { window.location.href = `/lab_technicianPanel/lab_management/lab/${lab._id}`; }}>
                        <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem 2rem', background: 'white', borderRadius: '12px', color: '#718096' }}>
            <p>No labs available. Please add a new lab.</p>
          </div>
        )}
        
      </main>
    </div>
  );
}