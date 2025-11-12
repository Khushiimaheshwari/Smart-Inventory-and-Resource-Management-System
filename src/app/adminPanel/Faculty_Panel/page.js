"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from 'lucide-react';

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [allDepartments, setAllDepartments] = useState([
    { Department: "SOET", Department_id: 1 },
  ]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [programSubjectPairs, setProgramSubjectPairs] = useState([
    { programId: "", subjects: [], filteredSubjects: [] },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    program: [],
    subjects: [],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await fetch("/api/admin/getFaculty");

      if(!res.ok) throw new Error("Failed to fetch faculty");

      const data = await res.json();
      console.log(data);
      
      setFaculty(
        data.faculty.map(f => ({
          id: f._id,
          name: f.Name,
          email: f.Email,
          phoneNumber: f.PhoneNumber,
          profileImage: f.ProfileImage,
          department: f.Department,
          designation: f.Designation,
          location: f.Location,
          status: f.AccountStatus,
          subjects: f.Subject?.map(sub => ({
            Subject_ID: sub._id,
            Course_Name: sub.Course_Name,
            Course_Code: sub.Course_Code,
            Course_Department: sub.Course_Department,
          })),
          programsAssigned: f.Programs_Assigned || [],
        }))
      );
    }catch (err) {
      console.error("Fetch Faculty Error:", err);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/admin/getSubjects");

        if(!res.ok) throw new Error("Failed to fetch Subjects");

        const data = await res.json();
        console.log(data);

        setAllSubjects(
          data.subjects.map(s => ({
            Subject: (s.Course_Name).toUpperCase() + " - " + s.Course_Code,
            Subject_id: s._id,
            Programs: s.Programs || [],  
          }))
        );
      }catch (err) {
        console.error("Fetch Subjects Error:", err);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {

    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/admin/getProgram");

        if (!res.ok) {
          throw new Error("Failed to fetch programs")
        };

        const data = await res.json();
        console.log(data);
        setPrograms(data.programs);

      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };
    fetchPrograms();
    }, []);

  const resetForm = () => {
    setNewFaculty({
      name: "",
      email: "",
      department: "",
      designation: "",
      program: [],
      subjects: [],
    });
  };

  const handleProgramChange = (index, programId) => {
    const matchedSubjects = allSubjects.filter((sub) =>
      sub.Programs?.some((p) => p._id === programId)
    );

    setProgramSubjectPairs((prev) => {
      const updated = [...prev];
      updated[index].programId = programId;
      updated[index].filteredSubjects = matchedSubjects;
      updated[index].subjects = []; 
      return updated;
    });
  };

  const getId = (s) => s?._id || s?.Subject_id || s?.id || null;

  const handleSubjectSelect = (pairIndex, selectedSubject) => {
    setProgramSubjectPairs((prev) => {
      return prev.map((pair, i) => {
        if (i !== pairIndex) return pair;

        const subjects = Array.isArray(pair.subjects) ? [...pair.subjects] : [];

        const selectedId = getId(selectedSubject);
        if (!selectedId) return pair; 

        const already = subjects.some(s => getId(s) === selectedId);

        const newSubjects = already
          ? subjects.filter(s => getId(s) !== selectedId)
          : [
              ...subjects,
              {
                _id: selectedId,
                Subject: selectedSubject.Subject || selectedSubject.Course_Name || "Unknown Subject",
                Course_Code: selectedSubject.Course_Code || "",
              },
            ];

        return {
          ...pair,
          subjects: newSubjects,
        };
      });
    });
  };

  const handleAddProgramSet = () => {
    setProgramSubjectPairs((prev) => [
      ...prev,
      { programId: "", subjects: [], filteredSubjects: [] },
    ]);
  };

  const handleRemoveProgramSet = (index) => {
    setProgramSubjectPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSubject = (index, subId) => {
    setProgramSubjectPairs((prev) => {
      const updated = [...prev];
      updated[index].subjects = updated[index].subjects.filter(
        (s) =>
          (s._id || s.Subject_id) !== subId &&
          (s.Subject_id || s._id) !== subId
      );
      return updated;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateRandomPassword = () => {
    const length = 10; 
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleAddFaculty = async () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.password) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      name: newFaculty.name,
      email: newFaculty.email,
      password: newFaculty.password,
      department: newFaculty.department,
      designation: newFaculty.designation,
      programSubjectPairs: programSubjectPairs.flatMap((p) =>
        (p.subjects || []).map((s) => ({
          programId: p.programId,
          subjectId: s._id || s.Subject_id || s.id,
        }))
      ),
    };

    try {
      const res = await fetch("/api/admin/addFaculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      // await emailjs.send(
      //   "service_2xk0xdb",  
      //   "template_mq4w3fc",    
      //   {
      //     to_name: newFaculty.name,
      //     to_email: newFaculty.email,
      //     password: newFaculty.password,
      //   },
      //   "JVeTTsN2NUeZ0UlPA"
      // );

      setFaculty([
        ...faculty,
        {
          id: faculty.length + 1,
          name: newFaculty.name,
          email: newFaculty.email,
        },
      ]);

      alert("Faculty added successfully!");
      setShowAddModal(false);
      setNewFaculty({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
        program: [],
        subjects: [],
      });

      setProgramSubjectPairs([{ programId: "", subjects: [], filteredSubjects: [] }]);

      await fetchFaculty();
    } catch (err) {
      console.error("Add Faculty Error:", err);
      alert("Something went wrong while editing Faculty.");
    }
  };
  
  const handleEditFaculty = (user) => {
    setEditingFaculty(user);
    setShowAddModal(true);
    setNewFaculty(user);

    if (user.programsAssigned && user.programsAssigned.length > 0) {
      const mappedPairs = user.programsAssigned.map((p) => {
        const filteredSubs = allSubjects.filter((sub) =>
          sub.Programs.some(
            (prog) => prog._id === p.programId || prog.Program_ID === p.programId
          )
        );

        return {
          programId: p.programId,
          programName: p.programName,
          subjects: [
            {
              _id: p.subjectId,
              Subject: p.subjectName,
            },
          ],
          filteredSubjects: filteredSubs, 
        };
      });

      setProgramSubjectPairs(mappedPairs);
    } else {
      setProgramSubjectPairs([{ programId: "", subjects: [], filteredSubjects: [] }]);
    }

    console.log("Editing Faculty:", user);
  };

  const handleUpdateFaculty = async () => {

    if (!newFaculty.name || !newFaculty.email) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      name: newFaculty.name,
      email: newFaculty.email,
      password: newFaculty.password,
      department: newFaculty.department,
      designation: newFaculty.designation,
      programSubjectPairs: programSubjectPairs.flatMap((p) =>
        (p.subjects || []).map((s) => ({
          programId: p.programId,
          subjectId: s._id || s.Subject_id || s.id,
        }))
      ),
    };
    console.log(payload);

    try {
      const res = await fetch("/api/admin/editFaculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      if (newFaculty.password && newFaculty.password.trim() !== "") {
        await emailjs.send(
          "service_2xk0xdb",  
          "template_mq4w3fc",    
          {
            to_name: newFaculty.name,
            to_email: newFaculty.email,
            password: newFaculty.password,
          },
          "JVeTTsN2NUeZ0UlPA"
        ); 
      }

      setFaculty([
        ...faculty,
        {
          id: faculty.length + 1,
          name: newFaculty.name,
          email: newFaculty.email,
        },
      ]);

    alert("Faculty updated successfully!");
    setFaculty(faculty.map((u) => (u.id === editingFaculty.id ? newFaculty : u)));
    setShowAddModal(false);
    setEditingFaculty(null);
    setNewFaculty({
      name: "",
      email: "",
      phoneNumber: "",
      location: "",
      department: "",
      designation: "",
      program: [],
      subjects: [],
    });

    setProgramSubjectPairs([{ programId: "", subjects: [], filteredSubjects: [] }]);

    await fetchFaculty();
  } catch (err) {
    console.error("Edit Faculty Error:", err);
    alert("Something went wrong while editing Faculty.");
  }
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
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    headerTitle: {
      fontSize: isMobile ? "24px" : "32px",
      fontWeight: 700,
      color: "#2d3748",
      margin: 0,
    },
    addButton: {
      padding: isMobile ? "8px 20px" : "10px 24px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: isMobile ? "13px" : "14px",
      transition: "all 0.2s ease",
    },
    cardContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "0.75rem" : "1rem",
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: isMobile ? "1rem" : "1.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    cardHeader: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    cardLeft: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.75rem" : "1rem",
      flex: "1",
      minWidth: isMobile ? "100%" : "250px",
    },
    profileImage: {
      width: isMobile ? "40px" : "48px",
      height: isMobile ? "40px" : "48px",
      borderRadius: "8px",
      objectFit: "cover",
      background: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      color: "#6b7280",
      flexShrink: 0,
    },
    cardInfo: {
      flex: "1",
    },
    cardName: {
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: 600,
      color: "#1f2937",
      margin: "0 0 4px 0",
    },
    cardEmail: {
      fontSize: isMobile ? "12px" : "14px",
      color: "#6b7280",
      margin: 0,
      wordBreak: "break-word",
    },
    cardRight: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.75rem" : "1.5rem",
      flexWrap: "wrap",
      width: isMobile ? "100%" : "auto",
      justifyContent: isMobile ? "space-between" : "flex-start",
    },
    cardDesignation: {
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 600,
      color: "#1f2937",
      margin: 0,
    },
    cardDepartment: {
      fontSize: isMobile ? "12px" : "13px",
      color: "#6b7280",
      margin: 0,
    },
    statusBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: isMobile ? "4px 10px" : "6px 12px",
      borderRadius: "6px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 600,
    },
    statusApproved: {
      background: "#d1fae5",
      color: "#065f46",
    },
    statusRejected: {
      background: "#fee2e2",
      color: "#991b1b",
    },
    actionButtons: {
      display: "flex",
      gap: isMobile ? "6px" : "8px",
    },
    iconButton: {
      width: isMobile ? "32px" : "36px",
      height: isMobile ? "32px" : "36px",
      background: "transparent",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    editButton: {
      color: "#10b981",
    },
    deleteButton: {
      color: "#ef4444",
    },
    expandButton: {
      background: "#f3f4f6",
      color: "#4b5563",
    },
    expandedContent: {
      marginTop: isMobile ? "1rem" : "1.5rem",
      paddingTop: isMobile ? "1rem" : "1.5rem",
      borderTop: "1px solid #e5e7eb",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
      gap: isMobile ? "0.75rem" : "1.25rem",
      marginBottom: isMobile ? "1rem" : "1.5rem",
    },
    infoBlock: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: isMobile ? "0.75rem" : "1rem",
      background: "#f9fafb",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    infoLabel: {
      fontSize: isMobile ? "11px" : "12px",
      color: "#6b7280",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
    },
    infoValue: {
      fontSize: isMobile ? "14px" : "15px",
      color: "#1f2937",
      fontWeight: 600,
      marginTop: "2px",
    },
    subjectsSection: {
      padding: isMobile ? "1rem" : "1.25rem",
      background: "#f0fdf4",
      borderRadius: "8px",
      border: "1px solid #d1fae5",
    },
    subjectsLabel: {
      fontSize: isMobile ? "12px" : "13px",
      color: "#065f46",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    subjectCount: {
      marginLeft: "auto",
      fontSize: isMobile ? "11px" : "12px",
      padding: "2px 10px",
      background: "#10b981",
      color: "white",
      borderRadius: "12px",
      fontWeight: 700,
    },
    subjectChipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: isMobile ? "6px" : "8px",
    },
    subjectChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: isMobile ? "6px 10px" : "8px 14px",
      background: "white",
      color: "#059669",
      border: "1.5px solid #10b981",
      borderRadius: "6px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 600,
    },
    noSubjectChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: isMobile ? "6px 10px" : "8px 14px",
      background: "#fef2f2",
      color: "#dc2626",
      border: "1.5px solid #fecaca",
      borderRadius: "6px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 600,
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
      padding: isMobile ? "1rem" : "0",
    },
    modalContent: {
      background: "white",
      borderRadius: "12px",
      padding: isMobile ? "0px 20px 15px" : "0px 30px 20px",
      width: isMobile ? "100%" : "90%",
      maxWidth: "600px",
      maxHeight: isMobile ? "95vh" : "100vh",
      overflowY: "auto",
    },
    modalHeader: {
      fontSize: isMobile ? "20px" : "24px",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: isMobile ? "16px" : "20px",
    },
    label: {
      display: "block",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: isMobile ? "10px" : "12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    modalActions: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
      flexDirection: isMobile ? "column" : "row",
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
    generateButton: {
      padding: "8px",
      background: "transparent",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "40px",
    },
    passwordFormGroup: {
      display: "flex",
      alignItems: "center", 
      gap: "10px",
    },
    select: {
      width: "100%",
      padding: isMobile ? "10px" : "12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      boxSizing: "border-box",
      background: "white",
    },
    accessSection: {
      marginTop: '1rem',
      position: 'relative',
    },
    accessTitle: {
      fontWeight: '600',
      marginBottom: '8px',
      fontSize: isMobile ? '13px' : '14px',
      color: '#333',
    },
    selectorContainer: {
      position: 'relative',
      width: '100%',
    },
    inputArea: {
      width: isMobile ? '93%' : '96%',
      minHeight: '42px',
      padding: '2px 12px',
      borderRadius: '8px',
      border: '2px solid',
      borderColor: '#e2e8f0',
      backgroundColor: 'white',
      cursor: 'pointer',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      alignItems: 'center',
    },
    inputAreaFocused: {
      borderColor: '#14b8a6',
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.1)',
    },
    placeholder: {
      color: '#999',
      fontSize: isMobile ? '13px' : '14px',
    },
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: '#14b8a6',
      color: 'white',
      padding: isMobile ? '3px 6px' : '4px 8px',
      borderRadius: '4px',
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '500',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      opacity: '0.8',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      marginTop: '4px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '6px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: 1000,
    },
    dropdownItem: {
      padding: isMobile ? '8px 10px' : '10px 12px',
      cursor: 'pointer',
      fontSize: isMobile ? '13px' : '14px',
      color: '#333',
    },
    dropdownItemSelected: {
      backgroundColor: '#e6f7f5',
      color: '#14b8a6',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Faculty Management</h1>
        <button style={styles.addButton} onClick={() => { setEditingFaculty(null); resetForm(); setShowAddModal(true); }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New
        </button>
      </header>

      <div style={styles.cardContainer}>
        {faculty && faculty.length > 0 ? (
          faculty.map((member) => (
            <div key={member.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <div style={styles.profileImage}>
                    {member.profileImage ? (
                      <img src={member.profileImage} alt="Profile" style={{ width: isMobile ? "40px" : "48px", height: isMobile ? "40px" : "48px", borderRadius: "8px", objectFit: "cover" }} />
                    ) : "N/A"}
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardName}>{member.name}</h3>
                    <p style={styles.cardEmail}>by {member.email}</p>
                  </div>
                </div>

                <div style={styles.cardRight}>
                  <div style={{ textAlign: isMobile ? "left" : "right" }}>
                    <p style={styles.cardDesignation}>{member.designation || "N/A"}</p>
                    <p style={styles.cardDepartment}>{member.department || "No Department"}</p>
                  </div>

                  <span style={{ ...styles.statusBadge, ...(member.status === "active" ? styles.statusApproved : styles.statusRejected) }}>
                    <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 20 20" fill="currentColor">
                      {member.status === "active" ? (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      )}
                    </svg>
                    {(member?.status || "").charAt(0).toUpperCase() + (member?.status || "").slice(1)}
                  </span>

                  <div style={styles.actionButtons}>
                    <button style={{ ...styles.iconButton, ...styles.editButton }} onClick={() => handleEditFaculty(member)}>
                      <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button style={{ ...styles.iconButton, ...styles.deleteButton }}>
                      <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button style={{ ...styles.iconButton, ...styles.expandButton, transform: expandedCard === member.id ? "rotate(180deg)" : "rotate(0deg)" }} onClick={() => setExpandedCard(expandedCard === member.id ? null : member.id)}>
                      <ChevronDown size={isMobile ? 16 : 18} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedCard === member.id && (
                <div style={styles.expandedContent}>
                  <div style={styles.detailsGrid}>
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>Phone</span>
                      <span style={styles.infoValue}>{member.phoneNumber || "Not provided"}</span>
                    </div>
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>Location</span>
                      <span style={styles.infoValue}>{member.location || "Not specified"}</span>
                    </div>
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>Status</span>
                      <span style={styles.infoValue}>{member.status ? (member.status).charAt(0).toUpperCase() + member.status.slice(1) : "Unknown"}</span>
                    </div>
                  </div>

                  <div style={styles.subjectsSection}>
                    <span style={styles.subjectsLabel}>
                      Subjects Taught
                      <span style={styles.subjectCount}>
                        {member.subjects && member.subjects.length > 0 ? member.subjects.length : 0}
                      </span>
                    </span>
                    <div style={styles.subjectChipsContainer}>
                      {member.subjects && member.subjects.length > 0 ? (
                        member.subjects.map((sub, index) => (
                          <span key={index} style={styles.subjectChip}>{sub.Course_Name} {sub.Course_Code} </span>
                        ))
                      ) : (
                        <span style={styles.noSubjectChip}>No subjects assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No faculty members found.</p>
        )}
      </div>

      {showAddModal && (
        <div style={styles.modal} onClick={() => { setShowAddModal(false); setEditingFaculty(null); }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>{editingFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input type="text" style={styles.input} value={newFaculty.name} onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} placeholder="Enter full name" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" style={styles.input} value={newFaculty.email} onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })} placeholder="Enter email" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordFormGroup}>
                <input type="text" style={styles.input} value={newFaculty.password || ""} onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })} placeholder="Enter password" />
                <button style={styles.generateButton} onClick={() => setNewFaculty({ ...newFaculty, password: generateRandomPassword() })}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Department</label>
              <select style={styles.select} value={newFaculty.department} onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}>
                <option value="">Select Department</option>
                {allDepartments.map((dept) => (
                  <option key={dept.Department_id} value={dept.Department}>{dept.Department}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Designation</label>
              <input type="text" style={styles.input} value={newFaculty.designation} onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })} placeholder="e.g., Professor" />
            </div>

            {programSubjectPairs.map((pair, index) => (
              <div
                key={index}
                // key={pair.programId || `pair-${index}`}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                {/* Program Dropdown */}
                <div style={styles.accessSection}>
                  <div style={styles.accessTitle}>Program</div>
                  <select
                    value={pair.programId}
                    onChange={(e) => handleProgramChange(index, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="">Select a Program</option>
                    {programs.map((prog) => (
                      <option key={prog._id} value={prog._id}>
                        {`${prog.Program_Name} - Sec ${prog.Program_Section} - Sem ${prog.Program_Semester} (${prog.Program_Group})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Selector */}
                <div style={styles.accessSection} ref={dropdownRef}>
                  <div style={styles.accessTitle}>Subjects</div>
                  <div style={styles.selectorContainer}>
                    <div
                      style={{
                        ...styles.inputArea,
                        ...(isDropdownOpen ? styles.inputAreaFocused : {}),
                      }}
                      onClick={() => setIsDropdownOpen(isDropdownOpen === index ? null : index)}
                    >
                      {pair.subjects.length === 0 ? (
                        <span style={styles.placeholder}>Select subjects</span>
                      ) : (
                        pair.subjects.map((sub, i) => {
                          const subName = sub?.Course_Code
                            ? `${sub.Course_Code} - ${sub.Course_Name}`
                            : sub?.Subject || "Unknown Subject";

                          const subId =
                            sub?._id ||
                            sub.Subject_id ||
                            sub.Subject_ID ||
                            sub.id ||
                            sub.Subject?.Subject_id ||
                            i;

                          return (
                            <div key={subId} style={styles.chip}>
                              <span>{subName}</span>
                              <button
                                style={styles.removeButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSubject(index, subId);
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {isDropdownOpen === index && (
                      console.log("Subject clicked"),
                      
                      <div style={styles.dropdown}>
                        {pair.filteredSubjects.map((subObj, subIdx) => {

                          const isSelected = pair.subjects?.some(
                            (sub) => getId(sub) === getId(subObj)
                          );
                          console.log(isSelected);
                          
                          return (
                            <div
                              key={getId(subObj) || subIdx}
                              style={{
                                ...styles.dropdownItem,
                                ...(isSelected ? styles.dropdownItemSelected : {}),
                              }}
                              onClick={() => handleSubjectSelect(index, subObj)}>
                              {`${subObj.Subject}`} {isSelected && "✓"}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove Button (optional) */}
                {programSubjectPairs.length > 1 && (
                  <button
                    onClick={() => handleRemoveProgramSet(index)}
                    style={{
                      marginTop: "10px",
                      color: "red",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Remove Program
                  </button>
                )}
              </div>
            ))}

            {/* Add New Program */}
            <button
              onClick={handleAddProgramSet}
              style={{
                marginTop: "15px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#f0f0f0",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              + Add Another Program
            </button>

            <div style={styles.modalActions}>
              <button style={styles.cancelButton} onClick={() => { 
                setShowAddModal(false); 
                setEditingFaculty(null);
                setNewFaculty({
                  name: "",
                  email: "",
                  password: "",
                  department: "",
                  designation: "",
                  program: [],
                  programSubjectPairs: [{ programId: "", subjects: [], filteredSubjects: [] }],
                  subjects: [],
                });
                }}>Cancel</button>
              <button 
                style={styles.saveButton}
                onClick={editingFaculty ? handleUpdateFaculty : handleAddFaculty }>
                {editingFaculty ? "Update Faculty" : "Add Faculty"}
              </button>
            </div>
          </div> 
        </div>
      )}
    </div>
  );
}