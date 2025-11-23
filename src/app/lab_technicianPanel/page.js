"use client";
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
  const [assetBreakdown, setAssetBreakdown] = useState([]);

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
      const res = await fetch("/api/lab_technician/getMetricsCount"); 
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

  async function fetchAssetBreakdown() {
    try {
      const res = await fetch("/api/lab_technician/getAssetBreakdown");

      const data = await res.json();

      if (data.assetBreakdown) {
        console.log(data);
        setAssetBreakdown(data.assetBreakdown)
      };
      
    } catch (err) {
      console.error("Failed to fetch asset breakdown:", err);
    }
  }

  useEffect(() => {
    fetchMetrics();
    fetchAssetBreakdown();
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

  const detailsSectionStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile ? '1rem' : '1.25rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '1.5rem'
  };

  const tableStyle = { 
    width: '100%', 
    borderCollapse: 'collapse', 
    fontSize: isMobile ? '0.75rem' : '0.875rem' 
  };
  const theadStyle = { backgroundColor: '#f9fafb' };
  const thStyle = { 
    padding: isMobile ? '0.5rem' : '0.75rem 1rem', 
    textAlign: 'left', 
    fontWeight: '600', 
    color: '#374151', 
    borderBottom: '2px solid #e5e7eb' 
  };
  const tdStyle = { 
    padding: isMobile ? '0.5rem' : '0.75rem 1rem', 
    color: '#6b7280', 
    borderBottom: '1px solid #f3f4f6' 
  };

  const iconSize = isMobile ? '32px' : '40px';

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
          <div style={metricValueStyle}>{metrics.totalAssets.toLocaleString()}</div>
         
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

      <div style={detailsSectionStyle}>
        <div style={chartHeaderStyle}>
          <div style={chartTitleStyle}>Detailed Asset Breakdown</div>
          <div style={chartSubtitleStyle}>Assets by category and brand</div>
        </div>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Total</th>
              
                <th style={thStyle}>HP</th>
                <th style={thStyle}>Lenovo</th>
               
              </tr>
            </thead>
            <tbody>
              {assetBreakdown.map((item) => (
                <tr key={item.category} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#1f2937' }}>{item.category}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#10b981' }}>{item.total}</td>
                  
                  <td style={tdStyle}>{item.hp}</td>
                  <td style={tdStyle}>{item.lenovo}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}