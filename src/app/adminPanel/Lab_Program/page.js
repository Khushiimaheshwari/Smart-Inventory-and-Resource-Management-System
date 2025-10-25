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
    padding: '2rem',
    maxWidth: '800px',
  },
  header: {
    marginBottom: '1.5rem',
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
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s',
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

export default function ProgramPage() {
  const [formData, setFormData] = useState({
    programName: '',
    section: '',
    semester: '',
    group: '',
    batch: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submit logic here
  };

  const handleCancel = () => {
    setFormData({
      programName: '',
      section: '',
      semester: '',
      group: '',
      batch: '',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
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
            >
              <option value="">Enter program name</option>
              <option value="BTech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="MTech">M.Tech</option>
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
            >
              Add Program
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}