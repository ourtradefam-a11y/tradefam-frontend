import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPortfolios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPortfolios = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Got token:', token ? 'Yes' : 'No');
      const response = await api.getPortfolios(token);
      setPortfolios(response.data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await api.createPortfolio(token, newPortfolio);
      setNewPortfolio({ name: '', description: '' });
      setShowAddForm(false);
      fetchPortfolios();
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert('Failed to create portfolio');
    }
  };

  const handleDeletePortfolio = async (e, portfolioId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = await getAccessTokenSilently();
      await api.deletePortfolio(token, portfolioId);
      fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Portfolios</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} style={styles.addBtn}>
          {showAddForm ? 'Cancel' : '+ Add Portfolio'}
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAddPortfolio} style={styles.form}>
          <input type="text" placeholder="Name" value={newPortfolio.name} onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})} required style={styles.input} />
          <textarea placeholder="Description" value={newPortfolio.description} onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})} style={styles.textarea} />
          <button type="submit" style={styles.submitBtn}>Create</button>
        </form>
      )}
      <div style={styles.grid}>
        {portfolios.length === 0 ? (
          <div style={styles.empty}><p>No portfolios yet!</p></div>
        ) : (
          portfolios.map(p => (
            <div 
              key={p.id} 
              style={styles.card}
              onClick={() => navigate(`/portfolio/${p.id}`)}
            >
              <h3>{p.name}</h3>
              <p>{p.description || 'No description'}</p>
              <button 
                onClick={(e) => handleDeletePortfolio(e, p.id)} 
                style={styles.del}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' },
  addBtn: { padding: '0.75rem 1.5rem', background: '#0f3460', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px', boxSizing: 'border-box' },
  submitBtn: { padding: '0.75rem 1.5rem', background: '#16c79a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { 
    background: '#fff', 
    padding: '1.5rem', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  del: { padding: '0.5rem 1rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#999' },
  loading: { textAlign: 'center', padding: '3rem' }
};

export default Dashboard;
