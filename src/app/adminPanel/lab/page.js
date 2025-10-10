'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const LabTimetablePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState('week');

  // Lab Data
  const labData = {
    Lab_ID: "LAB-001",
    Lab_Name: "Lab 1",
    Location: "Building A - Floor 3",
    Lab_Incharge: "Dr. Sarah Johnson",
    Total_Capacity: 40,
    Status: "active",
    Software_Specifications: "Windows 11, Visual Studio, Python 3.11, MySQL",
    Hardware_Specifications: "Intel i5 10th Gen, 16GB RAM, 512GB SSD",
    Total_PCs: 35,
    Remarks: "Air conditioned lab with projector facilities"
  };

  // Timetable Data
  const timetableData = [
    {
      id: 1,
      day: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      subject: 'Computer Networks Lab',
      course: 'BCA Sem 2',
      faculty: 'Prof. Mike Chen',
      color: '#00c97b'
    },
    {
      id: 2,
      day: 'Monday',
      startTime: '14:00',
      endTime: '16:00',
      subject: 'Database Management Lab',
      course: 'BCA Sem 4',
      faculty: 'Dr. Emily Brown',
      color: '#00b8d9'
    },
    {
      id: 3,
      day: 'Tuesday',
      startTime: '10:00',
      endTime: '12:00',
      subject: 'Web Development Lab',
      course: 'BCA Sem 3',
      faculty: 'Prof. John Doe',
      color: '#f6ad55'
    },
    {
      id: 4,
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '11:00',
      subject: 'Operating System Lab',
      course: 'BCA Sem 5',
      faculty: 'Dr. Sarah Johnson',
      color: '#9f7aea'
    },
    {
      id: 5,
      day: 'Thursday',
      startTime: '09:30',
      endTime: '11:30',
      subject: 'Python Programming Lab',
      course: 'BCA Sem 1',
      faculty: 'Prof. Alex Kumar',
      color: '#fc8181'
    },
    {
      id: 6,
      day: 'Friday',
      startTime: '11:00',
      endTime: '13:00',
      subject: 'Data Structures Lab',
      course: 'BCA Sem 3',
      faculty: 'Dr. Lisa Wang',
      color: '#4299e1'
    }
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM'
  ];

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
      marginBottom: '30px',
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
      gridTemplateColumns: '80px repeat(7, 1fr)',
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
      padding: '12px 8px',
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
    }
  };

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { day: 'numeric' })}, ${end.getFullYear()}`;
  };

  const getEventForSlot = (day, time) => {
    const timeHour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const time24 = isPM && timeHour !== 12 ? timeHour + 12 : timeHour;
    const timeStr = `${time24.toString().padStart(2, '0')}:${time.split(':')[1].split(' ')[0]}`;

    return timetableData.find(event => {
      const eventStart = parseInt(event.startTime.split(':')[0]);
      const eventEnd = parseInt(event.endTime.split(':')[0]);
      return event.day === day && time24 >= eventStart && time24 < eventEnd;
    });
  };

  return (
    <div style={styles.container}>
      {/* Lab Information Card */}
      <div style={styles.labInfoCard}>
        <div style={styles.labHeader}>
          <h1 style={styles.labTitle}>{labData.Lab_Name}</h1>
          <span style={styles.statusBadge}>{labData.Status.toUpperCase()}</span>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Lab ID</span>
            <span style={styles.infoValue}>{labData.Lab_ID}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Location</span>
            <span style={styles.infoValue}>{labData.Location}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Lab Incharge</span>
            <span style={styles.infoValue}>{labData.Lab_Incharge}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Total Capacity</span>
            <span style={styles.infoValue}>{labData.Total_Capacity} Students</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Total PCs</span>
            <span style={styles.infoValue}>{labData.Total_PCs} Working</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Software</span>
            <span style={styles.infoValue}>{labData.Software_Specifications}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Hardware</span>
            <span style={styles.infoValue}>{labData.Hardware_Specifications}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Remarks</span>
            <span style={styles.infoValue}>{labData.Remarks}</span>
          </div>
        </div>
      </div>

      {/* Timetable Card */}
      <div style={styles.timetableCard}>
        <div style={styles.timetableHeader}>
          <div style={styles.weekNavigation}>
            <button style={styles.navButton}>
              <ChevronLeft size={20} />
            </button>
            <span style={styles.weekLabel}>{getWeekDates()}</span>
            <button style={styles.navButton}>
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

        {/* Timetable Grid */}
        <div style={styles.timetableGrid}>
          {/* Header Row */}
          <div style={styles.dayHeader}></div>
          {days.map(day => (
            <div key={day} style={styles.dayHeader}>{day}</div>
          ))}

          {/* Time Slots */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div style={styles.timeSlot}>{time}</div>
              {days.map(day => {
                const event = getEventForSlot(day, time);
                if (event && time === timeSlots.find(t => {
                  const hour = parseInt(t.split(':')[0]);
                  const isPM = t.includes('PM');
                  const h24 = isPM && hour !== 12 ? hour + 12 : hour;
                  return h24 === parseInt(event.startTime.split(':')[0]);
                })) {
                  return (
                    <div 
                      key={`${day}-${time}`}
                      style={{
                        ...styles.emptyCell,
                        ...styles.eventCell,
                        background: event.color,
                        gridRow: `span ${(parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0])) * 2}`
                      }}
                    >
                      <div style={styles.eventTitle}>{event.subject}</div>
                      <div style={styles.eventDetails}>{event.course}</div>
                      <div style={styles.eventDetails}>{event.faculty}</div>
                      <div style={styles.eventDetails}>{event.startTime} - {event.endTime}</div>
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