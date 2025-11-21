"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    totalLabs: 0,
    totalSubjects: 0,
    totalPrograms: 0,
    totalTechnicians: 0,
    totalFaculty: 0,
  });
  const [assetCategoryData, setAssetCategoryData] = useState([]);
  const [labDistributionData, setLabDistributionData] = useState([]);
  const [facultyDistributionData, setFacultyDistributionData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMetrics()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch("/api/faculty/getMetricsCount"); 
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        setAssetCategoryData(data.assetCategoryData);
        setLabDistributionData(data.labDistributionData);
        console.log(data);
      }
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }

  async function fetchFaculty() {
    try {
      const res = await fetch("/api/faculty/getFacultyDistribution"); 
      const data = await res.json();
      if (data.facultyDistributionData) {
        setFacultyDistributionData(data.facultyDistributionData);
        console.log(data);
      }
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }


  useEffect(() => {
    fetchMetrics();
    fetchFaculty();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#000000" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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
    }
  }

  const containerStyle = {
    width: isMobile ? '100%' : 'calc(100% - 255px)',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: isMobile ? '1rem' : '2rem',
    marginLeft: isMobile ? '0' : '255px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  };

  const headerStyle = { marginBottom: '1.5rem' };
  const titleStyle = { 
    fontSize: isMobile ? '1.5rem' : '2rem', 
    fontWeight: 'bold', 
    color: '#1f2937', 
    margin: 0 
  };

  const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  };

  const metricCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile ? '1rem' : '1.25rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const metricHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  };

  const metricTitleStyle = { 
    color: '#6b7280', 
    fontSize: isMobile ? '0.75rem' : '0.875rem', 
    fontWeight: '500' 
  };
  
  const metricValueStyle = { 
    fontSize: isMobile ? '1.5rem' : '1.875rem', 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: '0.5rem' 
  };
  
  const metricChangeStyle = { 
    fontSize: isMobile ? '0.7rem' : '0.875rem', 
    color: '#6b7280' 
  };

  const chartsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  };

  const chartCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile ? '1rem' : '1.25rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    minHeight: isMobile ? '320px' : '400px'
  };

  const chartHeaderStyle = { marginBottom: '1rem' };
  const chartTitleStyle = { 
    fontSize: isMobile ? '1rem' : '1.125rem', 
    fontWeight: 'bold', 
    color: '#1f2937', 
    marginBottom: '0.25rem' 
  };
  const chartSubtitleStyle = { 
    fontSize: isMobile ? '0.75rem' : '0.875rem', 
    color: '#6b7280' 
  };

  const iconSize = isMobile ? '32px' : '40px';

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Overview</h1>
      </header>

      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <div style={metricHeaderStyle}>
            <div style={metricTitleStyle}>Total Assets</div>
            <div style={{ width: iconSize, height: iconSize, borderRadius: '10px', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div style={metricValueStyle}>{metrics.totalLabAssets.toLocaleString()}</div>
         
        </div>

        <div style={metricCardStyle}>
          <div style={metricHeaderStyle}>
            <div style={metricTitleStyle}>Total Labs</div>
            <div style={{ width: iconSize, height: iconSize, borderRadius: '10px', backgroundColor: '#dbeafe', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-2h-1a1 1 0 110-2h1V9h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div style={metricValueStyle}>{metrics.totalLabs}</div>
          <div style={metricChangeStyle}>5 departments</div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricHeaderStyle}>
            <div style={metricTitleStyle}>Total Subjects</div>
            <div style={{ width: iconSize, height: iconSize, borderRadius: '10px', backgroundColor: '#ede9fe', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
          </div>
          <div style={metricValueStyle}>{metrics.totalSubjects}</div>
          
        </div>

        <div style={metricCardStyle}>
          <div style={metricHeaderStyle}>
            <div style={metricTitleStyle}>Total Programs</div>
            <div style={{ width: iconSize, height: iconSize, borderRadius: '10px', backgroundColor: '#fed7aa', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <div style={metricValueStyle}>{metrics.totalPrograms}</div>
         
        </div>
      </div>

      <div style={chartsGridStyle}>
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <div style={chartTitleStyle}>Asset Categories</div>
            <div style={chartSubtitleStyle}>Technical vs Non-Technical Distribution</div>
          </div>
          <div style={{ width: '100%', height: isMobile ? '220px' : '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetCategoryData} cx="50%" cy="50%" labelLine={false} label={renderCustomLabel} outerRadius={isMobile ? 70 : 90} innerRadius={isMobile ? 40 : 55} dataKey="value" animationBegin={0} animationDuration={1500}>
                  {assetCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
            {assetCategoryData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                <span style={{ fontSize: isMobile ? '11px' : '13px', color: '#6b7280' }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <div style={chartTitleStyle}>Lab Distribution</div>
            <div style={chartSubtitleStyle}>By Department Categories</div>
          </div>
          <div style={{ width: '100%', height: isMobile ? '220px' : '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={labDistributionData} cx="50%" cy="50%" labelLine={false} label={renderCustomLabel} outerRadius={isMobile ? 70 : 90} innerRadius={isMobile ? 40 : 55} dataKey="value" animationBegin={0} animationDuration={1500}>
                  {labDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            {labDistributionData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#6b7280' }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={chartsGridStyle}>
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <div style={chartTitleStyle}>Faculty Distribution</div>
            <div style={chartSubtitleStyle}>By Designation Type</div>
          </div>
          <div style={{ width: '100%', height: isMobile ? '220px' : '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={facultyDistributionData} cx="50%" cy="50%" labelLine={false} label={renderCustomLabel} outerRadius={isMobile ? 70 : 90} innerRadius={isMobile ? 40 : 55} dataKey="value" animationBegin={0} animationDuration={1500}>
                  {facultyDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
            {facultyDistributionData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                <span style={{ fontSize: isMobile ? '11px' : '13px', color: '#6b7280' }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}