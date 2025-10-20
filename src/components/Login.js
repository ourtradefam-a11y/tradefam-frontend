import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to TradeFam</h1>
        <p style={styles.subtitle}>Manage your investment portfolio with ease</p>
        <button 
          onClick={() => loginWithRedirect()}
          style={styles.loginBtn}
        >
          Login with Auth0
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px'
  },
  title: {
    color: '#1a1a2e',
    marginBottom: '1rem'
  },
  subtitle: {
    color: '#666',
    marginBottom: '2rem'
  },
  loginBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  }
};

export default Login;
