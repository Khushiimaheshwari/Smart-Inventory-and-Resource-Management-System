'use client';
import { useState } from 'react';

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
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1.5rem 2rem',
    maxWidth: '1200px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  addButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  programList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '1200px',
    overflow: 'hidden',
  },
  programItem: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    transition: 'background-color 0.2s',
  },
  programInfo: {
    flex: 1,
  },
  programTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '0.75rem',
  },
  programDetails: {
    fontSize: '0.875rem',
    color: '#6c757d',
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  detailItem: {
    display: 'inline',
  },
  programActions: {
    position: 'relative',
  },
  menuButton: {
    padding: '0.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '0.25rem',
    backgroundColor: 'white',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minWidth: '150px',
    zIndex: 100,
  },
  menuItem: {
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#495057',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  formContainer: {
    padding: '2rem',
  },
  header: {
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#495057',
  },
  select: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    justifyContent: 'flex-start',
  },
  button: {
    padding: '0.5rem 1.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
  primaryButton: {
    backgroundColor: '#10b981',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#e9ecef',
    color: '#495057',
  },
};

// Dummy data
const dummyPrograms = [
  {
    id: 1,
    programName: 'B.Tech',
    section: 'A',
    semester: '3',
    group: 'G1',
    batch: '2023',
  },
  {
    id: 2,
    programName: 'BCA',
    section: 'B',
    semester: '4',
    group: 'G2',
    batch: '2023',
  },
  {
    id: 3,
    programName: 'MCA',
    section: 'A',
    semester: '5',
    group: 'G1',
    batch: '2022',
  },
  {
    id: 4,
    programName: 'M.Tech',
    section: 'C',
    semester: '2',
    group: 'G3',
    batch: '2024',
  },
];

export default function LabProgramsPage() {
  const [showForm, setShowForm] = useState(false);
  const [programs, setPrograms] = useState(dummyPrograms);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({
    programName: '',
    section: '',
    semester: '',
    group: '',
    batch: '',
  });

  const handleAddProgram = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      programName: '',
      section: '',
      semester: '',
      group: '',
      batch: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Program added:', formData);
    // Add your API call here
    handleCloseForm();
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEdit = (program) => {
    console.log('Edit program:', program);
    setFormData({
      programName: program.programName,
      section: program.section,
      semester: program.semester,
      group: program.group,
      batch: program.batch,
    });
    setShowForm(true);
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this program?')) {
      console.log('Delete program:', id);
      setPrograms(programs.filter(p => p.id !== id));
      setOpenMenuId(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add Program</h2>
        <button
          style={styles.addButton}
          onClick={handleAddProgram}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          Add
        </button>
      </div>

      {/* Program List */}
      <div style={styles.programList}>
        {programs.map((program) => (
          <div
            key={program.id}
            style={styles.programItem}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div style={styles.programInfo}>
              <div style={styles.programTitle}>
                {program.programName}
              </div>
              <div style={styles.programDetails}>
                <span style={styles.detailItem}>Section: {program.section}</span>
                <span style={styles.detailItem}>Semester: {program.semester}</span>
                <span style={styles.detailItem}>Group: {program.group}</span>
                <span style={styles.detailItem}>Batch: {program.batch}</span>
              </div>
            </div>
            <div style={styles.programActions}>
              <button
                style={styles.menuButton}
                onClick={() => toggleMenu(program.id)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ⋮
              </button>
              
              {openMenuId === program.id && (
                <div style={styles.dropdownMenu}>
                  <button
                    style={styles.menuItem}
                    onClick={() => handleEdit(program)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                  <button
                    style={styles.menuItem}
                    onClick={() => handleDelete(program.id)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={styles.modalOverlay} onClick={handleCloseForm}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.formContainer}>
              <div style={styles.header}>
                <h2 style={styles.title}>Add New Program</h2>
              </div>

              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Program Name</label>
                  <select
                    name="programName"
                    value={formData.programName}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Enter program name</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech</option>
                  </select>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      style={styles.select}
                      required
                    >
                      <option value="">Enter section</option>
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
                      required
                    >
                      <option value="">Enter semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                      <option value="5">Semester 5</option>
                      <option value="6">Semester 6</option>
                      <option value="7">Semester 7</option>
                      <option value="8">Semester 8</option>
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
                      required
                    >
                      <option value="">Enter group</option>
                      <option value="G1">Group 1</option>
                      <option value="G2">Group 2</option>
                      <option value="G3">Group 3</option>
                      <option value="G4">Group 4</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Batch</label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      style={styles.select}
                      required
                    >
                      <option value="">Enter batch</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                </div>

                <div style={styles.buttonGroup}>
                  <button
                    type="submit"
                    style={{ ...styles.button, ...styles.primaryButton }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    Add Program
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    style={{ ...styles.button, ...styles.secondaryButton }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}