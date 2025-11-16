'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Upload, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

const LabTimetablePage = () => {
  const { id } = useParams();  
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState('week');
  const [labData, setLabData] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newInfo, setNewInfo] = useState({
    hardwareSpecs: "",
    softwareSpecs: "",
    device: [
      { Device_Type: "", Brand: "", Serial_No: "" }
    ]
  });
  const [expandedId, setExpandedId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [timetableData, setTimetableData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    Subject: "",
    Program: "",
    Faculty: "",
    Day: "",
    StartTimeSlot: "",
    EndTimeSlot: "",
    Lab: id, 
  });
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);

  const fetchLab = async () => {
    try {
      const res = await fetch(`/api/admin/getLabById/${id}`);
      const data = await res.json();
      if (res.ok) {
        setLabData(data.lab);

        const labsArray = Array.isArray(data.labs)
          ? data.labs
          : [data.lab || data.labs];

        const formattedData = labsArray.flatMap((lab) =>
          (lab?.TimeTable || []).map((item, index) => {
            const [start, end] = item.TimeSlot.split(" - ");
            return {
              id: item._id,
              day: item.Day,
              subject: item.Subject?.Course_Name || "Unnamed Subject",
              course: `${item.Program?.Program_Section || ""}  ${item.Program?.Program_Name || ""} ${
                item.Program?.Program_Semester
                  ? "Sem " + item.Program.Program_Semester
                  : ""
              } ${item.Program?.Program_Batch || ""} ${item.Program?.Program_Group || ""}`,
              faculty:
                typeof item.Faculty === "string"
                  ? item.Faculty === "Not Assigned"
                    ? ""
                    : item.Faculty
                  : item.Faculty?.Name || "",
              startTime: start.trim(),
              endTime: end.trim(),
              color: colors[index % colors.length],
            };
          })
        );

        setTimetableData(formattedData);
        console.log(data);
        
      } else {
        console.error("Failed to fetch lab:", data.error);
      }
    } catch (err) {
      console.error("Error fetching lab:", err);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchLab(),
          fetchSubject()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const addMoreInfo = () => {
    setShowAddModal(true);
  };

  const deviceType = ['Projector', 'Screen Board'];

  const handleAddInfo = async () => {

    if(!newInfo.hardwareSpecs || !newInfo.softwareSpecs || !newInfo.device[0].Device_Type || !newInfo.device[0].Brand || !newInfo.device[0].Serial_No) {
      alert("Please fill in all required fields!");
      return;
    }
    
    const payload = {
      Hardware_Specifications: newInfo.hardwareSpecs,
      Software_Specifications: newInfo.softwareSpecs,
      Device: newInfo.device,
    }

    console.log(payload);
    console.log(id);

    try {
      const res = await fetch(`/api/admin/addLabMoreInfo/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();

      if (res.ok) {
        alert("Additional Info added successfully!");
        setShowAddModal(false);
        setNewInfo({
          hardwareSpecs: "",
          softwareSpecs: "",
          device: [{ Device_Type: "", Brand: "", Serial_No: "" }],
        });
        fetchLab();

      } else {
        alert(data.error || "Failed to add info");
      }
    } catch (error) {
      console.error("Error adding info:", error);
      alert("Something went wrong while adding the info.");
    }
  };

  const handleUpdateInfo = async () => {};

  const fetchSubject = async () => {
    try {
      const labID = id;
      const res = await fetch(`/api/admin/getLabSubject?labId=${labID}`);
      const data = await res.json();
      if (res.ok) {
        setSubjects(data.subjects);

        const allPrograms = data.subjects.flatMap((s) => s.Programs);

        const uniquePrograms = allPrograms.filter(
          (p, i, self) => i === self.findIndex((x) => x._id === p._id)
        );
        setPrograms(uniquePrograms);

        const facultiesArr = data.subjects.flatMap((s) =>
          s.Programs.flatMap((p) =>
            p.Subject.map((ps) => ({
              Faculty_ID: ps.Faculty_Assigned || "Not Assigned",
              Faculty_Name: ps.Faculty_Assigned || "Not Assigned",
            }))
          )
        );

        const uniqueFaculties = facultiesArr.filter(
          (f, i, self) => i === self.findIndex((x) => x.Faculty_ID === f.Faculty_ID)
        );

        setFaculties(uniqueFaculties);
        console.log(data);
        
      } else {
        console.error("Failed to fetch subject:", data.error);
      }
    } catch (err) {
      console.error("Error fetching subject:", err);
    }
  };

  const handleProgramChange = (programId) => {
    setFormData({ ...formData, Program: programId });

    const relatedSubjects = subjects
      .map((subj) => {
        const matchedProgram = subj.Programs.find((p) => p._id === programId);
        if (matchedProgram) {
          return {
            ...subj,
            Programs: [matchedProgram], 
          };
        }
        return null;
      })
      .filter(Boolean); 

    const relatedFaculties = relatedSubjects.flatMap((subj) =>
      subj.Programs.flatMap((p) =>
        p.Subject.map((ps) => ({
          Faculty_ID: ps.Faculty_Assigned || "Not Assigned",
          Faculty_Name: ps.Faculty_Assigned || "Not Assigned",
        }))
      )
    );

    console.log(relatedSubjects);
    console.log(relatedFaculties);
    
    setFilteredSubjects(relatedSubjects);
    setFilteredFaculties(relatedFaculties);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

  const colors = ["#00c97b", "#00b8d9", "#f6ad55", "#9f7aea", "#fc8181", "#4299e1"];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startTimeSlots = [
    '09:10 AM', '10:05 AM', '11:00 AM', '11:50 AM',
    '12:40 PM', '13:30 PM', '14:20 PM', '15:10 PM'
  ];

  const endTimeSlots = [
    '10:00 AM', '11:00 AM', '11:50 AM', '12:40 PM',
    '13:30 PM', '14:20 PM', '15:10 PM', '16:00 PM'
  ];

  const timeSlots = [
    "09:10 AM - 10:00 AM",
    "10:05 AM - 11:00 AM",
    "11:00 AM - 11:50 AM",
    "11:50 AM - 12:40 PM",
    "12:40 PM - 13:30 PM",
    "13:30 PM - 14:20 PM",
    "14:20 PM - 15:10 PM",
    "15:10 PM - 16:00 PM",
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
    if (!time) return "";
    const [timePart, modifier] = time.trim().split(" ");
    const [hoursStr, minutesStr] = timePart.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const period = hours >= 12 ? "PM" : "AM";

    return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const timeToMinutes = (time) => {
    const [timePart, modifier] = time.trim().split(" ");
    const [hoursStr, minutesStr] = timePart.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const getEventForSlot = (day, timeSlot) => {
    const slotStart = timeSlot.split(' - ')[0];
    const slotMinutes = timeToMinutes(slotStart);
    
    return timetableData.find((event) => {
      if (event.day.toLowerCase() !== day.toLowerCase()) return false;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Subject || !formData.Program || !formData.Day || !formData.StartTimeSlot || !formData.EndTimeSlot || !formData.Lab) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = { 
      Subject: formData.Subject,
      Program: formData.Program,
      Faculty: formData.Faculty,
      Day: formData.Day,
      TimeSlot: `${formData.StartTimeSlot} - ${formData.EndTimeSlot}`,
      Lab: formData.Lab,
     };
    console.log(payload);

    try {
      const res = await fetch("/api/admin/bookTimetableSlot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Timetable Slot Booked successfully!");
        fetchLab();
        setShowForm(false);
      } else {
        alert(data.error || "Failed to book slot");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("Something went wrong while booking the slot.");
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
      width: isMobile ? '100%' : isTablet ? 'calc(100% - 200px)' : 'calc(100% - 255px)',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '0.75rem' : isTablet ? '1.5rem' : '2rem',
      boxSizing: 'border-box',
      marginLeft: isMobile ? '0' : isTablet ? '200px' : '255px',
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
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px'
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
    moreInfoSection: {
      marginTop: '24px',
      borderTop: '2px solid rgba(0, 201, 123, 0.1)',
      paddingTop: '24px'
    },
    moreInfoHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      cursor: 'pointer'
    },
    moreInfoTitle: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#2d3748',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    toggleIcon: {
      fontSize: '20px',
      color: '#00c97b',
      transition: 'transform 0.3s ease'
    },
    moreInfoContent: {
      display: showMoreInfo ? 'block' : 'none'
    },
    infoSectionTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '20px',
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    addButton: {
      background: '#00c97b',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s ease'
    },
    deviceCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
      border: '1px solid rgba(0, 201, 123, 0.15)',
      boxShadow: '0 2px 8px rgba(0, 201, 123, 0.08)',
      transition: 'all 0.3s ease'
    },
    deviceCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid rgba(0, 201, 123, 0.1)'
    },
    deviceType: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#2d3748'
    },
    deviceQuantity: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#00c97b',
      background: 'rgba(0, 201, 123, 0.1)',
      padding: '4px 12px',
      borderRadius: '12px'
    },
    deviceCardBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    deviceDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px'
    },
    deviceDetailLabel: {
      fontSize: '12px',
      color: '#718096',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      minWidth: '80px'
    },
    deviceDetailValue: {
      fontSize: '14px',
      color: '#2d3748',
      fontWeight: 500,
      textAlign: 'right',
      flex: 1
    },
    specsBox: {
      background: 'rgba(0, 201, 123, 0.05)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid rgba(0, 201, 123, 0.15)'
    },
    specsContent: {
      fontSize: '14px',
      color: '#4a5568',
      lineHeight: '1.8',
      whiteSpace: 'pre-line',
      fontFamily: 'monospace'
    },
    remarksBox: {
      background: 'rgba(0, 201, 123, 0.05)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      border: '1px solid rgba(0, 201, 123, 0.15)'
    },
    remarksText: {
      fontSize: '14px',
      color: '#4a5568',
      lineHeight: '1.6'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#718096',
      fontSize: '14px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '28px 30px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      overflowY: 'auto'
    },
    modalHeader: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#2d3748',
      marginBottom: '20px',
      marginTop: 0
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      background: 'white'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      background: 'white',
      color: '#718096',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px'
    },
    saveButton: {
      flex: 1,
      padding: '12px',
      background: 'linear-gradient(135deg, #00c97b 0%, #00b8d9 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px'
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
    viewButton: {
      color: "#00b8d9",
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
    viewButtonStyle: {
      backgroundColor: "#10b981",     
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "8px 14px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 500,
      transition: "all 0.25s ease",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    viewButtonHover: {
      backgroundColor: "#10a981",     
      transform: "translateY(-1px)",
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
      backgroundColor: '#e2e8f0',
      color: 'black',
      borderColor: 'transparent'
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
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalTT: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      padding: '2rem',
      width: '380px',
      maxWidth: '90%',
    },
    heading: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loaderContainer}>
          <Loader2 size={48} className="animate-spin" color="#10b981" />
          <p style={styles.loaderText}>Loading lab data...</p>
        </div>
      </div>
    );
  }

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
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Lab Incharge</span>
              <span style={styles.infoValue}>{labData?.Lab_Incharge?.[0]?.Name}</span>
              <span style={styles.infoValue}>{labData?.Lab_Incharge?.[0]?.Email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Total Capacity</span>
              <span style={styles.infoValue}>{labData?.Total_Capacity}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Total PCs</span>
              <span style={styles.infoValue}>{labData?.PCs?.length}</span>
            </div>
          </div>

          {/* More Info Section */}
          <div style={styles.moreInfoSection}>
            <div 
              style={styles.moreInfoHeader}
              onClick={() => setShowMoreInfo(!showMoreInfo)}>
              <h2 style={styles.moreInfoTitle}>
                More Information
                <span style={{
                  ...styles.toggleIcon,
                  transform: showMoreInfo ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </h2>
            </div>

            <div style={styles.moreInfoContent}>
              {/* Add Button for Specifications */}
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button 
                  style={styles.addButton}
                  onClick={addMoreInfo}>
                  <span style={{fontSize: '18px'}}>+</span> Add Information
                </button>
              </div>

              {/* Hardware Specifications */}
              <div style={styles.infoSectionTitle}>
                <span>Hardware Specifications</span>
              </div>
              {labData.Hardware_Specifications ? (
                <div style={styles.specsBox}>
                  <div style={styles.specsContent}>
                    {labData.Hardware_Specifications}
                  </div>
                </div>
              ) : (
                <div style={styles.emptyState}>No hardware specifications added yet</div>
              )}

              {/* Software Specifications */}
              <div style={styles.infoSectionTitle}>
                <span>Software Specifications</span>
              </div>
              {labData.Software_Specifications ? (
                <div style={styles.specsBox}>
                  <div style={styles.specsContent}>
                    {labData.Software_Specifications}
                  </div>
                </div>
              ) : (
                <div style={styles.emptyState}>No software specifications added yet</div>
              )}

              {/* Screen Panel / Projector Details */}
              <div style={styles.infoSectionTitle}>
                <span>Screen Board / Projector Details</span>
              </div>
              
              {labData?.Device?.length > 0 ? (
                <div style={styles.cardGrid}>
                  {labData.Device.map((device, index) => (
                    <div key={index} style={styles.deviceCard}>
                      <div style={styles.deviceCardHeader}>
                        <span style={styles.deviceType}>
                          {device.Device_Type
                            .split(" ")
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </span>
                        <span style={styles.deviceQuantity}>Qty: {labData.Device?.length}</span>
                      </div>
                      <div style={styles.deviceCardBody}>
                        <div style={styles.deviceDetail}>
                          <span style={styles.deviceDetailLabel}>Brand</span>
                          <span style={styles.deviceDetailValue}>{device.Brand}</span>
                        </div>
                        <div style={styles.deviceDetail}>
                          <span style={styles.deviceDetailLabel}>Serial No.</span>
                          <span style={styles.deviceDetailValue}>{device.Serial_No}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>No screen/projector details added yet</div>
              )} 

              {/* Remarks */}
              <div style={styles.sectionTitle}>
                <span>Remarks</span>
              </div>
              <div style={styles.remarksBox}>
                <div style={styles.specsContent}>
                  {labData?.Remarks || 'No remarks added'}
                </div>
              </div>
            </div>
          </div>
        </div>

      ) : (
        <p>Loading...</p> 
      )}

      {/* Add/Edit Information Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => {
          setShowAddModal(false);
          setEditing(null);
        }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalHeader}>{editing ? 'Update Information' : 'Add Information'}</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Hardware Specifications</label>
              <input 
                type="text"
                style={styles.input}
              value={newInfo.hardwareSpecs}
                onChange={(e) => setNewInfo({...newInfo, hardwareSpecs: e.target.value})}
                placeholder="Enter Hardware Specifications"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Software Specifications</label>
              <input 
                type="text"
                style={styles.input}
                value={newInfo.softwareSpecs}
                onChange={(e) => setNewInfo({...newInfo, softwareSpecs: e.target.value})}
                placeholder="Enter Software Specifications"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Device</label>
              <select
                style={styles.input}
                value={newInfo.device[0].Device_Type}
                onChange={(e) =>
                  setNewInfo({
                    ...newInfo,
                    device: [
                      {
                        ...((newInfo.device && newInfo.device[0]) || {
                          Device_Type: "",
                          Brand: "",
                          Serial_No: "",
                        }),
                        Device_Type: e.target.value,
                      },
                    ],
                  })
                }>
                <option value="">Select Device_Type</option>
                {deviceType.map((d, index) => (
                  <option key={index} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Brand</label>
              <input 
                type="text"
                style={styles.input}
                value={newInfo.device[0].Brand}
                onChange={(e) =>
                  setNewInfo({
                    ...newInfo,
                    device: [
                      {
                        ...((newInfo.device && newInfo.device[0]) || {
                          Device_Type: "",
                          Brand: "",
                          Serial_No: "",
                        }),
                        Brand: e.target.value,
                      },
                    ],
                  })
                }
                placeholder="Enter Brand"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>S/N</label>
              <input 
                type="text"
                style={styles.input}
                value={newInfo.device[0].Serial_No}
                onChange={(e) =>
                  setNewInfo({
                    ...newInfo,
                    device: [
                      {
                        ...((newInfo.device && newInfo.device[0]) || {
                          Device_Type: "",
                          Brand: "",
                          Serial_No: "",
                        }),
                        Serial_No: e.target.value,
                      },
                    ],
                  })
                }
                placeholder="Enter S/N"
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowAddModal(false);
                  setEditing(null);
                  setNewInfo({
                    hardwareSpecs: "",
                    softwareSpecs: "",
                    device: [{ Device_Type: "", Brand: "", Serial_No: "" }],
                  });
                }}>
                Cancel
              </button>
              <button 
                style={styles.saveButton}
                onClick={editing ? handleUpdateInfo : handleAddInfo}>
                {editing ? 'Update Information' : 'Add Information'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject List Card */}
      <div style={styles.subjectListCard}>
        <div style={styles.subjectListHeader}>
          <h2 style={styles.subjectListTitle}>Subject List</h2>
          
        </div>
        
        <div style={styles.cardContainer}>
          {subjects.length === 0 ? (
            <p style={{ display: "flex", justifyContent: "center" }} >No subjects found for this lab.</p>
            ) : (
              <>
                {subjects.map((subject, index) => (
                  <div key={subject._id} style={styles.card}>
                    <div 
                      style={styles.cardHeader}
                      onClick={() => toggleExpand(subject._id)}
                    >
                      <div style={styles.cardLeft}>
                        <div style={styles.avatar}>S{index + 1}</div>
                        <div style={styles.cardInfo}>
                          <h3 style={styles.subjectTitle}>{(subject.Course_Name).toUpperCase()}</h3>
                          <div style={styles.courseCode}>Code: {subject.Course_Code}</div>
                        </div>
                      </div>

                      <div style={styles.cardRight}>
                        <span 
                          style={{
                            ...styles.uploadBadge,
                            ...(subject.Status === 'uploaded'
                              ? styles.statusUploaded
                              : styles.statusPending)
                          }}
                        >
                          {subject.Status === 'uploaded' ? 'Uploaded' : 'Pending'}
                        </span>
                        <span style={styles.programCount}>
                          {subject.Programs ? (
                            <>{subject.Programs.length} {subject.Programs.length === 1 ? 'Program' : 'Programs'}</>
                          ) : (
                            '0 Programs'
                          )}
                        </span>
                        <div style={styles.actionButtons}>
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
                            {expandedId === subject._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedId === subject._id && (
                      <div style={styles.expandedContent}>
                        {/* Experiment List Section */}
                        <div style={styles.section}>
                          <div style={styles.sectionTitle}>Experiment List</div>
                          <div style={styles.uploadSection}>
                            {subject.Experiment_List ? (
                              <>
                                <span style={styles.fileName}>{subject.Experiment_List}</span>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <button style={styles.uploadButton} onClick={() => handleFileUpload(subject._id)}>
                                    <Upload size={14} /> Replace
                                  </button>
        
                                  <button
                                    style={styles.viewButtonStyle}
                                    onMouseEnter={(e) => Object.assign(e.target.style, styles.viewButtonHover)}
                                    onMouseLeave={(e) => Object.assign(e.target.style, styles.viewButtonStyle)}
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
                        <div style={styles.section}>
                          <div style={styles.sectionTitle}>Assigned Programs</div>
                          <div style={styles.programsGrid}>
                            {subject.Programs && subject.Programs.length > 0 ? (
                              subject.Programs.map((sp) => (
                                <div key={sp._id} style={styles.programCard}>
                                  <div style={styles.programHeader}>
                                    <div>
                                      <div style={styles.programName}>{sp.Program_Name}</div>
                                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                        Section {sp.Program_Section} • Semester {sp.Program_Semester} • Batch {sp.Program_Batch}
                                      </div>
                                    </div>
                                    <span style={styles.programBadge}>{sp.Program_Group}</span>
                                  </div>
                                  <div style={styles.programDetails}>
                                    <div style={styles.detailRow}>
                                      <span style={styles.detailLabel}>Faculty:</span>
                                      <span style={styles.detailValue}>{(sp.Subject && sp.Subject[0] && sp.Subject[0].Faculty_Assigned?.Name) || "Not Assigned"}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                      <span style={styles.detailLabel}>Hours/Week:</span>
                                      <span style={styles.detailValue}>{(sp.Subject && sp.Subject[0] && sp.Subject[0].Number_Of_Hours) || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div>No programs assigned.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
          )}
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
            </div>
            <button 
              style={styles.addButton}
              onClick={() => setShowForm(true)}>
              <Plus size={16} />
              New Slot
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

      {/* Book Timetable Slot */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modalTT}>
            <h2 style={styles.heading}>New Booking</h2>

            <select
              value={formData.Program}
              onChange={(e) => handleProgramChange(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Program</option>
              {programs.map(p => (               
                (<option key={p._id} value={p._id}>{ p.Program_Section + " - " + p.Program_Name + " - Sem " + p.Program_Semester + " " + p.Program_Batch + " " + p.Program_Group}</option>)
              ))}
            </select>

            <select
              value={formData.Subject}
              onChange={(e) => setFormData({ ...formData, Subject: e.target.value })}
              disabled={!formData.Program || !filteredSubjects.length}
              style={styles.select}
            >
              <option value="">Select Subject</option>
              {filteredSubjects.map(s => (
                <option key={s._id} value={s._id}>{s.Course_Name}</option>
              ))}
            </select>

            <select
              value={formData.Faculty}
              onChange={(e) => setFormData({ ...formData, Faculty: e.target.value })}
              style={styles.select}
              disabled={!formData.Program || !filteredFaculties.length}              
            >
              <option value="">Select Faculty</option>
              {console.log(faculties)}
              {filteredFaculties.map(f => (
                <option key={f.Faculty_ID} value={f.Faculty_ID}>
                  {f.Faculty_Name}
                </option>
              ))}
            </select>

            <select
              value={formData.Day}
              onChange={(e) => setFormData({ ...formData, Day: e.target.value })}
              style={styles.select}
            >
              <option value="">Select Day</option>
              {days.map(d =>
                <option key={d} value={d}>{d}</option>
              )}
            </select>

            <select
              value={formData.StartTimeSlot}
              onChange={(e) => setFormData({ ...formData, StartTimeSlot: e.target.value })}
              style={styles.select}
            >
              <option value="">Select Time Slot</option>
              {startTimeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>

            <select
              value={formData.EndTimeSlot}
              onChange={(e) => setFormData({ ...formData, EndTimeSlot: e.target.value })}
              style={styles.select}
            >
              <option value="">Select Time Slot</option>
              {endTimeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
            </select>

            <div style={styles.buttonContainer}>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setFormData({ Subject: '', Program: '', Faculty: '', Day: '', TimeSlot: '', Lab: id });
                  }} 
                style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleSubmit} style={styles.saveButton}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTimetablePage;