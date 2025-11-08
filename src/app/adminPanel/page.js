"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './Dashboard.module.css';

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Overview</h1>
      </header>

      {/* Metrics */}
      <div className={styles.metricsGrid}>
        {/* Total Assets */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricTitle}>Total Assets</div>
            <div className={`${styles.metricIcon} ${styles.iconSuccess}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className={styles.metricValue}>
            {metrics.totalAssets.toLocaleString()}
          </div>
          <div className={styles.metricChange}>+12% from last month</div>
        </div>

        {/* Active Assets */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricTitle}>Active Assets</div>
            <div className={`${styles.metricIcon} ${styles.iconSuccess}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className={styles.metricValue}>
            {metrics.activeAssets.toLocaleString()}
          </div>
          <div className={styles.metricChange}>+8% from last month</div>
        </div>

        {/* Inactive Assets */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricTitle}>Inactive Assets</div>
            <div className={`${styles.metricIcon} ${styles.iconWarning}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className={styles.metricValue}>
            {metrics.inactiveAssets.toLocaleString()}
          </div>
          <div className={styles.metricChangeNegative}>
            -3% from last month
          </div>
        </div>

        {/* Asset Utilization */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricTitle}>Asset Utilization</div>
            <div className={`${styles.metricIcon} ${styles.iconSuccess}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className={styles.metricValue}>
            {metrics.utilization}%
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{width: `${metrics.utilization}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Asset Usage Trends</div>
            <div className={styles.chartSubtitle}>
              12-month performance overview
            </div>
          </div>
          <div className={styles.chartContainer}>
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

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Asset Categories</div>
            <div className={styles.chartSubtitle}>
              Distribution breakdown
            </div>
          </div>
          <div className={styles.donutContainer}>
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
          <div className={styles.legendContainer}>
            {donutChartData.map((item) => (
              <div key={item.name} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: item.color }}></div>
                <span className={styles.legendText}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionSection}>
        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${styles.primaryBtn}`} onClick={handleAddAsset}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Asset
          </button>
          <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={handleGenerateReport}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Generate Report
          </button>
          <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={handleExportData}>
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
      <div className={styles.activitySection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>Recent Activities</div>
          <div className={styles.chartSubtitle}>
            Latest system updates and asset changes
          </div>
        </div>

        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityDot}></div>
            <div className={styles.activityContent}>
              <div className={styles.activityText}>{activity.text}</div>
              <div className={styles.activityTime}>{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}