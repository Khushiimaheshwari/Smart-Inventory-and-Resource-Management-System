'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, X, Loader2 } from 'lucide-react';

export default function LabProgramsPage() {
  const [showForm, setShowForm] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [labList, setLabList] = useState([]);
  const [showCustomSpecialization, setShowCustomSpecialization] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    programName: '',
    section: '',
    semester: '',
    group: '',
    batchStart: '',
    batchEnd: '',
    subjects: [
      { Subject_ID: "", Number_Of_Hours: "", Faculty_Assigned: "", Lab_Allocated: "" },
    ],
  });

  const isEditMode = !!formData._id;

  const specializationOptions = {
    "B.Tech": [
      "AI & ML",
      "Data Science",
      "Cyber Security",
      "Full Stack Development",
      "AI & Robotics",
      "UI & UX",
    ],
    "BCA": [
      "AI & DS",
      "Cyber Security",
    ],
    "MCA": [
      "AI & ML",
    ],
    "B.SC": [
      "Computer Science",
      "Data Science",
      "Cyber Security",
    ],
    "M.Tech": [],
  };

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subjectsRes, facultyRes, labsRes] = await Promise.all([
          fetch("/api/admin/getSubjects"),       
          fetch("/api/admin/getFaculty"), 
          fetch("/api/admin/getLabs"),           
        ]);

        const [subjects, faculty, labs] = await Promise.all([
          subjectsRes.json(),
          facultyRes.json(),
          labsRes.json(),
        ]);

        setSubjectList(subjects.subjects || []);
        setFacultyList(faculty.faculty || []);
        setLabList(labs.labs || []);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      try {
        await fetchPrograms();
      } catch (error) {
        console.error("Error loading programs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPrograms();
  }, []);

  const handleSubjectChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[index] = { ...updatedSubjects[index], [name]: value };
      return { ...prev, subjects: updatedSubjects };
    });
  };

  const handleAddSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        { Subject_ID: "", Number_Of_Hours: "", Faculty_Assigned: "", Lab_Allocated: "" },
      ],
    }));
  };

  const handleRemoveSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleAddProgram = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      programName: '',
      specialization: '',
      section: '',
      semester: '',
      group: '',
      batchStart: '',
      batchEnd: '',
      subjects: [
        { Subject_ID: "", Number_Of_Hours: "", Faculty_Assigned: "", Lab_Allocated: "" },
      ],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProgramSubmit = async () => {
    if (!formData.programName || !formData.semester || !formData.batchStart || !formData.batchEnd) {
      alert('Please fill all fields');
      return;
    }

    try {
      const payload = {
        programName: `${formData.programName} ${formData.specialization}`,
        section: formData.section,
        semester: formData.semester,
        group: formData.group,
        batch: `${formData.batchStart} - ${formData.batchEnd}`,
        subjects:
          formData.subjects && formData.subjects.length > 0
            ? formData.subjects.map((subj) => ({
                Subject_ID: subj.Subject_ID || null,
                Number_Of_Hours: subj.Number_Of_Hours || null,
                Faculty_Assigned: subj.Faculty_Assigned || null,
                Lab_Allocated: subj.Lab_Allocated || null,
              }))
            : null, 
      };

      const res = await fetch("/api/admin/addProgram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add program.");
        return;
      }

      alert("Program added successfully!");
      setPrograms((prev) => [...prev, data.program || payload]);
      handleCloseForm();
      await fetchPrograms();
    } catch (err) {
      console.error("Error adding program:", err);
      alert("Something went wrong while adding the program.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditProgram = (program, e) => {
    e.stopPropagation();
    setFormData({
      _id: program._id, 
      programName: program.Program_Name || "",
      specialization: program.Specialization || "",
      section: program.Program_Section,
      semester: program.Program_Semester,
      group: program.Program_Group,
      batch: program.Program_Batch,
      subjects: program.Subject.map(sub => ({
        Subject_ID: sub.Subject_ID?._id || sub.Subject_ID || "",
        Number_Of_Hours: sub.Number_Of_Hours || "",
        Faculty_Assigned: sub.Faculty_Assigned?._id || sub.Faculty_Assigned || "",
        Lab_Allocated: sub.Lab_Allocated?._id || sub.Lab_Allocated || "",
      })),
    });
    setShowForm(true);
  };

  const handleEditProgramSubmit = async () => {
    if (!formData._id) {
      alert("Missing Program ID for edit!");
      return;
    }

    try {
      const payload = {
        section: formData.section,
        semester: formData.semester,
        group: formData.group,
        subjects:
          formData.subjects && formData.subjects.length > 0
            ? formData.subjects.map((subj) => ({
                Subject_ID: subj.Subject_ID || "",
                Number_Of_Hours: subj.Number_Of_Hours || "",
                Faculty_Assigned: subj.Faculty_Assigned || null,
                Lab_Allocated: subj.Lab_Allocated || "",
              }))
            : [],
      };

      const res = await fetch(`/api/admin/updateProgram/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to edit program");

      alert("Program updated successfully!");
      setPrograms((prev) =>
        prev.map((p) => (p._id === formData._id ? { ...p, ...data.updatedProgram } : p))
      );
      handleCloseForm();
      await fetchPrograms();
    } catch (err) {
      console.error("Edit Program Error:", err);
      alert("Something went wrong while updating the program.");
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter(p => p._id !== id));
    }
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
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1.25rem",
      marginBottom: "1.5rem",
    },
    infoBlock: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "1rem",
      background: "#f9fafb",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    infoLabel: {
      fontSize: "12px",
      color: "#6b7280",
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
    },
    infoValue: {
      fontSize: "15px",
      color: "#1f2937",
      fontWeight: 600,
      marginTop: "2px",
    },
    labAccessSection: {
      padding: "1.25rem",
      background: "#f0fdf4",
      borderRadius: "8px",
      border: "1px solid #d1fae5",
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
    labCount: {
      marginLeft: "auto",
      fontSize: "12px",
      padding: "2px 10px",
      background: "#10b981",
      color: "white",
      borderRadius: "12px",
      fontWeight: 700,
    },
    labChipsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    labChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 14px",
      background: "white",
      color: "#059669",
      border: "1.5px solid #10b981",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
      transition: "all 0.2s ease",
    },
    subLabChip: {

    },
    noLabChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 14px",
      background: "#fef2f2",
      color: "#dc2626",
      border: "1.5px solid #fecaca",
      borderRadius: "6px",
      fontSize: "13px",
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
    subjectSection: {
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "1px solid #e5e7eb",
    },
    subjectHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    subjectTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#2d3748",
      margin: 0,
    },
    addSubjectButton: {
      padding: "8px 16px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    subjectCard: {
      padding: "15px",
      background: "#f9fafb",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      marginBottom: "12px",
    },
    subjectCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    subjectNumber: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#6b7280",
    },
    removeSubjectButton: {
      padding: "4px 8px",
      background: "#fee2e2",
      color: "#dc2626",
      border: "none",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "12px",
    },
    switchButton: {
      padding: "12px",
      background: "white",
      color: "#374151",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading programs data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Lab Programs Management</h1>
        <button 
          style={styles.addButton} 
          onClick={handleAddProgram}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New
        </button>
      </header>

      {/* Card List */}
      <div style={styles.cardContainer}>
        {programs && programs.length > 0 ? (
          programs.map((program, index) => (
            <div key={program._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <div style={styles.profileImage}>
                    P{index + 1}
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardName}>{program.Program_Name}</h3>
                    <p style={styles.cardEmail}>Batch: {program.Program_Batch}</p>
                  </div>
                </div>

                <div style={styles.cardRight}>
                  <div style={{ textAlign: "right" }}>
                    <p style={styles.cardStock}>
                      Section {program.Program_Section} | Sem {program.Program_Semester}
                    </p>
                  </div>

                  <span style={styles.statusBadge}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    {program.Subject.length} {program.Subject.length === 1 ? 'Subject' : 'Subjects'}
                  </span>

                  <div style={styles.actionButtons}>
                    <button
                      style={{ ...styles.iconButton, ...styles.editButton }}
                      onClick={(e) => handleEditProgram(program, e)}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      style={{ ...styles.iconButton, ...styles.deleteButton }}
                      onClick={(e) => handleDelete(program._id, e)}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      style={{
                        ...styles.iconButton,
                        ...styles.expandButton,
                        transform: expandedId === program._id ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      onClick={() => toggleExpand(program._id)}
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedId === program._id && (
                <div style={styles.expandedContent}>
                  <div style={styles.detailsGrid}>
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Section
                      </span>
                      <span style={styles.infoValue}>Section {program.Program_Section || "None"}</span>
                    </div>
                    
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        Semester
                      </span>
                      <span style={styles.infoValue}>Semester {program.Program_Semester}</span>
                    </div>
                    
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Group
                      </span>
                      <span style={styles.infoValue}>{program.Program_Group || "None"}</span>
                    </div>
                    
                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Batch
                      </span>
                      <span style={styles.infoValue}>{program.Program_Batch}</span>
                    </div>
                  </div>

                  <div style={styles.labAccessSection}>
                    <span style={styles.labAccessLabel}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: "6px" }}>
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      Subjects
                      <span style={styles.labCount}>
                        {program.Subject && program.Subject.length > 0 ? program.Subject.length : 0} subject{program.Subject && program.Subject.length !== 1 ? 's' : ''}
                      </span>
                    </span>
                    
                    <div style={styles.labChipsContainer}>
                      {program.Subject && program.Subject.length > 0 ? (
                        program.Subject.map((subj, idx) => (
                          <span key={idx} style={styles.labChip}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                              {subj.Subject_ID ? `${subj.Subject_ID.Course_Code} - ${subj.Subject_ID.Course_Name}` : 'N/A'}                            
                            <div>
                            {subj.Faculty_Assigned ? `${subj.Faculty_Assigned.Name} ${subj.Faculty_Assigned.Email}` : "N/A"}
                            </div>
                          </span>
                          
                        ))
                      ) : (
                        <span style={styles.noLabChip}>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                          No subjects assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: "#555", fontSize: "1.1rem", fontWeight: 500, textAlign: "center" }}>No Programs found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          style={styles.modal}
          onClick={handleCloseForm}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>
              {isEditMode ? "Edit Program" : "Add New Program"}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Program Name</label>
              <select
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                style={styles.select}
                disabled={isEditMode}>
                <option value="">Select program name</option>
                <option value="B.Tech">B.Tech CSE</option>
                <option value="BCA">BCA (H)</option>
                <option value="B.SC">B.SC</option>
                <option value="MCA">MCA</option>
                <option value="M.Tech">M.Tech</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Specialization</label>
              {showCustomSpecialization ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Enter specialization"
                    style={{ ...styles.input, flex: 1 }}
                    disabled={isEditMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomSpecialization(false)}
                    style={styles.switchButton}
                    disabled={isEditMode}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    style={{ ...styles.select, flex: 1 }}
                    disabled={isEditMode || !formData.programName}
                  >
                    <option value="">
                      {formData.programName
                        ? "Select specialization"
                        : "Select program first"}
                    </option>
                    {formData.programName &&
                      specializationOptions[formData.programName]?.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, specialization: "" });
                      setShowCustomSpecialization(true);
                    }}
                    style={styles.switchButton}
                    disabled={isEditMode}
                  >
                    + Add New
                  </button>
                </div>
              )}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem.toString()}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Group</label>
                <select
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select group</option>
                  <option value="G1">Group 1</option>
                  <option value="G2">Group 2</option>
                  <option value="G3">Group 3</option>
                  <option value="G4">Group 4</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Batch</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select
                    name="batchStart"
                    value={formData.batchStart}
                    onChange={handleChange}
                    style={{ ...styles.select, flex: 1 }}
                    disabled={isEditMode}
                  >
                    <option value="">Start Year</option>
                    {[2022, 2023, 2024, 2025, 2026].map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    name="batchEnd"
                    value={formData.batchEnd}
                    onChange={handleChange}
                    style={{ ...styles.select, flex: 1 }}
                    disabled={isEditMode}
                  >
                    <option value="">End Year</option>
                    {[2026, 2027, 2028, 2029, 2030].map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.subjectSection}>
              <div style={styles.subjectHeader}>
                <h3 style={styles.subjectTitle}>Subjects</h3>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  style={styles.addSubjectButton}
                >
                  + Add Subject
                </button>
              </div>

              {formData.subjects.map((subj, index) => (
                <div key={index} style={styles.subjectCard}>
                  <div style={styles.subjectCardHeader}>
                    <span style={styles.subjectNumber}>Subject {index + 1}</span>
                    {formData.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        style={styles.removeSubjectButton}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Subject</label>
                      <select
                        name="Subject_ID"
                        value={subj.Subject_ID}
                        onChange={(e) => handleSubjectChange(e, index)}
                        style={styles.select}
                      >
                        <option value="">Select Subject</option>
                        {subjectList.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.Course_Code} - {s.Course_Name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Hours</label>
                      <input
                        type="number"
                        name="Number_Of_Hours"
                        value={subj.Number_Of_Hours}
                        onChange={(e) => handleSubjectChange(e, index)}
                        style={styles.input}
                        min="0"
                        placeholder="Enter hours"
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Faculty</label>
                      <select
                        name="Faculty_Assigned"
                        value={subj.Faculty_Assigned}
                        onChange={(e) => handleSubjectChange(e, index)}
                        style={styles.select}
                      >
                        <option value="">Select Faculty</option>
                        {facultyList.map((f) => (
                          <option key={f._id} value={f._id}>
                            {f.Name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Lab</label>
                      <select
                        name="Lab_Allocated"
                        value={subj.Lab_Allocated}
                        onChange={(e) => handleSubjectChange(e, index)}
                        style={styles.select}
                      >
                        <option value="">Select Lab</option>
                        {labList.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.Lab_ID}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={handleCloseForm}
              >
                Cancel
              </button>
              <button
                style={styles.saveButton}
                onClick={isEditMode ? handleEditProgramSubmit : handleAddProgramSubmit}
              >
                {isEditMode ? 'Update Program' : 'Add Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}