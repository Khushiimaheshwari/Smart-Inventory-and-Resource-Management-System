'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const AssetsPage = () => {
  const { id } = useParams();
  const [pcData, setPcData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [viewingQR, setViewingQR] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    Asset_Name: "",
    Asset_Type: "Monitor",
    Assest_Status: "Yes",
    Brand: "",
    Issue_Reported: "",
    QR_Code: ""
  });
  const assetTypes = ["Monitor", "Keyboard", "Mouse", "CPU", "UPS", "Other"];

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchPC = async () => {
      try {
        const res = await fetch(`/api/lab_technician/getPcById/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPcData(data.pc);
          setAssets(data.pc.Assets);
          
        } else {
          console.error("Failed to fetch PC:", data.error);
        }
      } catch (err) {
        console.error("Error fetching PC:", err);
      }
    };

    fetchPC();
  }, []);

  const filteredAssets = selectedType === "All" 
    ? assets 
    : assets.filter(asset => asset.Asset_Type === selectedType.toLowerCase());

  const handleAddAsset = async () => {
    if (!newAsset.Asset_Name || !newAsset.Asset_Type || !newAsset.Assest_Status) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/lab_technician/addAsset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Asset_Name: newAsset.Asset_Name,
          Asset_Type: newAsset.Asset_Type,
          Assest_Status: newAsset.Assest_Status,
          Brand: newAsset.Brand,
          PC: pcData._id,
          Lab: pcData.Lab?._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      setAssets([
        ...assets,
        {
          id: assets.length + 1,
          Asset_Name: newAsset.Asset_Name,
          Asset_Type: newAsset.Asset_Type,
          Assest_Status: newAsset.Assest_Status,
          Brand: newAsset.Brand,
          // Issue_Reported: newAsset.Issue_Reported,
          // QR_Code: newAsset.QR_Code
        },
      ]);

      alert("Asset added successfully!");
      setShowAddModal(false);
      setNewAsset({
        Asset_Name: "",
        Asset_Type: "",
        Assest_Status: "",
        Brand: "",
      });
      resetForm();
    } catch (err) {
      console.error("Asset Error:", err);
      alert("Something went wrong while adding user.");
    }
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowAddModal(true);
    setNewAsset(asset);
  };

  const handleUpdateAsset = () => {
    setAssets(assets.map(a => a.id === editingAsset.id ? { ...newAsset, id: editingAsset.id } : a));
    setShowAddModal(false);
    setEditingAsset(null);
    resetForm();
  };

  const handleDeleteAsset = (assetId) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setAssets(assets.filter(a => a.id !== assetId));
    }
  };

  const resetForm = () => {
    setNewAsset({
      Asset_Name: "",
      Asset_Type: "Monitor",
      Assest_Status: "Yes",
      Brand: "",
      Issue_Reported: "",
      QR_Code: ""
    });
  };

  const handleDownloadQR = (qrCodeUrl, assetName) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR_${assetName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      border: '2px solid #e2e8f0',
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
      width: '20px',
      height: '20px',
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
    editButton: {
      color: '#10b981'
    },
    deleteButton: {
      color: '#ef4444'
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
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box',
      minHeight: '80px',
      resize: 'vertical'
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
        <button 
          style={styles.addButton} 
          onClick={() => setShowAddModal(true)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          Add New Asset
        </button>
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
          filteredAssets.map(asset => {
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
                    {asset.Brand}
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
                  <div style={styles.detailValue}>
                    {asset.Issue_Reported || "No issues"}
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

                <div style={styles.actionButtons}>
                  <button
                    style={{...styles.iconButton, ...styles.editButton}}
                    onClick={() => handleEditAsset(asset)}
                    title="Edit Asset"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    style={{...styles.iconButton, ...styles.deleteButton}}
                    onClick={() => handleDeleteAsset(asset.id)}
                    title="Delete Asset"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => {
          setShowAddModal(false);
          setEditingAsset(null);
          resetForm();
        }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>
              {editingAsset ? "Edit Asset" : "Add New Asset"}
            </h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Asset Name</label>
              <input
                type="text"
                style={styles.input}
                value={newAsset.Asset_Name}
                onChange={(e) => setNewAsset({...newAsset, Asset_Name: e.target.value})}
                placeholder="Enter asset name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Asset Type</label>
              <select
                style={styles.select}
                value={newAsset.Asset_Type}
                onChange={(e) => setNewAsset({...newAsset, Asset_Type: e.target.value})}
              >
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Brand Name</label>
              <input
                type="text"
                style={styles.input}
                value={newAsset.Brand}
                onChange={(e) => setNewAsset({...newAsset, Brand: e.target.value})}
                placeholder="Enter brand name"
              />
            </div>


            <div style={styles.formGroup}>
              <label style={styles.label}>Asset Status</label>
              <select
                style={styles.select}
                value={newAsset.Assest_Status}
                onChange={(e) => setNewAsset({...newAsset, Assest_Status: e.target.value})}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>QR Code</label>
              <input
                type="text"
                style={styles.input}
                value={newAsset.QR_Code}
                onChange={(e) => setNewAsset({...newAsset, QR_Code: e.target.value})}
                placeholder="Enter QR code"
              />
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAsset(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                style={styles.saveButton}
                onClick={editingAsset ? handleUpdateAsset : handleAddAsset}
              >
                {editingAsset ? "Update Asset" : "Add Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetsPage;