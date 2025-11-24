"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function LabOverview() {
  const [loading, setLoading] = useState(true);
  const [labDetails, setLabDetails] = useState([]);
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
    const fetchLabData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/labAssetSummary");
        const data = await res.json();

        console.log(data);
        
        if (data.summary) {
          setLabDetails(data.summary);
        }
      } catch (error) {
        console.error("Error loading lab data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLabData();
  }, []);

  const styles = {
    container: {
      width: isMobile ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: isMobile ? '0' : '255px',
      overflowX: 'hidden',
      transition: 'all 0.3s ease'
    },
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
    header: {
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    subtitle: {
      fontSize: isMobile ? '0.875rem' : '1rem',
      color: '#6b7280',
      marginTop: '0.5rem'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.25rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    summaryLabel: {
      color: '#6b7280',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    },
    summaryValue: {
      fontSize: isMobile ? '1.5rem' : '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    tableSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.25rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '1.5rem'
    },
    tableHeader: {
      marginBottom: '1rem'
    },
    tableTitle: {
      fontSize: isMobile ? '1rem' : '1.125rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.25rem'
    },
    tableSubtitle: {
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      color: '#6b7280'
    },
    tableWrapper: {
      overflowX: 'auto',
      marginTop: '1rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: isMobile ? '0.75rem' : '0.875rem'
    },
    thead: {
      backgroundColor: '#f9fafb'
    },
    th: {
      padding: isMobile ? '0.75rem 0.5rem' : '0.75rem 1rem',
      textAlign: 'left',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '2px solid #e5e7eb'
    },
    td: {
      padding: isMobile ? '0.75rem 0.5rem' : '0.75rem 1rem',
      color: '#6b7280',
      borderBottom: '1px solid #f3f4f6'
    },
    tdBold: {
      padding: isMobile ? '0.75rem 0.5rem' : '0.75rem 1rem',
      fontWeight: '600',
      color: '#1f2937',
      borderBottom: '1px solid #f3f4f6'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: isMobile ? '0.7rem' : '0.75rem',
      fontWeight: '500',
      display: 'inline-block'
    },
    statusActive: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    statusNonActive: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    statusMaintenance: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
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
      <header style={styles.header}>
        <h1 style={styles.title}>Lab Inventory</h1>
        <p style={styles.subtitle}>Comprehensive view of all laboratory facilities</p>
      </header>

      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <div style={styles.tableTitle}>Laboratory Details</div>
          <div style={styles.tableSubtitle}>Asset distribution across all labs</div>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Lab ID</th>
                <th style={styles.th}>PC Count</th>
                <th style={styles.th}>Total Assets</th>
                <th style={styles.th}>Active Assets</th>
                <th style={styles.th}>Non Active Assets</th>
                <th style={styles.th}>Under Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {labDetails.map((lab) => (
                <tr 
                  key={lab.labId}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={styles.tdBold}>{lab.labId}</td>
                  <td style={styles.td}>{lab.pcCount}</td>
                  <td style={{...styles.td, fontWeight: '600', color: '#10b981'}}>{lab.totalAssets}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...styles.statusActive}}>
                      {lab.activeAssets}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...styles.statusNonActive}}>
                      {lab.nonActiveAssets}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...styles.statusMaintenance}}>
                      {lab.underMaintenance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}