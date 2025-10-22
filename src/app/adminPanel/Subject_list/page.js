"use client";

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown, Filter } from 'lucide-react';

export default function SubjectListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('code');
  const [expandedSubject, setExpandedSubject] = useState(null);

  const subjects = [
    {
      id: 1,
      code: 'CSE301',
      name: 'Data Structures and Algorithms',
      status: 'uploaded',
      programCount: 2,
      department: 'Computer Science'
    },
    {
      id: 2,
      code: 'CSE402',
      name: 'Machine Learning',
      status: 'pending',
      programCount: 1,
      department: 'Computer Science'
    },
    {
      id: 3,
      code: 'CSE303',
      name: 'Database Management Systems',
      status: 'uploaded',
      programCount: 2,
      department: 'Computer Science'
    },
    {
      id: 4,
      code: 'ECE201',
      name: 'Digital Electronics',
      status: 'uploaded',
      programCount: 3,
      department: 'Electronics'
    },
    {
      id: 5,
      code: 'ME101',
      name: 'Engineering Mechanics',
      status: 'pending',
      programCount: 0,
      department: 'Mechanical'
    }
  ];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || subject.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (sortBy === 'code') return a.code.localeCompare(b.code);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="subject-list-container">
      <style jsx>{`
        .subject-list-container {
          width: calc(100% - 220px);
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 2rem;
          box-sizing: border-box;
          margin-left: 255px;
          overflow-x: hidden;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #10b981;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: background-color 0.2s;
        }

        .add-btn:hover {
          background-color: #059669;
        }

        .filters-card {
          background-color: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .search-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #374151;
          font-weight: 500;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-select:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .result-count {
          margin-left: auto;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .subjects-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .subject-card {
          background-color: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .subject-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .subject-card-content {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .subject-info-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .subject-avatar {
          width: 4rem;
          height: 4rem;
          background-color: #f3f4f6;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .subject-avatar span {
          font-size: 1.25rem;
          font-weight: 700;
          color: #6b7280;
        }

        .subject-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .subject-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .subject-code {
          color: #6b7280;
          margin: 0;
          font-size: 0.95rem;
        }

        .subject-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-badge.uploaded {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .program-badge {
          padding: 0.5rem 1rem;
          background-color: #dbeafe;
          color: #1e40af;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .icon-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn.add-icon {
          color: #10b981;
        }

        .icon-btn.add-icon:hover {
          background-color: #d1fae5;
        }

        .icon-btn.edit-icon {
          color: #3b82f6;
        }

        .icon-btn.edit-icon:hover {
          background-color: #dbeafe;
        }

        .icon-btn.delete-icon {
          color: #ef4444;
        }

        .icon-btn.delete-icon:hover {
          background-color: #fee2e2;
        }

        .icon-btn.expand-icon {
          color: #6b7280;
        }

        .icon-btn.expand-icon:hover {
          background-color: #f3f4f6;
        }

        .rotated {
          transform: rotate(180deg);
          transition: transform 0.2s;
        }

        .icon-btn svg {
          transition: transform 0.2s;
        }

        .expanded-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .expanded-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding-top: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .info-value {
          font-weight: 500;
          color: #111827;
          margin: 0;
        }

        .no-results {
          background-color: white;
          border-radius: 0.75rem;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .no-results p {
          color: #6b7280;
          font-size: 1.125rem;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .subject-actions {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .add-btn {
            width: 100%;
            justify-content: center;
          }

          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .result-count {
            margin-left: 0;
            text-align: left;
          }

          .subject-card-content {
            flex-direction: column;
            gap: 1.5rem;
          }

          .subject-info-section {
            width: 100%;
          }

          .subject-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .expanded-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="content-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <h2 className="page-title">Subject List</h2>
          <button className="add-btn">
            <Plus size={20} />
            <span>Add Subject</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="filters-card">
          {/* Search Bar */}
          <div className="search-wrapper">
            <div className="search-icon">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search subjects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="filter-label">
              <Filter size={18} />
              <span>Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="uploaded">Uploaded</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="code">Sort by Code</option>
              <option value="name">Sort by Name</option>
            </select>

            <div className="result-count">
              Showing {sortedSubjects.length} of {subjects.length} subjects
            </div>
          </div>
        </div>

        {/* Subject List */}
        <div className="subjects-list">
          {sortedSubjects.map((subject, index) => (
            <div key={subject.id} className="subject-card">
              <div className="subject-card-content">
                <div className="subject-info-section">
                  <div className="subject-avatar">
                    <span>S{index + 1}</span>
                  </div>

                  <div className="subject-details">
                    <h3 className="subject-name">{subject.name}</h3>
                    <p className="subject-code">Code: {subject.code}</p>
                  </div>
                </div>

                <div className="subject-actions">
                  <span className={`status-badge ${subject.status}`}>
                    {subject.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                  </span>

                  <span className="program-badge">
                    {subject.programCount} {subject.programCount === 1 ? 'Program' : 'Programs'}
                  </span>

                  <button className="icon-btn add-icon">
                    <Plus size={20} />
                  </button>

                  <button className="icon-btn edit-icon">
                    <Edit2 size={20} />
                  </button>

                  <button className="icon-btn delete-icon">
                    <Trash2 size={20} />
                  </button>

                  <button 
                    onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                    className="icon-btn expand-icon"
                  >
                    <ChevronDown 
                      size={20} 
                      className={expandedSubject === subject.id ? 'rotated' : ''}
                    />
                  </button>
                </div>
              </div>

              {expandedSubject === subject.id && (
                <div className="expanded-content">
                  <div className="expanded-grid">
                    <div className="info-item">
                      <p className="info-label">Department</p>
                      <p className="info-value">{subject.department}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label">Total Programs</p>
                      <p className="info-value">{subject.programCount}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label">Status</p>
                      <p className="info-value">{subject.status === 'uploaded' ? 'Active' : 'Pending Approval'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedSubjects.length === 0 && (
          <div className="no-results">
            <p>No subjects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}