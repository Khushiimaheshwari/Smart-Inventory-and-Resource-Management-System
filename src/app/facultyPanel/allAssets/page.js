"use client";

import { useEffect, useState } from "react"; 

export default function AssetManagement() {
  const [pcs, setPCs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchPCs = async () => {
      try {
        const res = await fetch('/api/faculty/getlabPCs');

        if (!res.ok) {
          throw new Error('Failed to fetch PCs');
        }

        const data = await res.json();
        console.log(data);
        
        setPCs(
          data.pcs.flatMap(item =>
            item.pcs.map(pc => ({
              id: pc._id,
              PC_Name: pc.PC_Name,
              Lab: item.lab,  
              Assets: pc.Assets || []
            }))
          )
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
        const res = await fetch("/api/faculty/getLabs");
        const data = await res.json();
        console.log(data);       

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch labs");
        }

        setLabs(data.labs.map((l) => {
          return l.lab;
        }));
        
      } catch (err) {
        console.error("Error fetching labs:", err);
        alert("Failed to load labs. Please try again later.");
      }
    };

    fetchLabs();
  }, []);

  const filteredPCs = selectedLab === "all" 
    ? pcs 
    : pcs.filter(pc => pc.Lab._id === selectedLab);

  const getLabName = (labData) => {
    if (!labData) return "Unknown Lab";
    return labData.name || labData.Lab_ID || "Unnamed Lab";
  }

  const styles = {
    container: {
      width: isMobile ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: isMobile ? '0' : '255px',
      overflowX: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem 2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      gap: isMobile ? '1rem' : '0'
    },
    headerTitle: {
      fontSize: isMobile ? '20px' : '28px',
      fontWeight: 600,
      color: '#2d3748',
      margin: 0,
      width: isMobile ? '100%' : 'auto'
    },
    filterSection: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    filterLabel: {
      fontSize: isMobile ? '13px' : '14px',
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
      padding: isMobile ? '0.5rem 0.875rem' : '0.5rem 1rem',
      background: '#f7fafc',
      color: '#4a5568',
      border: '2px solid',
      borderColor: '#e2e8f0',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      fontSize: isMobile ? '13px' : '14px',
      transition: 'all 0.2s ease',
    },
    filterButtonActive: {
      background: '#10b981',
      color: 'white',
      borderColor: '#10b981'
    },
    pcGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: isMobile ? '1rem' : '1.5rem'
    },
    pcCard: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1.25rem' : '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      position: 'relative'
    },
    pcName: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '0.5rem'
    },
    pcLab: {
      fontSize: isMobile ? '13px' : '14px',
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
      fontSize: isMobile ? '11px' : '12px',
      fontWeight: 600,
      color: '#4a5568',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    assetsCount: {
      fontSize: isMobile ? '13px' : '14px',
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
      padding: isMobile ? '0.625rem' : '0.5rem',
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
    redirectButton: {
      color: '#3b82f6'
    },
    emptyState: {
      padding: isMobile ? '2rem' : '3rem',
      color: '#718096',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>My Lab Assets</h1>
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
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                }
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
                  {pc?.Assets?.length} item{pc?.Assets?.length !== 1 ? 's' : ''} assigned
                </div>
              </div>
              <div style={styles.actionButtons}>
                <button
                  style={{...styles.iconButton, ...styles.redirectButton}}
                  onClick={() => {
                    window.location.href = `/facultyPanel/allAssets/asset/${pc.id}`;
                  }}
                  title="View Details"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
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
    </div>
  );
}