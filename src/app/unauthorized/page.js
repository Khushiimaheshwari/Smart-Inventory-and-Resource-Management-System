"use client";

export default function UnauthorizedPage() {

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    },
    heading: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#dc2626'
    },
    text: {
      marginTop: '0.5rem',
      color: '#4b5563'
    }
  };
    
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Unauthorized</h1>
      <p style={styles.text}>You don't have permission to access this page.</p>
    </div>
  );
}