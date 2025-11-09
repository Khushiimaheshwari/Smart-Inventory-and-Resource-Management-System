'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';

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
      "Blockchain",
    ],
    "BCA": [
      "AI & DS",
      "Cloud Computing",
      "Full Stack Development",
      "Mobile App Development",
    ],
    "MCA": [
      "AI & ML",
      "Data Analytics",
      "Software Engineering",
    ],
    "M.Tech": [
      "Data Science",
      "VLSI Design",
      "Embedded Systems",
      "AI & Robotics",
    ],
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
      setPrograms(data.programs);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
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
    if (!formData.programName || !formData.section || !formData.semester || !formData.batchStart || !formData.batchEnd) {
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
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  const styles = {
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
    contentWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    pageHeader: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? 'column' : 'row',
      alignItems: (isMobile || isTablet) ? 'stretch' : 'center',
      justifyContent: 'space-between',
      marginBottom: (isMobile || isTablet) ? '1.5rem' : '2rem',
      gap: (isMobile || isTablet) ? '1rem' : '0',
    },
    pageTitle: {
      fontSize: isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
      fontFamily: "'Times New Roman', Times, serif",
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      backgroundColor: '#10b981',
      color: 'white',
      padding: (isMobile || isTablet) ? '0.65rem 1.25rem' : '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'background-color 0.2s',
      width: (isMobile || isTablet) ? '100%' : 'auto',
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: isMobile ? '0.9rem' : '1rem',
    },
    programsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: (isMobile || isTablet) ? '0.75rem' : '1rem',
    },
    programCard: {
      backgroundColor: 'white',
      borderRadius: (isMobile || isTablet) ? '0.5rem' : '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    },
    programCardContent: {
      padding: (isMobile || isTablet) ? '1rem' : '1.5rem',
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? 'column' : 'row',
      alignItems: (isMobile || isTablet) ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: (isMobile || isTablet) ? '1rem' : '0',
    },
    programInfoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: (isMobile || isTablet) ? '0.75rem' : '1.5rem',
    },
    programAvatar: {
      width: isMobile ? '3rem' : isTablet ? '3.5rem' : '4rem',
      height: isMobile ? '3rem' : isTablet ? '3.5rem' : '4rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    programAvatarSpan: {
      fontSize: isMobile ? '1rem' : isTablet ? '1.125rem' : '1.25rem',
      fontWeight: '700',
      color: '#6b7280',
      fontFamily: "'Times New Roman', Times, serif",
    },
    programDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      flex: '1',
    },
    programName: {
      fontSize: isMobile ? '1rem' : isTablet ? '1.125rem' : '1.25rem',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
      fontFamily: "'Times New Roman', Times, serif",
      wordBreak: 'break-word',
    },
    programMeta: {
      color: '#6b7280',
      margin: 0,
      fontSize: isMobile ? '0.85rem' : '0.95rem',
      fontFamily: "'Times New Roman', Times, serif",
    },
    programActions: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? 'row' : 'row',
      alignItems: 'center',
      gap: (isMobile || isTablet) ? '0.5rem' : '1rem',
      flexWrap: 'wrap',
    },
    statusBadge: {
      padding: isMobile ? '0.4rem 0.75rem' : '0.5rem 1rem',
      borderRadius: '9999px',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      fontWeight: '500',
      backgroundColor: '#d1fae5',
      color: '#065f46',
      fontFamily: "'Times New Roman', Times, serif",
      whiteSpace: 'nowrap',
    },
    labBadge: {
      padding: isMobile ? '0.4rem 0.75rem' : '0.5rem 1rem',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '9999px',
      fontSize: isMobile ? '0.75rem' : '0.875rem',
      fontWeight: '500',
      fontFamily: "'Times New Roman', Times, serif",
      whiteSpace: 'nowrap',
    },
    iconBtn: {
      padding: '0.5rem',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBtnEdit: {
      color: '#10b981',
    },
    iconBtnDelete: {
      color: '#ef4444',
    },
    iconBtnExpand: {
      color: '#6b7280',
    },
    rotated: {
      transform: 'rotate(180deg)',
      transition: 'transform 0.2s',
    },
    expandedContent: {
      backgroundColor: '#f0fdf4',
      padding: (isMobile || isTablet) ? '1rem' : '1.5rem',
      borderTop: '1px solid #e5e7eb',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: (isMobile || isTablet) ? '1fr' : 'repeat(4, 1fr)',
      gap: (isMobile || isTablet) ? '0.75rem' : '1.5rem',
    },
    detailCard: {
      backgroundColor: 'white',
      padding: (isMobile || isTablet) ? '0.75rem' : '1rem',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
    },
    detailLabel: {
      fontSize: isMobile ? '0.7rem' : '0.75rem',
      color: '#64748b',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontFamily: "'Times New Roman', Times, serif",
    },
    detailValue: {
      fontSize: isMobile ? '0.8rem' : '0.875rem',
      color: '#1e293b',
      fontWeight: '600',
      fontFamily: "'Times New Roman', Times, serif",
    },
    labsList: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? 'column' : 'row',
      gap: '12px',
      flexWrap: 'wrap',
    },
    subjectCard: {
      display: "flex",
      flexDirection: "column",
      width: (isMobile || isTablet) ? '100%' : 'calc(50% - 6px)',
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: (isMobile || isTablet) ? "0.75rem" : "10px",
      backgroundColor: "#fafafa",
    },
    subjectsHeader: {
      display: "flex",
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: "space-between",
      fontSize: isMobile ? "0.9rem" : "16px",
      fontWeight: "600",
      marginLeft: "10px",
      marginTop: "6px",
      fontFamily: "'Times New Roman', Times, serif",
      gap: isMobile ? '0.25rem' : '0',
    },
    subjectDetails: {
      fontSize: isMobile ? "0.8rem" : "14px",
      color: "#444",
      lineHeight: "1.6",
      marginLeft: "10px",
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
      padding: (isMobile || isTablet) ? '1rem' : '2rem',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: (isMobile || isTablet) ? '10px' : '12px',
      padding: (isMobile || isTablet) ? '1.25rem' : '24px',
      width: '100%',
      maxWidth: (isMobile || isTablet) ? '100%' : '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      fontFamily: "'Times New Roman', Times, serif",
    },
    modalHeader: {
      fontSize: isMobile ? '1.25rem' : '24px',
      fontWeight: '600',
      marginBottom: (isMobile || isTablet) ? '1rem' : '24px',
      color: '#111827',
      fontFamily: "'Times New Roman', Times, serif",
    },
    subjectSection: {
      marginTop: (isMobile || isTablet) ? "15px" : "20px",
    },
    subjectHeader: {
      display: "flex",
      flexDirection: (isMobile || isTablet) ? 'column' : 'row',
      alignItems: (isMobile || isTablet) ? 'stretch' : 'center',
      justifyContent: "space-between",
      marginBottom: "10px",
      gap: (isMobile || isTablet) ? '0.75rem' : '0',
    },
    subjectTitle: {
      margin: 0,
      fontSize: isMobile ? '1rem' : '18px',
      fontWeight: "600",
      color: "#111827",
      fontFamily: "'Times New Roman', Times, serif",
    },
    addSubjectButton: {
      backgroundColor: "#5a93f8",       
      color: "white",
      border: "none",
      padding: (isMobile || isTablet) ? "10px 14px" : "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "0.8rem" : "14px",
      fontWeight: "500",
      transition: "background-color 0.2s ease",
      fontFamily: "'Times New Roman', Times, serif",
      width: (isMobile || isTablet) ? '100%' : 'auto',
    },
    formGroup: {
      marginBottom: (isMobile || isTablet) ? '1rem' : '20px',
    },
    formRow: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? 'column' : 'row',
      gap: (isMobile || isTablet) ? '1rem' : '16px',
      marginBottom: (isMobile || isTablet) ? '1rem' : '20px',
    },
    formColumn: {
      flex: 1,
    },
    label: {
      display: 'block',
      fontSize: isMobile ? '0.85rem' : '14px',
      fontWeight: '500',
      marginBottom: '8px',
      color: '#374151',
      fontFamily: "'Times New Roman', Times, serif",
    },
    input: {
      width: "100%",
      padding: (isMobile || isTablet) ? "9px 11px" : "11px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: isMobile ? "0.9rem" : "14px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      outline: "none",
      fontFamily: "'Times New Roman', Times, serif",
    },
    select: {
      width: '100%',
      padding: (isMobile || isTablet) ? '9px 11px' : '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: isMobile ? '0.9rem' : '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      fontFamily: "'Times New Roman', Times, serif",
    },
    switchButton: {
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      padding: (isMobile || isTablet) ? "9px 11px" : "8px 12px",
      cursor: "pointer",
      fontSize: isMobile ? "0.8rem" : "13px",
      color: "#374151",
      transition: "background-color 0.2s ease",
      fontFamily: "'Times New Roman', Times, serif",
      whiteSpace: 'nowrap',
    },
    modalActions: {
      display: 'flex',
      flexDirection: (isMobile || isTablet) ? 'column-reverse' : 'row',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: (isMobile || isTablet) ? '1.25rem' : '24px',
    },
    cancelButton: {
      padding: (isMobile || isTablet) ? '9px 18px' : '10px 20px',
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
      padding: (isMobile || isTablet) ? '9px 18px' : '10px 20px',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Lab Programs</h2>
          <button
            style={styles.addBtn}
            onClick={handleAddProgram}
          >
            <Plus size={20} />
            <span>Add Program</span>
          </button>
        </div>

        <div style={styles.programsList}>
          {programs.map((program, index) => (
            <div key={program._id} style={styles.programCard}>
              <div style={styles.programCardContent}>
                <div style={styles.programInfoSection}>
                  <div style={styles.programAvatar}>
                    <span style={styles.programAvatarSpan}>P{index + 1}</span>
                  </div>

                  <div style={styles.programDetails}>
                    <h3 style={styles.programName}>{program.Program_Name}</h3>
                    <p style={styles.programMeta}>
                      Batch: {program.Program_Batch}
                    </p>
                  </div>
                </div>

                <div style={styles.programActions}>
                  <span style={styles.labBadge}>
                    {program.Subject.length} {program.Subject.length === 1 ? 'Subject' : 'Subjects'}
                  </span>

                  <button
                    style={{...styles.iconBtn, ...styles.iconBtnEdit}}
                    onClick={(e) => handleEditProgram(program, e)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Edit2 size={20} />
                  </button>

                  <button
                    style={{...styles.iconBtn, ...styles.iconBtnDelete}}
                    onClick={(e) => handleDelete(program._id, e)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={20} />
                  </button>

                  <button
                    onClick={() => toggleExpand(program._id)}
                    style={{...styles.iconBtn, ...styles.iconBtnExpand}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <ChevronDown 
                      size={20} 
                      style={expandedId === program._id ? styles.rotated : {}}
                    />
                  </button>
                </div>
              </div>

              {expandedId === program._id && (
                <div style={styles.expandedContent}>
                  <div style={styles.detailsGrid}>
                    <div style={styles.detailCard}>
                      <div style={styles.detailLabel}>SECTION</div>
                      <div style={styles.detailValue}>Section {program.Program_Section}</div>
                    </div>
                    <div style={styles.detailCard}>
                      <div style={styles.detailLabel}>SEMESTER</div>
                      <div style={styles.detailValue}>Semester {program.Program_Semester}</div>
                    </div>
                    <div style={styles.detailCard}>
                      <div style={styles.detailLabel}>GROUP</div>
                      <div style={styles.detailValue}>{program.Program_Group}</div>
                    </div>
                    <div style={styles.detailCard}>
                      <div style={styles.detailLabel}>BATCH</div>
                      <div style={styles.detailValue}>{program.Program_Batch}</div>
                    </div>
                  </div>
                  <div style={styles.subjectSection}>
                    <div style={styles.subjectHeader}>
                      <h4 style={styles.subjectTitle}>Subjects</h4>
                    </div>
                    <div style={styles.labsList}>
                      {program.Subject?.length > 0 ? (
                        program.Subject.map((subj) => (
                          <div key={subj._id} style={styles.subjectCard}>
                            <div style={styles.subjectsHeader}>
                              {subj.Subject_ID ? (
                                <>
                                  <strong>{(subj.Subject_ID.Course_Name).toUpperCase()}</strong>
                                  <span style={{ color: "#666", marginRight: "10px" }}>({subj.Subject_ID.Course_Code})</span>
                                </>
                              ) : (
                                <span>N/A</span>
                              )}
                            </div>

                            <div style={styles.subjectDetails}>
                              <p><strong>Faculty:</strong> {subj.Faculty_Assigned?.Name || "Not Assigned"}</p>
                              <p><strong>Lab:</strong> {subj.Lab_Allocated?.Lab_ID || "Not Assigned"}</p>
                              <p><strong>Hours:</strong> {subj.Number_Of_Hours || "N/A"}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "#666" }}>No subjects assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {showForm && (
          <div style={styles.modal} onClick={handleCloseForm}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalHeader}>
                {isEditMode ? 'Update Program' : 'Add New Program'}
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
                <div style={styles.formColumn}>
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

                <div style={styles.formColumn}>
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
                <div style={styles.formColumn}>
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

                <div style={styles.formColumn}>
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
                    + Add Another Subject
                  </button>
                </div>

                {formData.subjects.map((subj, index) => (
                  <div key={index} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                    <div style={styles.formRow}>
                      <div style={styles.formColumn}>
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

                      <div style={styles.formColumn}>
                        <label style={styles.label}>Number of Hours</label>
                        <input
                          type="number"
                          name="Number_Of_Hours"
                          value={subj.Number_Of_Hours}
                          onChange={(e) => handleSubjectChange(e, index)}
                          style={styles.input}
                          min="0"
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formColumn}>
                        <label style={styles.label}>Faculty Assigned</label>
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

                      <div style={styles.formColumn}>
                        <label style={styles.label}>Lab Allocated</label>
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
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  style={styles.saveButton}
                  onClick={isEditMode ? handleEditProgramSubmit : handleAddProgramSubmit}>
                  {isEditMode ? 'Update Program' : 'Add Program'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}