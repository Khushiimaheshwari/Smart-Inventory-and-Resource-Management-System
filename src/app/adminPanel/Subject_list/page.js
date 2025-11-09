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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
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

  // Responsive breakpoint detection
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
    fetchSubject();
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
        fetchSubject();
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
    subjectListContainer: {
      width: (isMobile || isTablet) ? '100%' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: (isMobile || isTablet) ? '1rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: (isMobile || isTablet) ? '0' : '255px',
      overflowX: 'hidden',
      fontFamily: "'Times New Roman', Times, serif",
    },

    contentWrapper: {
      maxWidth: "1400px",
      margin: "0 auto",
    },

    pageHeader: {
      display: "flex",
      flexDirection: (isMobile || isTablet) ? "column" : "row",
      alignItems: (isMobile || isTablet) ? "stretch" : "center",
      justifyContent: "space-between",
      gap: (isMobile || isTablet) ? "1rem" : "0",
      marginBottom: (isMobile || isTablet) ? "1.5rem" : "2rem",
    },

    pageTitle: {
      fontSize: isMobile ? "1.5rem" : isTablet ? "1.75rem" : "2rem",
      fontWeight: "700",
      color: "#111827",
      margin: "0",
      fontFamily: "'Times New Roman', Times, serif",
    },

    addBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      backgroundColor: "#10b981",
      color: "white",
      padding: (isMobile || isTablet) ? "0.65rem 1.25rem" : "0.75rem 1.5rem",
      border: "none",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      transition: "background-color 0.2s",
      width: (isMobile || isTablet) ? "100%" : "auto",
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },

    filtersCard: {
      backgroundColor: "white",
      borderRadius: (isMobile || isTablet) ? "0.5rem" : "0.75rem",
      padding: (isMobile || isTablet) ? "1rem" : "1.5rem",
      marginBottom: (isMobile || isTablet) ? "1rem" : "1.5rem",
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
      padding: (isMobile || isTablet) ? "0.65rem 1rem 0.65rem 2.75rem" : "0.75rem 1rem 0.75rem 3rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      fontSize: isMobile ? "0.9rem" : "1rem",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
      fontFamily: "'Times New Roman', Times, serif",
    },

    filtersRow: {
      display: "flex",
      flexDirection: (isMobile || isTablet) ? "column" : "row",
      flexWrap: "wrap",
      alignItems: (isMobile || isTablet) ? "stretch" : "center",
      gap: (isMobile || isTablet) ? "0.75rem" : "1rem",
    },

    filterLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#374151",
      fontWeight: "500",
      fontSize: isMobile ? "0.875rem" : "1rem",
      fontFamily: "'Times New Roman', Times, serif",
    },

    filterSelect: {
      padding: (isMobile || isTablet) ? "0.5rem 0.75rem" : "0.5rem 1rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      fontSize: isMobile ? "0.8rem" : "0.875rem",
      outline: "none",
      cursor: "pointer",
      transition: "border-color 0.2s",
      flex: (isMobile || isTablet) ? "1" : "0",
      minWidth: (isMobile || isTablet) ? "auto" : "150px",
      fontFamily: "'Times New Roman', Times, serif",
    },

    resultCount: {
      marginLeft: (isMobile || isTablet) ? "0" : "auto",
      fontSize: isMobile ? "0.8rem" : "0.875rem",
      color: "#6b7280",
      textAlign: (isMobile || isTablet) ? "center" : "left",
      fontFamily: "'Times New Roman', Times, serif",
    },

    subjectsList: {
      display: "flex",
      marginTop: (isMobile || isTablet) ? "1rem" : "1.5rem",
      flexDirection: "column",
      gap: (isMobile || isTablet) ? "0.75rem" : "1rem",
    },

    subjectCard: {
      backgroundColor: "white",
      borderRadius: (isMobile || isTablet) ? "0.5rem" : "0.75rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "box-shadow 0.2s",
    },

    subjectCardContent: {
      padding: (isMobile || isTablet) ? "1rem" : "1.5rem",
      display: "flex",
      flexDirection: (isMobile || isTablet) ? "column" : "row",
      alignItems: (isMobile || isTablet) ? "stretch" : "center",
      justifyContent: "space-between",
      gap: (isMobile || isTablet) ? "1rem" : "1.5rem",
    },

    subjectInfoSection: {
      display: "flex",
      alignItems: "center",
      gap: (isMobile || isTablet) ? "0.75rem" : "1.5rem",
    },

    subjectAvatar: {
      width: isMobile ? "3rem" : isTablet ? "3.5rem" : "4rem",
      height: isMobile ? "3rem" : isTablet ? "3.5rem" : "4rem",
      backgroundColor: "#f3f4f6",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      fontSize: isMobile ? "1rem" : isTablet ? "1.125rem" : "1.25rem",
      fontWeight: "700",
      color: "#6b7280",
      fontFamily: "'Times New Roman', Times, serif",
    },

    subjectDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      flex: "1",
    },

    subjectName: {
      fontSize: isMobile ? "1rem" : isTablet ? "1.125rem" : "1.25rem",
      fontWeight: "700",
      color: "#111827",
      margin: "0",
      wordBreak: "break-word",
      fontFamily: "'Times New Roman', Times, serif",
    },

    subjectCode: {
      color: "#6b7280",
      margin: "0",
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      fontFamily: "'Times New Roman', Times, serif",
    },

    subjectActions: {
      display: "flex",
      flexDirection: (isMobile || isTablet) ? "column" : "row",
      alignItems: (isMobile || isTablet) ? "stretch" : "center",
      gap: (isMobile || isTablet) ? "0.5rem" : "1rem",
      flexWrap: "wrap",
    },

    actionButtonsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: (isMobile || isTablet) ? "space-between" : "flex-start",
      gap: "0.5rem",
      width: (isMobile || isTablet) ? "100%" : "auto",
    },

    statusBadge: {
      padding: isMobile ? "0.4rem 0.75rem" : "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: isMobile ? "0.75rem" : "0.875rem",
      fontWeight: "500",
      textAlign: "center",
      whiteSpace: "nowrap",
      fontFamily: "'Times New Roman', Times, serif",
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
      padding: isMobile ? "0.4rem 0.75rem" : "0.5rem 1rem",
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderRadius: "9999px",
      fontSize: isMobile ? "0.75rem" : "0.875rem",
      fontWeight: "500",
      textAlign: "center",
      whiteSpace: "nowrap",
      fontFamily: "'Times New Roman', Times, serif",
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

    expandedContent: {
      padding: (isMobile || isTablet) ? "1rem" : "0 1.5rem 1.5rem 1.5rem",
      borderTop: "1px solid #e5e7eb",
    },

    expandedSection: {
      marginBottom: (isMobile || isTablet) ? "1.5rem" : "24px",
    },

    sectionTitle: {
      fontSize: isMobile ? "0.8rem" : "14px",
      fontWeight: "700",
      color: "#374151",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontFamily: "'Times New Roman', Times, serif",
    },

    uploadSection: {
      display: "flex",
      flexDirection: (isMobile || isTablet) ? "column" : "row",
      alignItems: (isMobile || isTablet) ? "stretch" : "center",
      gap: "12px",
      padding: (isMobile || isTablet) ? "12px" : "16px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "2px dashed #d1d5db",
    },

    uploadButton: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: (isMobile || isTablet) ? "10px 14px" : "8px 16px",
      fontSize: isMobile ? "0.8rem" : "13px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition: "background-color 0.2s",
      whiteSpace: "nowrap",
      fontFamily: "'Times New Roman', Times, serif",
    },

    viewButton: {
      backgroundColor: "#10b981",     
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: (isMobile || isTablet) ? "10px 14px" : "8px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "0.8rem" : "14px",
      fontWeight: 500,
      transition: "all 0.25s ease",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      whiteSpace: "nowrap",
      fontFamily: "'Times New Roman', Times, serif",
    },

    fileName: {
      fontSize: isMobile ? "0.8rem" : "14px",
      color: "#374151",
      fontWeight: "500",
      wordBreak: "break-word",
      flex: "1",
      fontFamily: "'Times New Roman', Times, serif",
    },

    noFileText: {
      fontSize: isMobile ? "0.8rem" : "14px",
      color: "#9ca3af",
      fontStyle: "italic",
      fontFamily: "'Times New Roman', Times, serif",
    },

    programsGrid: {
      display: "grid",
      gridTemplateColumns: (isMobile || isTablet) ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
      gap: (isMobile || isTablet) ? "12px" : "16px",
    },

    programCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: (isMobile || isTablet) ? "12px" : "16px",
      border: "1px solid #e5e7eb",
    },

    programHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "0.5rem",
    },

    programName: {
      fontSize: isMobile ? "0.95rem" : "16px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
      wordBreak: "break-word",
      fontFamily: "'Times New Roman', Times, serif",
    },

    programMeta1: {
      fontSize: isMobile ? "0.8rem" : "14px",
      color: "#6b7280",
      marginBottom: "4px",
      fontFamily: "'Times New Roman', Times, serif",
    },

    programMeta2: {
      fontSize: isMobile ? "0.75rem" : "13px",
      color: "#6b7280",
      marginBottom: "4px",
      fontFamily: "'Times New Roman', Times, serif",
    },

    programBadgeAlt: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: isMobile ? "0.7rem" : "12px",
      fontWeight: "600",
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      whiteSpace: "nowrap",
      fontFamily: "'Times New Roman', Times, serif",
    },

    noResults: {
      backgroundColor: "white",
      borderRadius: "0.75rem",
      padding: (isMobile || isTablet) ? "2rem 1rem" : "3rem",
      textAlign: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },

    noResultsP: {
      color: "#6b7280",
      fontSize: isMobile ? "1rem" : "1.125rem",
      margin: "0",
      fontFamily: "'Times New Roman', Times, serif",
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
      zIndex: 1000,
      padding: (isMobile || isTablet) ? "1rem" : "2rem",
    },

    modalContent: {
      backgroundColor: 'white',
      borderRadius: (isMobile || isTablet) ? "10px" : "12px",
      padding: (isMobile || isTablet) ? "1.25rem" : "24px",
      width: '100%',
      maxWidth: (isMobile || isTablet) ? "100%" : "500px",
      maxHeight: (isMobile || isTablet) ? "90vh" : "95vh",
      overflowY: "auto",
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      fontFamily: "'Times New Roman', Times, serif",
    },

    modalHeader: {
      fontSize: isMobile ? "1.25rem" : "24px",
      fontWeight: '600',
      marginBottom: (isMobile || isTablet) ? "1rem" : "24px",
      color: '#111827',
      fontFamily: "'Times New Roman', Times, serif",
    },

    formGroup: {
      marginBottom: (isMobile || isTablet) ? "1rem" : "20px"
    },

    label: {
      display: 'block',
      fontSize: isMobile ? "0.85rem" : "14px",
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151',
      fontFamily: "'Times New Roman', Times, serif",
    },

    input: {
      width: '100%',
      padding: (isMobile || isTablet) ? "9px 11px" : "10px 12px",
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: isMobile ? "0.9rem" : "14px",
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      fontFamily: "'Times New Roman', Times, serif",
    },

    select: {
      width: '100%',
      padding: (isMobile || isTablet) ? "9px 11px" : "10px 12px",
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: isMobile ? "0.9rem" : "14px",
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      fontFamily: "'Times New Roman', Times, serif",
    },

    modalActions: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? "column-reverse" : "row",
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: (isMobile || isTablet) ? "1.25rem" : "24px"
    },

    cancelButton: {
      padding: (isMobile || isTablet) ? "9px 18px" : "10px 20px",
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontFamily: "'Times New Roman', Times, serif",
    },

    saveButton: {
      padding: (isMobile || isTablet) ? "9px 18px" : "10px 20px",
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#10b981',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontFamily: "'Times New Roman', Times, serif",
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
      zIndex: 1000,
      padding: (isMobile || isTablet) ? "1rem" : "2rem",
    },

    programModalContent: {
      backgroundColor: 'white',
      borderRadius: (isMobile || isTablet) ? "10px" : "12px",
      padding: (isMobile || isTablet) ? "1.25rem" : "24px",
      width: '100%',
      maxWidth: (isMobile || isTablet) ? "100%" : "600px",
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      fontFamily: "'Times New Roman', Times, serif",
    },

    programModalHeader: {
      fontSize: isMobile ? "1.25rem" : "24px",
      fontWeight: '600',
      marginBottom: '8px',
      color: '#111827',
      fontFamily: "'Times New Roman', Times, serif",
    },

    programModalSubheader: {
      fontSize: isMobile ? "0.85rem" : "14px",
      color: '#6b7280',
      marginBottom: (isMobile || isTablet) ? "1rem" : "24px",
      fontFamily: "'Times New Roman', Times, serif",
    },

    programFormGroup: {
      marginBottom: (isMobile || isTablet) ? "1rem" : "20px"
    },

    programFormRow: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? "column" : "row",
      gap: (isMobile || isTablet) ? "1rem" : "16px",
      marginBottom: (isMobile || isTablet) ? "1rem" : "20px"
    },

    programFormColumn: {
      flex: 1
    },

    programLabel: {
      display: 'block',
      fontSize: isMobile ? "0.85rem" : "14px",
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151',
      fontFamily: "'Times New Roman', Times, serif",
    },

    programInput: {
      width: '100%',
      padding: (isMobile || isTablet) ? "9px 11px" : "10px 12px",
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: isMobile ? "0.9rem" : "14px",
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      fontFamily: "'Times New Roman', Times, serif",
    },

    programSelect: {
      width: '100%',
      padding: (isMobile || isTablet) ? "9px 11px" : "10px 12px",
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: isMobile ? "0.9rem" : "14px",
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      fontFamily: "'Times New Roman', Times, serif",
    },

    programModalActions: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? "column-reverse" : "row",
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: (isMobile || isTablet) ? "1.25rem" : "24px"
    },

    programCancelButton: {
      padding: (isMobile || isTablet) ? "9px 18px" : "10px 20px",
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontFamily: "'Times New Roman', Times, serif",
    },

    programSaveButton: {
      padding: (isMobile || isTablet) ? "9px 18px" : "10px 20px",
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#10b981',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontFamily: "'Times New Roman', Times, serif",
    }
  };

return (
  <div style={styles.subjectListContainer}>

    <div style={styles.contentWrapper}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Subject List</h2>
        <button 
          style={styles.addBtn}
          onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div style={styles.filtersCard}>
        <div style={styles.searchWrapper}>
          <div style={styles.searchIcon}>
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
      { subjects.length > 0 ? (
        <div style={styles.subjectsList}>
          {sortedSubjects.map((subject, index) => (
            <div key={subject._id} style={styles.subjectCard}>
              <div style={styles.subjectCardContent}>
                <div style={styles.subjectInfoSection}>
                  <div style={styles.subjectAvatar}>
                    <span>S{index + 1}</span>
                  </div>

                  <div style={styles.subjectDetails}>
                    <h3 style={styles.subjectName}>{(subject.Course_Name).toUpperCase()}</h3>
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
                    {subject.Programs ? (
                      <>{subject.Programs.length} {subject.Programs.length === 1 ? 'Program' : 'Programs'}</>
                    ) : (
                      '0 Programs'
                    )}
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
                    onClick={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)}
                    style={{...styles.iconBtn, ...styles.iconBtnExpandIcon}}
                  >
                    <ChevronDown 
                      size={20} 
                      style={expandedSubject === subject._id ? styles.rotated : {}}
                    />
                  </button>
                </div>
              </div>

              {expandedSubject === subject._id && (
              <div style={styles.expandedContent}>
                {/* Experiment List Section */}
                <div style={styles.expandedSection}>
                  <h3 style={styles.sectionTitle}>Experiment List</h3>
                  <div style={styles.uploadSection}>
                    {subject.Experiment_List ? (
                      <>
                        <span style={styles.fileName}>{subject.Experiment_List}</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button style={styles.uploadButton} onClick={() => handleFileUpload(subject._id)}>
                            <Upload size={14} /> Replace
                          </button>

                          <button
                            style={styles.viewButton}
                            onClick={() => window.open(`/ListOfExperiment_uploads/${subject.Experiment_List}`, "_blank")}
                          >
                            View PDF
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={styles.noFileText}>No file uploaded</span>
                        <button style={styles.uploadButton} onClick={() => handleFileUpload(subject._id)}>
                          <Upload size={14} /> Upload PDF
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Programs Section */}
                {subject.Programs && subject.Programs.length > 0 && (
                  <div style={styles.expandedSection}>
                    <h3 style={styles.sectionTitle}>Assigned Programs</h3>
                    <div style={styles.programsGrid}>
                      {subject.Programs.map((program) => (
                        <div key={program._id} style={styles.programCard}>
                          <div style={styles.programHeader}>
                            <div>
                              <div style={styles.programName}>{program.Program_Name}</div>
                                <div style={styles.programMeta1}>
                                    Batch: {program.Program_Batch}
                                </div>
                                <div style={styles.programMeta2}>
                                  Section {program.Program_Section} • Semester {program.Program_Semester}
                                </div>
                                {program.Subject && program.Subject.map((subj, index) => (
                                  <div key={index}>
                                    <div style={styles.programMeta1}>
                                      Faculty: {subj.Faculty_Assigned?.Name || 'Not Assigned'}
                                    </div>
                                    <div style={styles.programMeta2}>
                                      Lab: {subj.Lab_Allocated?.Lab_ID || 'Not Assigned'}
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div>
                              <span style={styles.programBadgeAlt}>{program.Program_Group}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noResultsP}>No subjects available. Please add a new subject.</p>
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
                style={styles.select}
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

      {sortedSubjects.length === 0 && subjects.length !== 0 && (
        <div style={styles.noResults}>
          <p style={styles.noResultsP}>No subjects found matching your criteria.</p>
        </div>
      )}
    </div>
  </div>
  ); 
}