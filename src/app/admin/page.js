"use client";

import { useState } from "react";
import Link from "next/link"; // ✅ Use Next.js Link for navigation
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [metrics] = useState({
    totalAssets: 1247,
    activeAssets: 892,
    inactiveAssets: 355,
    utilization: 71.5,
  });

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

  return (
    <div className={styles["dashboard-container"]}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav>
          <ul className={styles["nav-menu"]}>
            <li className={styles["nav-item"]}>
              <a href="#" className={`${styles["nav-link"]} ${styles.active}`}>
                <svg
                  className={styles["nav-icon"]}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Dashboard
              </a>
            </li>

            <li className={styles["nav-item"]}>
             <Link href="/asset-manage" className={styles["nav-link"]}>
                <svg
                  className={styles["nav-icon"]}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Asset Management
              </Link>
            </li>

            <li className={styles["nav-item"]}>
              <a href="/lab-manage" className={styles["nav-link"]}>
                <svg
                  className={styles["nav-icon"]}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Lab Management
              </a>
            </li>

            <li className={styles["nav-item"]}>
              <Link href="/user-manage" className={styles["nav-link"]}>
                <svg
                  className={styles["nav-icon"]}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Lab Expert
              </Link>
            </li>

            <li className={styles["nav-item"]}>
              <a href="#" className={styles["nav-link"]}>
                <svg
                  className={styles["nav-icon"]}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles["main-content"]}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Overview</h1>
          <div className={styles["user-profile"]}>
          </div>
        </header>

        {/* Metrics */}
        <div className={styles["metrics-grid"]}>
          {/* Total Assets */}
          <div className={styles["metric-card"]}>
            <div className={styles["metric-header"]}>
              <div className={styles["metric-title"]}>Total Assets</div>
              <div className={`${styles["metric-icon"]} ${styles.success}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className={styles["metric-value"]}>
              {metrics.totalAssets.toLocaleString()}
            </div>
            <div className={styles["metric-change"]}>+12% from last month</div>
          </div>

          {/* Active Assets */}
          <div className={styles["metric-card"]}>
            <div className={styles["metric-header"]}>
              <div className={styles["metric-title"]}>Active Assets</div>
              <div className={`${styles["metric-icon"]} ${styles.success}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className={styles["metric-value"]}>
              {metrics.activeAssets.toLocaleString()}
            </div>
            <div className={styles["metric-change"]}>+8% from last month</div>
          </div>

          {/* Inactive Assets */}
          <div className={styles["metric-card"]}>
            <div className={styles["metric-header"]}>
              <div className={styles["metric-title"]}>Inactive Assets</div>
              <div className={`${styles["metric-icon"]} ${styles.warning}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className={styles["metric-value"]}>
              {metrics.inactiveAssets.toLocaleString()}
            </div>
            <div className={`${styles["metric-change"]} ${styles.negative}`}>
              -3% from last month
            </div>
          </div>

          {/* Asset Utilization */}
          <div className={styles["metric-card"]}>
            <div className={styles["metric-header"]}>
              <div className={styles["metric-title"]}>Asset Utilization</div>
              <div className={`${styles["metric-icon"]} ${styles.success}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className={styles["metric-value"]}>
              {metrics.utilization}%
            </div>
            <div className={styles["progress-container"]}>
              <div className={styles["progress-bar"]}>
                <div
                  className={styles["progress-fill"]}
                  style={{ width: `${metrics.utilization}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className={styles["charts-grid"]}>
          <div className={styles["chart-card"]}>
            <div className={styles["chart-header"]}>
              <div className={styles["chart-title"]}>Asset Usage Trends</div>
              <div className={styles["chart-subtitle"]}>
                12-month performance overview
              </div>
            </div>
            <div className={styles["chart-placeholder"]}>
              Line Chart: Asset Usage Over Time
            </div>
          </div>

          <div className={styles["chart-card"]}>
            <div className={styles["chart-header"]}>
              <div className={styles["chart-title"]}>Asset Categories</div>
              <div className={styles["chart-subtitle"]}>
                Distribution breakdown
              </div>
            </div>
            <div className={styles["chart-placeholder"]}>
              Donut Chart:<br />
              Digital 45% <br />
              Physical 35% <br />
              Software 20%
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles["action-section"]}>
          <div className={styles["action-buttons"]}>
            <button
              className={`${styles["action-btn"]} ${styles.primary}`}
              onClick={handleAddAsset}
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
              className={`${styles["action-btn"]} ${styles.secondary}`}
              onClick={handleGenerateReport}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Generate Report
            </button>
            <button
              className={`${styles["action-btn"]} ${styles.secondary}`}
              onClick={handleExportData}
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
        <div className={styles["activity-section"]}>
          <div className={styles["chart-header"]}>
            <div className={styles["chart-title"]}>Recent Activities</div>
            <div className={styles["chart-subtitle"]}>
              Latest system updates and asset changes
            </div>
          </div>

          {activities.map((activity) => (
            <div key={activity.id} className={styles["activity-item"]}>
              <div className={styles["activity-dot"]}></div>
              <div className={styles["activity-content"]}>
                <div className={styles["activity-text"]}>{activity.text}</div>
                <div className={styles["activity-time"]}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
