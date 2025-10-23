"use client";

import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown, Filter, Upload } from 'lucide-react';

export default function SubjectListPage() {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('courseCode');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    courseName: '',
    courseCode: '',
    courseDepartment: ''
  });
  const [newProgram, setNewProgram] = useState({
    programName: '',
    programSection: '',
    programSemester: '',
    programGroup: '',
    programBatch: '',
    numberOfHours: '',
    facultyAssigned: '',
    labAllocated: ''
  });

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const res = await fetch("/api/admin/getSubjects");
        const data = await res.json();
        if (res.ok) {
          setSubjects(data.subjects);
          console.log(data);
          
        } else {
          console.error("Failed to fetch subject:", data.error);
        }
      } catch (err) {
        console.error("Error fetching subject:", err);
      }
    };

    fetchLab();
  }, []);

  const faculties = [
    { _id: 'f1', Name: 'Dr. John Smith', Email: 'john@university.edu' },
    { _id: 'f2', Name: 'Dr. Sarah Johnson', Email: 'sarah@university.edu' },
    { _id: 'f3', Name: 'Prof. Mike Wilson', Email: 'mike@university.edu' }
  ];

  const labs = [
    { _id: 'l1', name: 'Computer Lab 1', id: 'LAB-101' },
    { _id: 'l2', name: 'Computer Lab 2', id: 'LAB-102' },
    { _id: 'l3', name: 'Computer Lab 3', id: 'LAB-103' }
  ];

  const handleAddSubject = async () => {
    if (!newSubject.courseName || !newSubject.courseCode || !newSubject.courseDepartment) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = {
      courseName: newSubject.courseName,
      courseCode: newSubject.courseCode,
      courseDepartment: newSubject.courseDepartment,
    }

    try {
      const res = await fetch("/api/admin/addSubject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Subject added successfully!");
        setShowAddModal(false);
        setNewSubject({ courseName: '', courseCode: '', courseDepartment: '' });
      } else {
        alert(data.error || "Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Something went wrong while adding the subject.");
    }
  };

  const handleOpenAddProgram = (subject) => {
    setSelectedSubject(subject);
    setShowAddProgramModal(true);
  };

  const handleAddProgram = () => {
    console.log('Adding program for subject:', selectedSubject);
    console.log('Program data:', newProgram);
    setShowAddProgramModal(false);
    setNewProgram({
      programName: '',
      programSection: '',
      programSemester: '',
      programGroup: '',
      programBatch: '',
      numberOfHours: '',
      facultyAssigned: '',
      labAllocated: ''
    });
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.Course_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subject.experimentList.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || subject.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

    const sortedSubjects = [...filteredSubjects].sort((a, b) => {
      if (sortBy === 'courseCode') return a.courseCode.localeCompare(b.courseCode);
      if (sortBy === 'Course_Name') return a.Course_Name.localeCompare(b.Course_Name);
      return 0; 
    });
  
  const handleFileUpload = (subjectId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Uploading file for subject:', subjectId, file);
      }
    };
    input.click();
  };

  const styles = {
    subjectListContainer: {
      width: "calc(100% - 230px)",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "2rem",
      boxSizing: "border-box",
      marginLeft: "255px",
      overflowX: "hidden",
    },

    contentWrapper: {
      maxWidth: "1400px",
      margin: "0 auto",
    },

    pageHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "2rem",
    },

    pageTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#111827",
      margin: "0",
    },

    addBtn: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: "#10b981",
      color: "white",
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      transition: "background-color 0.2s",
    },

    addBtnHover: {
      backgroundColor: "#059669",
    },

    filtersCard: {
      backgroundColor: "white",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },

    searchWrapper: {
      position: "relative",
      marginBottom: "1rem",
    },

    searchIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none",
      zIndex: "1",
    },

    searchInput: {
      width: "100%",
      padding: "0.75rem 1rem 0.75rem 3rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },

    searchInputFocus: {
      borderColor: "#10b981",
      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
    },

    filtersRow: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "1rem",
    },

    filterLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#374151",
      fontWeight: "500",
    },

    filterSelect: {
      padding: "0.5rem 1rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      outline: "none",
      cursor: "pointer",
      transition: "border-color 0.2s",
    },

    filterSelectFocus: {
      borderColor: "#10b981",
      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
    },

    resultCount: {
      marginLeft: "auto",
      fontSize: "0.875rem",
      color: "#6b7280",
    },

    subjectsList: {
      display: "flex",
      marginTop: "1.5rem",
      flexDirection: "column",
      gap: "1rem",
    },

    subjectCard: {
      backgroundColor: "white",
      borderRadius: "0.75rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "box-shadow 0.2s",
    },

    subjectCardHover: {
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },

    subjectCardContent: {
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    subjectInfoSection: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
    },

    subjectAvatar: {
      width: "4rem",
      height: "4rem",
      backgroundColor: "#f3f4f6",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
    },

    subjectAvatarSpan: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#6b7280",
    },

    subjectDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },

    subjectName: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#111827",
      margin: "0",
    },

    subjectCode: {
      color: "#6b7280",
      margin: "0",
      fontSize: "0.95rem",
    },

    subjectActions: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },

    statusBadge: {
      padding: "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
    },

    statusBadgeUploaded: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
    },

    statusBadgePending: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },

    programBadge: {
      padding: "0.5rem 1rem",
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
    },

    iconBtn: {
      padding: "0.5rem",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    iconBtnAddIcon: {
      color: "#3b82f6",
    },

    iconBtnEditIcon: {
      color: "#10b981",
    },

    iconBtnDeleteIcon: {
      color: "#ef4444",
    },

    iconBtnExpandIcon: {
      color: "#6b7280",
    },

    rotated: {
      transform: "rotate(180deg)",
      transition: "transform 0.2s",
    },

    iconBtnSvg: {
      transition: "transform 0.2s",
    },

    expandedContent: {
      padding: "0 1.5rem 1.5rem 1.5rem",
      borderTop: "1px solid #e5e7eb",
      animation: "slideDown 0.2s ease-out",
    },

    expandedContentAlt: {
      borderTop: "1px solid #e5e7eb",
      padding: "24px",
      backgroundColor: "#f9fafb",
    },

    expandedSection: {
      marginBottom: "24px",
    },

    expandedSectionLast: {
      marginBottom: "0",
    },

    sectionTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#374151",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },

    uploadSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "2px dashed #d1d5db",
    },

    uploadButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "8px 16px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "background-color 0.2s",
    },

    uploadButtonHover: {
      backgroundColor: "#2563eb",
    },

    fileName: {
      fontSize: "14px",
      color: "#374151",
      fontWeight: "500",
    },

    noFileText: {
      fontSize: "14px",
      color: "#9ca3af",
      fontStyle: "italic",
    },

    programsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "16px",
    },

    programCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "16px",
      border: "1px solid #e5e7eb",
    },

    programHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },

    programName: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "4px",
    },

    programMeta: {
      fontSize: "12px",
      color: "#6b7280",
    },

    programBadgeAlt: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },

    programDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    detailRow: {
      display: "flex",
      fontSize: "13px",
    },

    detailLabel: {
      fontWeight: "600",
      minWidth: "100px",
      color: "#374151",
    },

    detailValue: {
      color: "#6b7280",
    },

    expandedGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem",
      paddingTop: "1.5rem",
    },

    infoItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },

    infoLabel: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: "0",
    },

    infoValue: {
      fontWeight: "500",
      color: "#111827",
      margin: "0",
    },

    noResults: {
      backgroundColor: "white",
      borderRadius: "0.75rem",
      padding: "3rem",
      textAlign: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },

    noResultsP: {
      color: "#6b7280",
      fontSize: "1.125rem",
      margin: "0",
    },
    modal: {
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
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    modalHeader: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#111827'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    cancelButton: {
      padding: '10px 20px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    saveButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#10b981',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    programModal: {
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
    programModalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    programModalHeader: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#111827'
    },
    programModalSubheader: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    programFormGroup: {
      marginBottom: '20px'
    },
    programFormRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px'
    },
    programFormColumn: {
      flex: 1
    },
    programLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151'
    },
    programInput: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    programSelect: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    programModalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    programCancelButton: {
      padding: '10px 20px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    programSaveButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#10b981',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

return (
  <div style= {styles.subjectListContainer}>

    <div style= {styles.contentWrapper}>
      {/* Page Header */}
      <div style= {styles.pageHeader}>
        <h2 style= {styles.pageTitle}>Subject List</h2>
        <button 
          style= {styles.addBtn}
          onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div style={styles.filtersCard}>
        <div style= {styles.searchWrapper}>
          <div style= {styles.searchIcon}>
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search subjects by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div style={styles.filtersRow}>
          <div style={styles.filterLabel}>
            <Filter size={18} />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="uploaded">Uploaded</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="courseCode">Sort by Code</option>
            <option value="name">Sort by Name</option>
          </select>

          <div style={styles.resultCount}>
            Showing {sortedSubjects.length} of {subjects.length} subjects
          </div>
        </div>
      </div>

      {/* Subject List */}
      { subjects ? (
        <div style={styles.subjectsList}>
          {sortedSubjects.map((subject, index) => (
            <div key={subject.id} style={styles.subjectCard}>
              <div style={styles.subjectCardContent}>
                <div style={styles.subjectInfoSection}>
                  <div style={styles.subjectAvatar}>
                    <span>S{index + 1}</span>
                  </div>

                  <div style={styles.subjectDetails}>
                    <h3 style={styles.subjectName}>{subject.Course_Name}</h3>
                    <p style={styles.subjectCode}>Code: {subject.Course_Code}</p>
                  </div>
                </div>

                <div style={styles.subjectActions}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(subject.Status.toLowerCase() === "uploaded" && styles.statusBadgeUploaded),
                      ...(subject.Status.toLowerCase() === "pending" && styles.statusBadgePending),
                    }}
                  >
                    {subject.Status
                      ? subject.Status.charAt(0).toUpperCase() + subject.Status.slice(1).toLowerCase()
                      : ""}
                  </span>

                  <span style={styles.programBadge}>
                    {subject.programCount} {subject.programCount === 1 ? 'Program' : 'Programs'}
                  </span>

                  <button 
                    style={{...styles.iconBtn, ...styles.iconBtnAddIcon}}
                    onClick={() => handleOpenAddProgram(subject)}>
                    <Plus size={20} />
                  </button>

                  <button style={{...styles.iconBtn, ...styles.iconBtnEditIcon}}>
                    <Edit2 size={20} />
                  </button>

                  <button style={{...styles.iconBtn, ...styles.iconBtnDeleteIcon}}>
                    <Trash2 size={20} />
                  </button>

                  <button 
                    onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                    style={{...styles.iconBtn, ...styles.iconBtnExpandIcon}}
                  >
                    <ChevronDown 
                      size={20} 
                      style={expandedSubject === subject.id ? styles.rotated : {}}
                    />
                  </button>
                </div>
              </div>

              {expandedSubject === subject.id && (
              <div style={styles.expandedContent}>
                {/* Experiment List Section */}
                <div style={styles.expandedSection}>
                  <h3 style={styles.sectionTitle}>Experiment List</h3>
                  <div style={styles.uploadSection}>
                    {subject.experimentList?.fileName ? (
                      <>
                        <span style={styles.fileName}> {subject.experimentList.fileName}</span>
                        <button 
                          style={styles.uploadButton}
                          onClick={() => handleFileUpload(subject.id)}
                        >
                          <Upload size={14} />
                          Replace
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={styles.noFileText}>
                          No file uploaded
                        </span>
                        <button 
                          style={styles.uploadButton}
                          onClick={() => handleFileUpload(subject.id)}
                        >
                          <Upload size={14} />
                          Upload PDF
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Programs Section */}
                <div style={styles.expandedSection}>
                  <h3 style={styles.sectionTitle}>Assigned Programs</h3>
                  <div style={styles.programsGrid}>
                    {subject.programs?.map((program) => (
                      <div key={program.id} style={styles.programCard}>
                        <div style={styles.programHeader}>
                          <div>
                            <div style={styles.programName}>{program.programName}</div>
                            <div style={styles.programMeta}>
                              Section {program.section} • Semester {program.semester}
                            </div>
                          </div>
                          <span style={styles.programBadge}>{program.groupNumber}</span>
                        </div>
                        <div style={styles.programDetails}>
                          <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Faculty:</span>
                            <span style={styles.detailValue}>{program.facultyName}</span>
                          </div>
                          <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Hours/Week:</span>
                            <span style={styles.detailValue}>{program.hours}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>
          ))}
        </div>
      ) : (
        <p>No subjects available. Please add a new subject.</p>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>Add New Subject</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Course Name</label>
              <input 
                type="text"
                style={styles.input}
                value={newSubject.courseName}
                onChange={(e) => setNewSubject({...newSubject, courseName: e.target.value})}
                placeholder="Enter course name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Course Code</label>
              <input 
                type="text"
                style={styles.input}
                value={newSubject.courseCode}
                onChange={(e) => setNewSubject({...newSubject, courseCode: e.target.value})}
                placeholder="Enter course code"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Course Department</label>
              <select
                style={styles.input}
                value={newSubject.courseDepartment}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, courseDepartment: e.target.value })
                }>
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowAddModal(false);
                  setNewSubject({ courseName: '', courseCode: '', courseDepartment: '' });
                }}
              >
                Cancel
              </button>
              <button 
                style={styles.saveButton}
                onClick={handleAddSubject}
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div style={styles.programModal} onClick={() => setShowAddProgramModal(false)}>
          <div style={styles.programModalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.programModalHeader}>Add New Program</h2>
            <p style={styles.programModalSubheader}>
              Adding program for: <strong>{selectedSubject?.Course_Name}</strong> ({selectedSubject?.Course_Code})
            </p>
            
            <div style={styles.programFormGroup}>
              <label style={styles.programLabel}>Program Name</label>
              <input 
                type="text"
                style={styles.programInput}
                value={newProgram.programName}
                onChange={(e) => setNewProgram({...newProgram, programName: e.target.value})}
                placeholder="Enter program name"
              />
            </div>

            <div style={styles.programFormRow}>
              <div style={styles.programFormColumn}>
                <label style={styles.programLabel}>Section</label>
                <input 
                  type="text"
                  style={styles.programInput}
                  value={newProgram.programSection}
                  onChange={(e) => setNewProgram({...newProgram, programSection: e.target.value})}
                  placeholder="Enter section"
                />
              </div>
              <div style={styles.programFormColumn}>
                <label style={styles.programLabel}>Semester</label>
                <input 
                  type="text"
                  style={styles.programInput}
                  value={newProgram.programSemester}
                  onChange={(e) => setNewProgram({...newProgram, programSemester: e.target.value})}
                  placeholder="Enter semester"
                />
              </div>
            </div>

            <div style={styles.programFormRow}>
              <div style={styles.programFormColumn}>
                <label style={styles.programLabel}>Group</label>
                <input 
                  type="text"
                  style={styles.programInput}
                  value={newProgram.programGroup}
                  onChange={(e) => setNewProgram({...newProgram, programGroup: e.target.value})}
                  placeholder="Enter group"
                />
              </div>
              <div style={styles.programFormColumn}>
                <label style={styles.programLabel}>Batch</label>
                <input 
                  type="text"
                  style={styles.programInput}
                  value={newProgram.programBatch}
                  onChange={(e) => setNewProgram({...newProgram, programBatch: e.target.value})}
                  placeholder="Enter batch"
                />
              </div>
            </div>

            <div style={styles.programFormGroup}>
              <label style={styles.programLabel}>Number of Hours</label>
              <input 
                type="text"
                style={styles.programInput}
                value={newProgram.numberOfHours}
                onChange={(e) => setNewProgram({...newProgram, numberOfHours: e.target.value})}
                placeholder="Enter number of hours"
              />
            </div>

            <div style={styles.programFormGroup}>
              <label style={styles.programLabel}>Faculty Assigned</label>
              <select
                style={styles.programSelect}
                value={newProgram.facultyAssigned}
                onChange={(e) => setNewProgram({...newProgram, facultyAssigned: e.target.value})}
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.Name} ({faculty.Email})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.programFormGroup}>
              <label style={styles.programLabel}>Lab Allocated</label>
              <select
                style={styles.programSelect}
                value={newProgram.labAllocated}
                onChange={(e) => setNewProgram({...newProgram, labAllocated: e.target.value})}
              >
                <option value="">Select Lab</option>
                {labs.map((lab) => (
                  <option key={lab._id} value={lab._id}>
                    {lab.name} ({lab.id})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.programModalActions}>
              <button 
                style={styles.programCancelButton}
                onClick={() => {
                  setShowAddProgramModal(false);
                  setNewProgram({
                    programName: '',
                    programSection: '',
                    programSemester: '',
                    programGroup: '',
                    programBatch: '',
                    numberOfHours: '',
                    facultyAssigned: '',
                    labAllocated: ''
                  });
                }}
              >
                Cancel
              </button>
              <button 
                style={styles.programSaveButton}
                onClick={handleAddProgram}
              >
                Add Program
              </button>
            </div>
          </div>
        </div> 
      )}

      {sortedSubjects.length === 0 && subjects.length != 0 && (
        <div style={styles.noResults}>
          <p style={styles.noResultsP}>No subjects found matching your criteria.</p>
        </div>
      )}
    </div>
  </div>
  ); 
}