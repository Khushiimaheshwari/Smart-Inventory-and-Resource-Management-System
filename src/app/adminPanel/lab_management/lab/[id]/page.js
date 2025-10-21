'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'next/navigation';

const LabTimetablePage = () => {
  const { id } = useParams();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState('week');
  const [labData, setLabData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      title: "Data Structures and Algorithms",
      courseCode: "CSE301",
      experimentList: {
        status: "uploaded",
        fileName: "DSA_Experiments.pdf"
      },
      programs: [
        {
          id: 1,
          programName: "B.Tech CSE AI ML",
          section: "A",
          semester: 7,
          facultyName: "Dr. Amit Kumar",
          hours: 4,
          groupNumber: "G01"
        },
        {
          id: 2,
          programName: "B.Tech CSE",
          section: "B",
          semester: 5,
          facultyName: "Prof. Priya Singh",
          hours: 3,
          groupNumber: "G02"
        }
      ]
    },
    {
      id: 2,
      title: "Machine Learning",
      courseCode: "CSE402",
      experimentList: {
        status: "pending",
        fileName: null
      },
      programs: [
        {
          id: 1,
          programName: "B.Tech CSE AI ML",
          section: "A",
          semester: 8,
          facultyName: "Dr. Rajesh Sharma",
          hours: 5,
          groupNumber: "G01"
        }
      ]
    },
    {
      id: 3,
      title: "Database Management Systems",
      courseCode: "CSE303",
      experimentList: {
        status: "uploaded",
        fileName: "DBMS_Lab_Manual.pdf"
      },
      programs: [
        {
          id: 1,
          programName: "B.Tech CSE",
          section: "C",
          semester: 6,
          facultyName: "Dr. Meena Patel",
          hours: 4,
          groupNumber: "G03"
        },
        {
          id: 2,
          programName: "B.Tech IT",
          section: "A",
          semester: 6,
          facultyName: "Prof. Sunil Verma",
          hours: 4,
          groupNumber: "G01"
        }
      ]
    }
  ]);

  useEffect(() => {
      const fetchLab = async () => {
        try {
          const res = await fetch(`/api/admin/getLabById/${id}`);
          const data = await res.json();
          if (res.ok) {
            setLabData(data.lab);
            console.log(data);
            
          } else {
            console.error("Failed to fetch lab:", data.error);
          }
        } catch (err) {
          console.error("Error fetching lab:", err);
        }
      };
  
      fetchLab();
    }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFileUpload = (subjectId) => {
    // Simulate file upload
    console.log(`Upload file for subject ${subjectId}`);
  };

  // Timetable Data
  const timetableData = [
    {
      id: 1,
      day: 'Monday',
      startTime: '09:10',
      endTime: '11:00',
      subject: 'Computer Networks Lab',
      course: 'BCA Sem 2',
      faculty: 'Prof. Mike Chen',
      color: '#00c97b'
    },
    {
      id: 2,
      day: 'Monday',
      startTime: '14:20',
      endTime: '16:00',
      subject: 'Database Management Lab',
      course: 'BCA Sem 4',
      faculty: 'Dr. Emily Brown',
      color: '#00b8d9'
    },
    {
      id: 3,
      day: 'Tuesday',
      startTime: '10:05',
      endTime: '11:50',
      subject: 'Web Development Lab',
      course: 'BCA Sem 3',
      faculty: 'Prof. John Doe',
      color: '#f6ad55'
    },
    {
      id: 4,
      day: 'Wednesday',
      startTime: '09:10',
      endTime: '11:00',
      subject: 'Operating System Lab',
      course: 'BCA Sem 5',
      faculty: 'Dr. Sarah Johnson',
      color: '#9f7aea'
    },
    {
      id: 5,
      day: 'Thursday',
      startTime: '13:30',
      endTime: '15:10',
      subject: 'Python Programming Lab',
      course: 'BCA Sem 1',
      faculty: 'Prof. Alex Kumar',
      color: '#fc8181'
    },
    {
      id: 6,
      day: 'Friday',
      startTime: '11:00',
      endTime: '12:40',
      subject: 'Data Structures Lab',
      course: 'BCA Sem 3',
      faculty: 'Dr. Lisa Wang',
      color: '#4299e1'
    }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:10 - 10:00', '10:05 - 11:00', '11:00 - 11:50', '11:50 - 12:40',
    '12:40 - 13:30', '13:30 - 14:20', '14:20 - 15:10', '15:10 - 16:00'
  ];

   const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    return `${start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} – ${end.toLocaleDateString("en-US", { day: "numeric" })}, ${end.getFullYear()}`;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getEventForSlot = (day, timeSlot) => {
    const slotStart = timeSlot.split(' - ')[0];
    const slotMinutes = timeToMinutes(slotStart);
    
    return timetableData.find((event) => {
      if (event.day !== day) return false;
      const startMinutes = timeToMinutes(event.startTime);
      const endMinutes = timeToMinutes(event.endTime);
      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    });
  };

  const isEventStart = (event, timeSlot) => {
    const slotStart = timeSlot.split(' - ')[0];
    return timeToMinutes(event.startTime) === timeToMinutes(slotStart);
  };

  const calculateRowSpan = (event) => {
    const startMinutes = timeToMinutes(event.startTime);
    const endMinutes = timeToMinutes(event.endTime);
    
    let slotsSpanned = 0;
    for (let i = 0; i < timeSlots.length; i++) {
      const slotStart = timeSlots[i].split(' - ')[0];
      const slotMinutes = timeToMinutes(slotStart);
      if (slotMinutes >= startMinutes && slotMinutes < endMinutes) {
        slotsSpanned++;
      }
    }
    return slotsSpanned;
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const renderedEvents = {};

  const styles = {
    container: {
      width: 'calc(100% - 220px)', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      boxSizing: 'border-box',
      marginLeft: '245px',
      overflowX: 'hidden',
    },
    labInfoCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    labHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    labTitle: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#2d3748',
      margin: 0
    },
    statusBadge: {
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 600,
      background: 'rgba(0, 201, 123, 0.1)',
      color: '#00c97b'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginTop: '16px'
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    infoLabel: {
      fontSize: '12px',
      color: '#718096',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    infoValue: {
      fontSize: '15px',
      color: '#2d3748',
      fontWeight: 500
    },
    subjectListCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)'
    },
    subjectListHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    subjectListTitle: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#2d3748',
      margin: 0
    },
    cardContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s'
    },
    cardHeader: {
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    cardHeaderHover: {
      backgroundColor: '#f9fafb'
    },
    cardLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1
    },
    avatar: {
      width: '56px',
      height: '56px',
      borderRadius: '12px',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280'
    },
    cardInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    subjectTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#111827',
      margin: 0
    },
    courseCode: {
      fontSize: '14px',
      color: '#6b7280'
    },
    cardRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    uploadBadge: {
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600'
    },
    statusUploaded: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    programCount: {
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: '#e0e7ff',
      color: '#3730a3'
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
    addSubjectButton: {
      color: "#0ea5e9", 
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
      borderTop: '1px solid #e5e7eb',
      padding: '24px',
      backgroundColor: '#f9fafb'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#374151',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    uploadSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px dashed #d1d5db'
    },
    uploadButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    fileName: {
      fontSize: '14px',
      color: '#374151',
      fontWeight: '500'
    },
    programsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px'
    },
    programCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e5e7eb'
    },
    programHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    programName: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '4px'
    },
    programBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    programDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    detailRow: {
      display: 'flex',
      fontSize: '13px',
      color: '#6b7280'
    },
    detailLabel: {
      fontWeight: '600',
      minWidth: '100px',
      color: '#374151'
    },
    detailValue: {
      color: '#6b7280'
    },
    timetableCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 201, 123, 0.08)',
      overflowX: 'auto'
    },
    timetableHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    weekNavigation: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    navButton: {
      padding: '8px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    weekLabel: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#2d3748'
    },
    viewToggle: {
      display: 'flex',
      gap: '8px'
    },
    toggleButton: {
      padding: '8px 16px',
      border: '2px solid #e2e8f0',
      background: 'white',
      color: '#2d3748',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    toggleButtonActive: {
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      borderColor: 'transparent'
    },
    addButton: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px'
    },
    timetableGrid: {
      display: 'grid',
      gridTemplateColumns: '80px repeat(5, 1fr)',
      gridAutoRows: 'minmax(60px, auto)',
      gap: '1px',
      background: '#e2e8f0',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    dayHeader: {
      background: '#f7fafc',
      padding: '12px',
      textAlign: 'center',
      fontWeight: 600,
      fontSize: '14px',
      color: '#2d3748'
    },
    timeSlot: {
      background: 'white',
      padding: '12px 6px',
      fontSize: '12px',
      color: '#718096',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500
    },
    emptyCell: {
      background: 'white',
      minHeight: '60px',
      position: 'relative'
    },
    eventCell: {
      padding: '8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    eventTitle: {
      fontSize: '13px',
      fontWeight: 700
    },
    eventDetails: {
      fontSize: '11px',
      opacity: 0.9
    },

  };

  return (
    <div style={styles.container}>

      {/* Lab Information Card */}
      {labData ? (
         <div style={styles.labInfoCard}>
          <div style={styles.labHeader}>
            <h1 style={styles.labTitle}>{labData?.Lab_Name}</h1>
            <span style={styles.statusBadge}>{labData?.Status?.toUpperCase()}</span>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Lab ID</span>
              <span style={styles.infoValue}>{labData?.Lab_ID}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Lab Name</span>
              <span style={styles.infoValue}>{labData?.Lab_Name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Block</span>
              <span style={styles.infoValue}>{labData?.Block}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Lab Room</span>
              <span style={styles.infoValue}>{labData?.Lab_Room}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Lab Technician</span>
              <span style={styles.infoValue}>{labData?.LabTechnician?.[0]?.Name}</span>
              <span style={styles.infoValue}>{labData?.LabTechnician?.[0]?.Email}</span>
              <span style={styles.infoValue}>{labData?.LabTechnician?.[0]?.PhoneNumber}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Lab Incharge</span>
              <span style={styles.infoValue}>{labData?.Lab_Incharge}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Total Capacity</span>
              <span style={styles.infoValue}>{labData?.Total_Capacity}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Total PCs</span>
              <span style={styles.infoValue}>{labData?.PCs?.length}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Software</span>
              <span style={styles.infoValue}>{labData?.Software_Specifications}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Hardware</span>
              <span style={styles.infoValue}>{labData?.Hardware_Specifications}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Remarks</span>
              <span style={styles.infoValue}>{labData?.Remarks}</span>
            </div>
          </div>
        </div>

      ) : (
        <p>Loading...</p> 
      )}

      {/* Subject List Card */}
      <div style={styles.subjectListCard}>
        <div style={styles.subjectListHeader}>
          <h2 style={styles.subjectListTitle}>Subject List</h2>
          <button style={styles.addButton}>
            <Plus size={16} />
            Add Subject
          </button>
        </div>
        
        <div style={styles.cardContainer}>
        {subjects.map((subject) => (
          <div key={subject.id} style={styles.card}>
            <div 
              style={styles.cardHeader}
              onClick={() => toggleExpand(subject.id)}
            >
              <div style={styles.cardLeft}>
                <div style={styles.avatar}>S{subject.id}</div>
                <div style={styles.cardInfo}>
                  <h3 style={styles.subjectTitle}>{subject.title}</h3>
                  <div style={styles.courseCode}>Code: {subject.courseCode}</div>
                </div>
              </div>

              <div style={styles.cardRight}>
                <span 
                  style={{
                    ...styles.uploadBadge,
                    ...(subject.experimentList.status === 'uploaded'
                      ? styles.statusUploaded
                      : styles.statusPending)
                  }}
                >
                  {subject.experimentList.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                </span>
                <span style={styles.programCount}>
                  {subject.programs.length} {subject.programs.length === 1 ? 'Program' : 'Programs'}
                </span>
                <div style={styles.actionButtons}>
                  <button style={{ ...styles.iconButton, ...styles.addSubjectButton }}>
                    <Plus size={28} />
                  </button>
                  <button style={{ ...styles.iconButton, ...styles.editButton }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button style={{ ...styles.iconButton, ...styles.deleteButton }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button style={{ ...styles.iconButton, ...styles.expandButton }}>
                    {expandedId === subject.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {expandedId === subject.id && (
              <div style={styles.expandedContent}>
                {/* Experiment List Section */}
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Experiment List</div>
                  <div style={styles.uploadSection}>
                    {subject.experimentList.fileName ? (
                      <>
                        <span style={styles.fileName}>📎 {subject.experimentList.fileName}</span>
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
                        <span style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>
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
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Assigned Programs</div>
                  <div style={styles.programsGrid}>
                    {subject.programs.map((program) => (
                      <div key={program.id} style={styles.programCard}>
                        <div style={styles.programHeader}>
                          <div>
                            <div style={styles.programName}>{program.programName}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
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
    </div>
     
      {/* Timetable Card */}
      <div style={styles.timetableCard}>
        <div style={styles.timetableHeader}>
          <div style={styles.weekNavigation}>
            <button style={styles.navButton} onClick={previousWeek}>
              <ChevronLeft size={20} />
            </button>
            <span style={styles.weekLabel}>{getWeekDates()}</span>
            <button style={styles.navButton} onClick={nextWeek}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={styles.viewToggle}>
              <button
                style={{
                  ...styles.toggleButton,
                  ...(view === 'week' ? styles.toggleButtonActive : {})
                }}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                style={{
                  ...styles.toggleButton,
                  ...(view === 'day' ? styles.toggleButtonActive : {})
                }}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
            <button style={styles.addButton}>
              <Plus size={16} />
              New Booking
            </button>
          </div>
        </div>

        <div style={styles.timetableGrid}>
          {/* Header Row */}
          <div style={styles.dayHeader}></div>
          {days.map((day) => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}

          {/* Time Slots and Events */}
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div style={styles.timeSlot}>{time}</div>
              {days.map((day) => {
                const event = getEventForSlot(day, time);
                const eventKey = event ? `${event.id}-${day}` : null;

                if (event && isEventStart(event, time) && !renderedEvents[eventKey]) {
                  renderedEvents[eventKey] = true;
                  const rowSpan = calculateRowSpan(event);

                  return (
                    <div
                      key={`${day}-${time}`}
                      style={{
                        ...styles.emptyCell,
                        ...styles.eventCell,
                        background: event.color,
                        gridRow: `span ${rowSpan}`,
                      }}
                    >
                      <div style={styles.eventTitle}>{event.subject}</div>
                      <div style={styles.eventDetails}>{event.course}</div>
                      <div style={styles.eventDetails}>{event.faculty}</div>
                      <div style={styles.eventDetails}>
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                    </div>
                  );
                }

                if (!event) {
                  return <div key={`${day}-${time}`} style={styles.emptyCell}></div>;
                }

                return null;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabTimetablePage;