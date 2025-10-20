import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Navigation() {
  const { user, isAuthenticated, logout } = useAuth0();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h1 style={styles.logo}>TradeFam</h1>
        {isAuthenticated && (
          <div style={styles.userSection}>
            <span style={styles.username}>{user?.name}</span>
            <button 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '1rem 0',
    marginBottom: '2rem'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: '#fff',
    margin: 0,
    fontSize: '1.5rem'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  username: {
    color: '#fff'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default Navigation;
