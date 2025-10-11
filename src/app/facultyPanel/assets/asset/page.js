'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const LabDetailsPage = () => {
  const [selectedEquipment, setSelectedEquipment] = useState('Monitor');
  
  const equipmentTypes = ['Monitor', 'Keyboard', 'Mouse', 'CPU', 'Hard Drive', 'RAM'];
  
  const [equipmentData] = useState({
    Monitor: [
      { id: 1, name: 'Dell P2419H', serialNumber: 'MON-001', status: 'Active', condition: 'Good' },
      { id: 2, name: 'HP E243', serialNumber: 'MON-002', status: 'Active', condition: 'Good' },
      { id: 3, name: 'LG 24MK430H', serialNumber: 'MON-003', status: 'Active', condition: 'Fair' },
      { id: 4, name: 'Samsung S24F350', serialNumber: 'MON-004', status: 'Active', condition: 'Good' },
      { id: 5, name: 'Acer R240HY', serialNumber: 'MON-005', status: 'Maintenance', condition: 'Poor' },
    ],
    Keyboard: [
      { id: 1, name: 'Logitech K120', serialNumber: 'KEY-001', status: 'Active', condition: 'Good' },
      { id: 2, name: 'HP KB-0116', serialNumber: 'KEY-002', status: 'Active', condition: 'Good' },
      { id: 3, name: 'Dell KB216', serialNumber: 'KEY-003', status: 'Active', condition: 'Good' },
    ],
    Mouse: [
      { id: 1, name: 'Logitech B100', serialNumber: 'MOU-001', status: 'Active', condition: 'Good' },
      { id: 2, name: 'HP X1000', serialNumber: 'MOU-002', status: 'Active', condition: 'Fair' },
      { id: 3, name: 'Dell MS116', serialNumber: 'MOU-003', status: 'Active', condition: 'Good' },
    ],
    CPU: [
      { id: 1, name: 'Intel Core i5-10400', serialNumber: 'CPU-001', status: 'Active', condition: 'Excellent' },
      { id: 2, name: 'Intel Core i5-10400', serialNumber: 'CPU-002', status: 'Active', condition: 'Good' },
      { id: 3, name: 'Intel Core i3-9100', serialNumber: 'CPU-003', status: 'Active', condition: 'Good' },
    ],
    'Hard Drive': [
      { id: 1, name: 'Seagate 1TB HDD', serialNumber: 'HDD-001', status: 'Active', condition: 'Good' },
      { id: 2, name: 'WD Blue 500GB SSD', serialNumber: 'SSD-001', status: 'Active', condition: 'Excellent' },
    ],
    RAM: [
      { id: 1, name: 'Corsair 8GB DDR4', serialNumber: 'RAM-001', status: 'Active', condition: 'Good' },
      { id: 2, name: 'Kingston 16GB DDR4', serialNumber: 'RAM-002', status: 'Active', condition: 'Excellent' },
    ]
  });

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
    equipmentButtons: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    equipmentBtn: {
      padding: '12px 20px',
      borderRadius: '12px',
      fontWeight: 600,
      border: '2px solid #e2e8f0',
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#2d3748',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    equipmentBtnActive: {
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      borderColor: 'transparent'
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
      padding: '10px 12px',
      borderBottom: '2px solid #e2e8f0',
      color: '#718096',
      fontWeight: 600,
      fontSize: '14px'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e2e8f0',
      color: '#2d3748',
      fontSize: '14px'
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
    badgeExcellent: {
      background: 'rgba(0, 201, 123, 0.1)',
      color: '#00c97b'
    },
    badgeGood: {
      background: 'rgba(0, 184, 217, 0.1)',
      color: '#00b8d9'
    },
    badgeFair: {
      background: 'rgba(246, 173, 85, 0.1)',
      color: '#f6ad55'
    },
    badgePoor: {
      background: 'rgba(252, 129, 129, 0.1)',
      color: '#fc8181'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>PC 1 - Lab 1</h1>
        {/* <button style={styles.addButton}>
          <Plus size={16} />
          Add
        </button> */}
      </header>

      {/* Equipment Type Buttons */}
      <div style={styles.equipmentButtons}>
        {equipmentTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedEquipment(type)}
            style={{
              ...styles.equipmentBtn,
              ...(selectedEquipment === type ? styles.equipmentBtnActive : {})
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <p style={styles.infoText}>
          <strong>{selectedEquipment}</strong> is selected. Now all info of{' '}
          <strong>{selectedEquipment}</strong> in{' '}
          <strong>PC 1</strong> of{' '}
          <strong>Lab 1</strong> will be displayed.
        </p>
      </div>

      {/* Equipment Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Serial Number</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Condition</th>
            </tr>
          </thead>
          <tbody>
            {equipmentData[selectedEquipment].map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.id}</td>
                <td style={{...styles.td, fontWeight: 600}}>{item.name}</td>
                <td style={{...styles.td, color: '#718096'}}>{item.serialNumber}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    ...(item.status === 'Active' ? styles.badgeActive : styles.badgeMaintenance)
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    ...(item.condition === 'Excellent' ? styles.badgeExcellent :
                        item.condition === 'Good' ? styles.badgeGood :
                        item.condition === 'Fair' ? styles.badgeFair :
                        styles.badgePoor)
                  }}>
                    {item.condition}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabDetailsPage;