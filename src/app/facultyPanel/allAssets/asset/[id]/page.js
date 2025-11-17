'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from "next-auth/react";

const AssetsPage = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [faculty, setFaculty] = useState([]);
  const [pcData, setPcData] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [viewingQR, setViewingQR] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [assets, setAssets] = useState([]);
  const [viewingIssue, setViewingIssue] = useState(null);
  const [addingIssue, setAddingIssue] = useState(null);
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
  const [issueForm, setIssueForm] = useState({
    assetId: '',
    facultyId: '',
    issueDescription: ''
  });
  const assetTypes = ["Monitor", "Keyboard", "Mouse", "CPU", "UPS", "Other"];

  useEffect(() => {
    if (session) {
      setFaculty(prev => ({
        ...prev,
        facultyName: session.user.name,
        facultyId: session.user.id
      }));
    }
  }, [session]);

  useEffect(() => {
    const fetchPC = async () => {
      try {
        const res = await fetch(`/api/faculty/getPcById/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPcData(data.pc);
          setAssets(data.pc.Assets);
          console.log(data.pc.Assets);
          
        } else {
          console.error("Failed to fetch PC:", data.error);
        }
      } catch (err) {
        console.error("Error fetching PC:", err);
      }
    };

    fetchPC();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    }; checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredAssets = selectedType === "All" 
    ? assets 
    : assets.filter(asset => asset.Asset_Type === selectedType.toLowerCase());

  const handleRaiseIssue = async () => {
    
    if ( !issueForm.assetId || !issueForm.facultyId || !issueForm.issueDescription ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      assetId: issueForm.assetId,
      facultyId: issueForm.facultyId,
      description: issueForm.issueDescription,
    };
    console.log(payload);
    
    try {
      const res = await fetch("/api/faculty/raiseIssue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      alert("Issue raised successfully!");
      setAddingIssue(null);
      setIssueForm({ facultyId: '', issueDescription: '' });

    } catch (err) {
      console.error("Raise Issue Error:", err);
      alert("Something went wrong while adding Faculty.");
    }
  };

  const openIssueModal = (issue) => {
    setViewingIssue(issue);
    setCurrentIssueIndex(0);
  };

  const nextIssue = () => {
    if (!viewingIssue) return;
    setCurrentIssueIndex((prev) => 
      prev + 1 < viewingIssue.Issue_Reported.length ? prev + 1 : prev
    );
  };

  const prevIssue = () => {
    if (!viewingIssue) return;
    setCurrentIssueIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : prev
    );
  };

  function formatStatus(status) {
    if (!status) return "Pending";

    const map = {
      "pending": "Pending",
      "resolved by technician": "Resolved By Technician",
      "accepted": "Accepted"
    };

    return map[status] || status;
  }

  const handleDownloadQR = (qrCodeUrl, assetName) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR_${assetName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIssueStatusColor = (status) => {
    switch(status) {      
      case "pending": return { backgroundColor: '#fef3c7', color: '#92400e' };
      case "resolved by technician": return { backgroundColor: '#d1fae5', color: '#065f46' };
      case "accepted": return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default: return { backgroundColor: '#e5e7eb', color: '#374151' };
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Yes": return { bg: '#d1fae5', text: '#065f46' };
      case "No": return { bg: '#fee2e2', text: '#991b1b' };
      case "Other": return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#e5e7eb', text: '#374151' };
    }
  };
  
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
    infoBox: {
      background: 'rgba(239, 246, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '2px solid #93c5fd',
      borderRadius: '16px',
      padding: '16px 20px',
      marginBottom: '30px',
      boxShadow: '0 4px 20px rgba(0, 184, 217, 0.08)'
    },
    infoText: {
      color: '#1e3a8a',
      fontSize: '14px',
      lineHeight: '1.6',
      margin: 0
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
      border: '2px solid',
      borderColor: '#e2e8f0',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      textTransform: 'capitalize'
    },
    filterButtonActive: {
      background: '#10b981',
      color: 'white',
      borderColor: '#10b981'
    },
    assetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    assetCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative'
    },
    assetName: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '1rem'
    },
    assetDetail: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '0.75rem',
      fontSize: '14px'
    },
    detailLabel: {
      fontWeight: 600,
      color: '#4a5568',
      minWidth: '120px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    detailValue: {
      color: '#718096',
      flex: 1
    },
    issueContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      // gap: '0.5rem',
      flex: 1
    },
    issueBlock: {
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '6px',
      padding: '2px 10px',
      cursor: 'pointer',
      fontSize: '13px',
      color: '#92400e',
      transition: 'all 0.2s',
      display: 'inline-block',
      width: "auto"
    },
    noIssueText: {
      color: '#718096',
      fontWeight: 500,
      flex: 1
    },
    addIssueBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '4px 10px',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    modalHeader: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      transition: 'all 0.2s'
    },
    issueDetailRow: {
      marginBottom: '16px'
    },
    issueDetailLabel: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#6b7280',
      textTransform: 'uppercase',
      marginBottom: '6px',
      letterSpacing: '0.5px'
    },
    issueDetailValue: {
      fontSize: '15px',
      color: '#1f2937',
      lineHeight: '1.6'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: 600
    },
    navButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px'
    },
    navBtn: {
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '4px 10px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      cursor: 'pointer',
      background: 'white'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    submitBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600
    },
    qrCode: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      background: '#f7fafc',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: 600,
      color: '#10b981'
    },
    qrCodeThumbnail: {
      display: 'inline-block',
      transition: 'transform 0.2s ease'
    },
    qrImage: {
      width: '15px',
      height: '15px',
      display: 'block',
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
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#718096',
      gridColumn: '1 / -1'
    },
    qrModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    },
    qrModalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
      position: 'relative'
    },
    qrModalHeader: {
      fontSize: '20px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '1.5rem'
    },
    qrModalImage: {
      width: '250px',
      height: '250px',
      margin: '0 auto 1.5rem',
      display: 'block',
      border: '2px solid #e2e8f0',
      borderRadius: '8px'
    },
    downloadButton: {
      padding: '0.75rem 1.5rem',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      justifyContent: 'center',
      margin: '0 auto',
      transition: 'background 0.2s ease'
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: '#f7fafc',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#718096',
      transition: 'background 0.2s ease'
    }
  };  

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{pcData.PC_Name} {pcData.Lab?.Lab_ID}</h1>
      </header>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Filter by Asset Type</label>
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterButton,
              ...(selectedType === "All" ? styles.filterButtonActive : {})
            }}
            onClick={() => setSelectedType("All")}
          >
            All Types
          </button>
          {assetTypes.map(type => (
            <button
              key={type}
              style={{
                ...styles.filterButton,
                ...(selectedType === type ? styles.filterButtonActive : {})
              }}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          <strong>{selectedType}</strong> is selected. Now all info of{' '}
          <strong>{selectedType}</strong> in{' '}
          <strong>{pcData.PC_Name}</strong> of{' '}
          <strong>{pcData.Lab?.Lab_ID}</strong> will be displayed.
        </p>
      </div>

      {/* Asset Cards Grid */}
      <div style={styles.assetGrid}>
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => {
            const statusColors = getStatusColor(asset.Assest_Status);
            return (
              <div
                key={asset.id}
                style={styles.assetCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={styles.assetName}>{asset.Asset_Name}</div>
                
                <div style={styles.assetDetail}>
                  <div style={styles.detailLabel}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{color: '#10b981'}}>
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                    Asset Type
                  </div>
                  <div style={{...styles.detailValue, textTransform: 'capitalize', fontWeight: 500}}>
                    {asset.Asset_Type == "cpu" || asset.Asset_Type == "ups" ? asset.Asset_Type.toUpperCase() : asset.Asset_Type}
                  </div>
                </div>

                <div style={styles.assetDetail}>
                  <div style={styles.detailLabel}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{color: '#10b981'}}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Brand Name
                  </div>
                  <div style={styles.detailValue}>
                    {asset.Brand || "Not Specified"}
                  </div>
                </div>

                <div style={styles.assetDetail}>
                  <div style={styles.detailLabel}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{color: '#10b981'}}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Status
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors.bg,
                    color: statusColors.text
                  }}>
                    {asset.Assest_Status === "Yes" ? "Yes" : asset.Assest_Status === "No" ? "No" : "Other"}
                  </span>
                </div>

                <div style={styles.assetDetail}>
                  <div style={styles.detailLabel}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{color: '#10b981'}}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Issues
                  </div>
                  <div style={styles.issueContainer}>
                    {asset.Issue_Reported.length > 0 ? (
                      <div 
                        style={styles.issueBlock}
                        onClick={() => setViewingIssue(asset)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fde68a';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef3c7';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >

                        {asset.Issue_Reported.length} Issue{asset.Issue_Reported.length !== 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div style={styles.noIssueText}>No Issues</div>
                    )}
                    
                    <button 
                      style={styles.addIssueBtn}
                      onClick={() => {
                        setAddingIssue(asset);
                        setIssueForm({
                          assetId: asset._id,
                          facultyId: faculty.facultyId,
                          issueDescription: ""
                        });
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#10b981';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                      </svg>
                      Add Issue
                    </button>
                  </div>
                </div>

                <div style={styles.assetDetail}>
                  <div style={styles.detailLabel}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{color: '#10b981'}}>
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd"/>
                      <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z"/>
                    </svg>
                    QR Code
                  </div>
                  <div 
                    style={{...styles.qrCodeThumbnail, cursor: 'pointer'}}
                    onClick={() => setViewingQR(asset)}
                    title="Click to view QR code"
                  >
                    <img 
                      src={asset.QR_Code} 
                      alt="QR Code"
                      style={styles.qrImage}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <p>No assets found for the selected type.</p>
          </div>
        )}
      </div>

      {/* View Issue Modal */}
      {viewingIssue && (
        <div style={styles.modalOverlay} onClick={() => setViewingIssue(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>Issue Details</span>
              <button 
                style={styles.closeBtn}
                onClick={() => setViewingIssue(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            {/* Multiple issues */}
            {viewingIssue.Issue_Reported.length > 1 && (
              <div style={styles.navButtons}>
                <button 
                  style={styles.navBtn}
                  onClick={prevIssue}
                  disabled={currentIssueIndex === 0}>
                  ‹
                </button>

                <button 
                  style={styles.navBtn}
                  onClick={nextIssue}
                  disabled={currentIssueIndex === viewingIssue.Issue_Reported.length - 1}>
                  ›
                </button>
              </div>
            )}

            {/* Current Issue */}
            {(() => {
              const issue = viewingIssue.Issue_Reported[currentIssueIndex];
              return (
                <>
                  <div style={styles.issueDetailRow}>
                    <div style={styles.issueDetailLabel}>Asset Name</div>
                    <div style={styles.issueDetailValue}>{viewingIssue.Asset_Name}</div>
                  </div>

                  <div style={styles.issueDetailRow}>
                    <div style={styles.issueDetailLabel}>Faculty Name</div>
                    <div style={styles.issueDetailValue}>{issue.FacultyDetails?.Name || "N/A"}</div>
                  </div>

                  <div style={styles.issueDetailRow}>
                    <div style={styles.issueDetailLabel}>Issue Description</div>
                    <div style={styles.issueDetailValue}>{issue.IssueDescription}</div>
                  </div>

                  <div style={styles.issueDetailRow}>
                    <div style={styles.issueDetailLabel}>Status</div>
                    <span 
                      style={{
                        ...styles.statusBadge,
                        ...getIssueStatusColor(issue.Status)
                      }}>
                      {formatStatus(issue.Status)}
                    </span>
                  </div>
                </>
              );
            })()}
            
          </div>
        </div>
      )}

      {/* Add Issue Modal */}
      {addingIssue && (
        <div style={styles.modalOverlay} onClick={() => setAddingIssue(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>Report Issue</span>
              <button 
                style={styles.closeBtn}
                onClick={() => setAddingIssue(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            <div style={styles.issueDetailRow}>
              <div style={styles.issueDetailLabel}>Asset</div>
              <input 
                type="text"
                style={styles.input}
                value={addingIssue.Asset_Name}
                disabled                      
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Faculty Name *</label>
              <input 
                type="text"
                style={styles.input}
                value={faculty.facultyName}
                disabled                      
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Issue Description *</label>
              <textarea 
                style={styles.textarea}
                value={issueForm.issueDescription}
                onChange={(e) => setIssueForm({...issueForm, issueDescription: e.target.value})}
                placeholder="Describe the issue in detail..."
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <button 
              style={styles.submitBtn}
              onClick={handleRaiseIssue}
              disabled={!issueForm.issueDescription}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Raise Issue
            </button>
          </div>
        </div>
      )}

      {/* QR Code Viewer Modal */}
      {viewingQR && (
        <div style={styles.qrModal} onClick={() => setViewingQR(null)}>
          <div style={styles.qrModalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setViewingQR(null)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f7fafc'}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            <h3 style={styles.qrModalHeader}>{viewingQR.Asset_Name}</h3>
            
            <img 
              src={viewingQR.QR_Code}
              alt="QR Code"
              style={styles.qrModalImage}
            />
            
            <button 
              style={styles.downloadButton}
              onClick={() => handleDownloadQR(viewingQR.QR_Code, viewingQR.Asset_Name)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Download QR Code
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AssetsPage;