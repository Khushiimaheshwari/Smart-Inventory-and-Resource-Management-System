"use client";

import React from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LabDetail({ params }) {
  // const labId = params.id; 
  const { id: labId } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [labData, setLabData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchLabDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/getLabDetail/${labId}`);
        const data = await res.json();
        if (data.labData) {
          console.log(data);
          
          setLabData(data.labData);
          setAssets(data.assets);
        }
      } catch (error) {
        console.error("Error loading lab detail:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (labId) {
      fetchLabDetail();
    }
  }, [labId]);

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
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      color: '#374151',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginBottom: '1rem',
      width: 'fit-content',
      transition: 'all 0.2s'
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
      fontSize: isMobile ? '0.65rem' : '0.875rem'
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
      fontSize: isMobile ? '0.65rem' : '0.75rem',
      fontWeight: '500',
      display: 'inline-block'
    },
    statusActive: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    statusMaintenance: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    statusInactive: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading lab details...</p>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    if (status === 'Yes') return styles.statusActive;
    if (status === 'No') return styles.statusInactive;
    return styles.statusMaintenance;
  };

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => router.back()}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
          e.currentTarget.style.borderColor = '#10b981';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        <ArrowLeft size={16} />
        Back to Labs
      </button>

      <header style={styles.header}>
        <h1 style={styles.title}>{labData.Lab_ID}</h1>
        <p style={styles.subtitle}>Complete asset inventory and status</p>
      </header>

      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <div style={styles.tableTitle}>Asset Details</div>
          <div style={styles.tableSubtitle}>All assets with their current status</div>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>PC No.</th>
                <th style={styles.th}>Monitor</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Keyboard</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Mouse</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>UPS</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr 
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={styles.tdBold}>{asset.pcName}</td>
                  <td style={styles.td}>{asset.monitor?.name || "-"}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...getStatusStyle(asset.monitor?.status)}}>
                      {asset.monitor?.status || "-"}
                    </span>
                  </td>
                  <td style={styles.td}>{asset.keyboard?.name || "-"}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...getStatusStyle(asset.keyboard?.status)}}>
                      {asset.keyboard?.status || "-"}
                    </span>
                  </td>
                  <td style={styles.td}>{asset.mouse?.name || "-"}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...getStatusStyle(asset.mouse?.status)}}>
                      {asset.mouse?.status || "-"}
                    </span>
                  </td>
                  <td style={styles.td}>{asset.ups?.name || "-"}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...getStatusStyle(asset.ups?.status)}}>
                      {asset.ups?.status || "-"}
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