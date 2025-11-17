"use client";

import React, { useEffect, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function SubjectListPage() {
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('courseCode');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSubject = async () => {
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

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await fetchSubject();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.Course_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.Course_Code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subject.experimentList?.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || subject.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (sortBy === 'courseCode') return a.Course_Code.localeCompare(b.Course_Code);
    if (sortBy === 'Course_Name') return a.Course_Name.localeCompare(b.Course_Name);
    return 0; 
  });
  
  const handleFileUpload = (subjectId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf, .docx";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF or DOCX files are allowed!");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/uploadListOfExperiment", {
          method: "POST",
          body: formData,
          headers: {
            "subject-id": subjectId, 
          },
        });

        const data = await res.json();
        if (data.success) {
          alert("File uploaded successfully ");
          window.location.reload(); 
        } else {
          alert("Upload failed: " + data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading file.");
      }
    };

    input.click();
  };

  const styles = {
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
    },
    container: {
      width: (isMobile || isTablet) ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: (isMobile || isTablet) ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: (isMobile || isTablet) ? '0' : '255px',
      overflowX: 'hidden',
      fontFamily: "'Times New Roman', Times, serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    headerTitle: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#2d3748",
      margin: 0,
    },
    addButton: {
      padding: "10px 24px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      transition: "all 0.2s ease",
    },
    cardContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",     
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.2s ease",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap",
    },
    cardLeft: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      flex: "1",
      minWidth: "250px",
    },
    profileImage: {
      width: "48px",
      height: "48px",
      borderRadius: "8px",
      objectFit: "cover",
      background: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      color: "#6b7280",
      fontWeight: "700",
    },
    cardInfo: {
      flex: "1",
    },
    cardName: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#1f2937",
      margin: "0 0 4px 0",
    },
    cardEmail: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    cardRight: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
    },
    cardStock: {
      fontSize: "13px",
      color: "#6b7280",
      margin: 0,
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
    },
    statusApproved: {
      background: "#d1fae5",
      color: "#065f46",
    },
    statusPending: {
      background: "#fef3c7",
      color: "#92400e",
    },
    programBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
      background: "#dbeafe",
      color: "#1e40af",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    iconButton: {
      width: "36px",
      height: "36px",
      background: "transparent",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    editButton: {
      color: "#10b981",
    },
    deleteButton: {
      color: "#ef4444",
    },
    addProgramButton: {
      color: "#3b82f6",
    },
    expandButton: {
      background: "#f3f4f6",
      color: "#4b5563",
      transition: "all 0.2s ease",
    },
    expandedContent: {
      marginTop: "1.5rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #e5e7eb",
    },
    labAccessSection: {
      padding: "1.25rem",
      background: "#f0fdf4",
      borderRadius: "8px",
      border: "1px solid #d1fae5",
      marginBottom: "1.5rem",
    },
    labAccessLabel: {
      fontSize: "13px",
      color: "#065f46",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    uploadSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },
    fileName: {
      fontSize: "14px",
      color: "#059669",
      fontWeight: 600,
      flex: "1",
      minWidth: "150px",
    },
    noFileText: {
      fontSize: "14px",
      color: "#6b7280",
      fontStyle: "italic",
      flex: "1",
    },
    uploadButton: {
      padding: "8px 14px",
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    },
    viewButton: {
      padding: "8px 14px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    },
    programsSection: {
      padding: "1.25rem",
      background: "#eff6ff",
      borderRadius: "8px",
      border: "1px solid #dbeafe",
    },
    programsSectionLabel: {
      fontSize: "13px",
      color: "#1e40af",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    labCount: {
      marginLeft: "auto",
      fontSize: "12px",
      padding: "2px 10px",
      background: "#10b981",
      color: "white",
      borderRadius: "12px",
      fontWeight: 700,
    },
    programsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "12px",
    },
    programCard: {
      background: "white",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #e5e7eb",
    },
    programName: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "6px",
    },
    programMeta: {
      fontSize: "13px",
      color: "#6b7280",
      marginBottom: "4px",
    },
    programBadgeAlt: {
      display: "inline-block",
      padding: "4px 8px",
      background: "#dbeafe",
      color: "#1e40af",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 600,
      marginTop: "6px",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "white",
      borderRadius: "12px",
      padding: "30px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    modalHeader: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      background: "white",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    cancelButton: {
      flex: 1,
      padding: "12px",
      background: "white",
      color: "#718096",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px",
    },
    saveButton: {
      flex: 1,
      padding: "12px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "14px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "20px",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading subject data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Subject List</h1>
      </header>

      <div style={styles.cardContainer}>
        {subjects && subjects.length > 0 ? (
          sortedSubjects.map((subject, index) => (
            <div key={subject._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <div style={styles.profileImage}>S{index + 1}</div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardName}>{subject.Course_Name.toUpperCase()}</h3>
                    <p style={styles.cardEmail}>Code: {subject.Course_Code}</p>
                  </div>
                </div>

                <div style={styles.cardRight}>
                  <div style={{ textAlign: "right" }}>
                    <p style={styles.cardStock}>{subject.Course_Department || "N/A"}</p>
                  </div>

                  <span style={{...styles.statusBadge, ...(subject.Status?.toLowerCase() === "uploaded" && styles.statusApproved), ...(subject.Status?.toLowerCase() === "pending" && styles.statusPending)}}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      {subject.Status?.toLowerCase() === "uploaded" ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    {subject.Status ? subject.Status.charAt(0).toUpperCase() + subject.Status.slice(1).toLowerCase() : "Pending"}
                  </span>

                  <span style={styles.programBadge}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    {subject.Programs ? `${subject.Programs.length} ${subject.Programs.length === 1 ? 'Program' : 'Programs'}` : '0 Programs'}
                  </span>

                  <div style={styles.actionButtons}>
                    <button style={{...styles.iconButton, ...styles.expandButton, transform: expandedSubject === subject._id ? "rotate(180deg)" : "rotate(0deg)"}} onClick={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)}>
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedSubject === subject._id && (
                <div style={styles.expandedContent}>
                  <div style={styles.labAccessSection}>
                    <span style={styles.labAccessLabel}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: "6px"}}>
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      Experiment List
                    </span>
                    <div style={styles.uploadSection}>
                      {subject.Experiment_List ? (
                        <>
                          <span style={styles.fileName}>{subject.Experiment_List}</span>
                          <button style={styles.uploadButton} onClick={() => handleFileUpload(subject._id)}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                            </svg>
                            Replace
                          </button>
                          <button style={styles.viewButton} onClick={() => window.open(`/ListOfExperiment_uploads/${subject.Experiment_List}`, "_blank")}>View PDF</button>
                        </>
                      ) : (
                        <>
                          <span style={styles.noFileText}>No file uploaded</span>
                          <button style={styles.uploadButton} onClick={() => handleFileUpload(subject._id)}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                            </svg>
                            Upload PDF
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {subject.Programs && subject.Programs.length > 0 && (
                    <div style={styles.programsSection}>
                      <span style={styles.programsSectionLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: "6px"}}>
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        Assigned Programs
                        <span style={styles.labCount}>{subject.Programs.length} program{subject.Programs.length !== 1 ? 's' : ''}</span>
                      </span>
                      <div style={styles.programsGrid}>
                        {subject.Programs.map((program) => (
                          <div key={program._id} style={styles.programCard}>
                            <div style={styles.programName}>{program.Program_Name}</div>
                            <div style={styles.programMeta}>Batch: {program.Program_Batch}</div>
                            <div style={styles.programMeta}>Section {program.Program_Section} • Semester {program.Program_Semester}</div>
                            {program.Subject && program.Subject.map((subj, index) => (
                              <div key={index}>
                                <div style={styles.programMeta}>Faculty: {subj.Faculty_Assigned?.Name || 'Not Assigned'}</div>
                                <div style={styles.programMeta}>Lab: {subj.Lab_Allocated?.Lab_ID || 'Not Assigned'}</div>
                              </div>
                            ))}
                            <span style={styles.programBadgeAlt}>{program.Program_Group}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{color: "#555", fontSize: "1.1rem", fontWeight: 500, textAlign: "center"}}>No subjects found.</p>
        )}
      </div>
    </div>
  );
}