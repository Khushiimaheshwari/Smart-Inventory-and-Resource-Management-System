"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [metrics] = useState({
    totalAssets: 1247,
    activeAssets: 892,
    inactiveAssets: 355,
    utilization: 71.5,
  });
 
  // Line Chart Data
  const lineChartData = [
    { month: 'Jan', assets: 950, active: 720, inactive: 230 },
    { month: 'Feb', assets: 1020, active: 780, inactive: 240 },
    { month: 'Mar', assets: 1100, active: 830, inactive: 270 },
    { month: 'Apr', assets: 1050, active: 800, inactive: 250 },
    { month: 'May', assets: 1150, active: 850, inactive: 300 },
    { month: 'Jun', assets: 1180, active: 870, inactive: 310 },
    { month: 'Jul', assets: 1200, active: 880, inactive: 320 },
    { month: 'Aug', assets: 1220, active: 885, inactive: 335 },
    { month: 'Sep', assets: 1230, active: 890, inactive: 340 },
    { month: 'Oct', assets: 1240, active: 890, inactive: 350 },
    { month: 'Nov', assets: 1245, active: 891, inactive: 354 },
    { month: 'Dec', assets: 1247, active: 892, inactive: 355 },
  ];

  // Donut Chart Data
  const donutChartData = [
    { name: 'Digital', value: 45, color: '#10b981' },
    { name: 'Physical', value: 35, color: '#3b82f6' },
    { name: 'Software', value: 20, color: '#f59e0b' },
  ];

  const [activities] = useState([
    {
      id: 1,
      text: 'New digital asset "Server-001" added by John Doe',
      time: "2 minutes ago",
    },
    {
      id: 2,
      text: 'Asset maintenance scheduled for "Laptop-HPE-45"',
      time: "15 minutes ago",
    },
    {
      id: 3,
      text: "Asset audit completed for Q3 2024",
      time: "1 hour ago",
    },
    {
      id: 4,
      text: 'Software license "Adobe Creative Suite" renewed',
      time: "3 hours ago",
    },
  ]);

  const handleAddAsset = () => {
    alert("Add new asset clicked 🚀");
  };

  const handleGenerateReport = () => {
    alert("Generate report clicked 📊");
  };

  const handleExportData = () => {
    alert("Export data clicked 📂");
  };

  // Custom label for donut chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: '600' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const styles = {
    container: {
      width: 'calc(100% - 288px)', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '1.5rem',
      boxSizing: 'border-box',
      marginLeft: '245px',
      overflowX: 'hidden',
    },
    mainContent: {
      width: '100%',
      maxWidth: '100%',
      margin: '0',
    },
    header: {
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.5rem',
    },
    metricCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
    },
    metricHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem',
    },
    metricTitle: {
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    metricIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    iconSuccess: {
      backgroundColor: '#d1fae5',
      color: '#10b981',
    },
    iconWarning: {
      backgroundColor: '#fed7aa',
      color: '#f59e0b',
    },
    metricValue: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem',
      lineHeight: 1,
    },
    metricChange: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#10b981',
    },
    metricChangeNegative: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#f59e0b',
    },
    progressContainer: {
      marginTop: '0.75rem',
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '999px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      borderRadius: '999px',
      transition: 'width 1s ease-out',
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.5rem',
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      minHeight: '400px',
    },
    chartHeader: {
      marginBottom: '1rem',
    },
    chartTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.25rem',
    },
    chartSubtitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    actionSection: {
      marginBottom: '1.5rem',
    },
    actionButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
    },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.625rem 1.25rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    primaryBtn: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    secondaryBtn: {
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    activitySection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    activityItem: {
      display: 'flex',
      gap: '1rem',
      padding: '0.875rem',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      transition: 'background-color 0.2s ease',
    },
    activityDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      marginTop: '6px',
      flexShrink: 0,
    },
    activityContent: {
      flex: 1,
    },
    activityText: {
      color: '#1f2937',
      fontWeight: '500',
      marginBottom: '0.25rem',
      fontSize: '0.875rem',
    },
    activityTime: {
      fontSize: '0.8125rem',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Overview</h1>
        </header>

        {/* Metrics */}
        <div style={styles.metricsGrid}>
          {/* Total Assets */}
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <div style={styles.metricTitle}>Total Assets</div>
              <div style={{...styles.metricIcon, ...styles.iconSuccess}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div style={styles.metricValue}>
              {metrics.totalAssets.toLocaleString()}
            </div>
            <div style={styles.metricChange}>+12% from last month</div>
          </div>

          {/* Active Assets */}
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <div style={styles.metricTitle}>Active Assets</div>
              <div style={{...styles.metricIcon, ...styles.iconSuccess}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div style={styles.metricValue}>
              {metrics.activeAssets.toLocaleString()}
            </div>
            <div style={styles.metricChange}>+8% from last month</div>
          </div>

          {/* Inactive Assets */}
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <div style={styles.metricTitle}>Inactive Assets</div>
              <div style={{...styles.metricIcon, ...styles.iconWarning}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div style={styles.metricValue}>
              {metrics.inactiveAssets.toLocaleString()}
            </div>
            <div style={styles.metricChangeNegative}>
              -3% from last month
            </div>
          </div>

          {/* Asset Utilization */}
          <div style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <div style={styles.metricTitle}>Asset Utilization</div>
              <div style={{...styles.metricIcon, ...styles.iconSuccess}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div style={styles.metricValue}>
              {metrics.utilization}%
            </div>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div
                  style={{...styles.progressFill, width: `${metrics.utilization}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div style={styles.chartTitle}>Asset Usage Trends</div>
              <div style={styles.chartSubtitle}>
                12-month performance overview
              </div>
            </div>
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="assets" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    name="Total Assets"
                    animationDuration={2000}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Active"
                    animationDuration={2000}
                    dot={{ fill: '#3b82f6', r: 2.5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inactive" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Inactive"
                    animationDuration={2000}
                    dot={{ fill: '#f59e0b', r: 2.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div style={styles.chartTitle}>Asset Categories</div>
              <div style={styles.chartSubtitle}>
                Distribution breakdown
              </div>
            </div>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={90}
                    innerRadius={55}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {donutChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
              {donutChartData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actionSection}>
          <div style={styles.actionButtons}>
            <button
              style={{...styles.actionBtn, ...styles.primaryBtn}}
              onClick={handleAddAsset}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Asset
            </button>
            <button
              style={{...styles.actionBtn, ...styles.secondaryBtn}}
              onClick={handleGenerateReport}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Generate Report
            </button>
            <button
              style={{...styles.actionBtn, ...styles.secondaryBtn}}
              onClick={handleExportData}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export Data
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.activitySection}>
          <div style={styles.chartHeader}>
            <div style={styles.chartTitle}>Recent Activities</div>
            <div style={styles.chartSubtitle}>
              Latest system updates and asset changes
            </div>
          </div>

          {activities.map((activity) => (
            <div 
              key={activity.id} 
              style={styles.activityItem}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={styles.activityDot}></div>
              <div style={styles.activityContent}>
                <div style={styles.activityText}>{activity.text}</div>
                <div style={styles.activityTime}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}