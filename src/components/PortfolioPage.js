import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../services/api';
import PortfolioSummary from './PortfolioSummary';
import PositionCard from './PositionCard';
import './Portfolio.css';

const PortfolioPage = () => {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  
  const [summary, setSummary] = useState(null);
  console.log("Summary data:", summary);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ symbol: '', quantity: '', average_cost: '' });
  const [exchangeRate, setExchangeRate] = useState(1.52); // USD to AUD default

  useEffect(() => {
    fetchSummary();
  }, [id]);

  const fetchSummary = async (refresh = false) => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await api.getPortfolioSummary(token, id, refresh);
      setSummary(response.data);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSummary(true);
    setRefreshing(false);
  };

  const handleCreatePosition = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await api.createPosition(token, id, {
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        average_cost: parseFloat(formData.average_cost)
      });
      setFormData({ symbol: '', quantity: '', average_cost: '' });
      setShowForm(false);
      fetchSummary();
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to create position');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="portfolio-page">
      <PortfolioSummary 
        summary={summary} 
        onRefresh={handleRefresh}
        refreshing={refreshing}
        exchangeRate={exchangeRate}
      />

      <div style={{margin: "20px 0", padding: "15px", background: "white", borderRadius: "8px"}}>
        <label style={{marginRight: "10px", fontWeight: "bold"}}>Exchange Rate (USD to AUD):</label>
        <input 
          type="number" 
          step="0.01" 
          value={exchangeRate} 
          onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1.52)} 
          style={{padding: "8px", border: "1px solid #ddd", borderRadius: "4px", width: "100px"}} 
        />
        <span style={{marginLeft: "10px", color: "#6c757d"}}>$1 USD = ${exchangeRate} AUD</span>
      </div>

      <div style={{margin: '20px 0'}}>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={{padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
        >
          {showForm ? '✕ Cancel' : '+ Add Position'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePosition} style={{marginBottom: '20px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0}}>Add New Position</h3>
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            <input type="text" placeholder="Symbol (e.g. AAPL)" value={formData.symbol} onChange={(e) => setFormData({...formData, symbol: e.target.value})} required style={{padding: '10px', flex: '1', minWidth: '150px', border: '1px solid #ddd', borderRadius: '4px'}} />
            <input type="number" step="0.01" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required style={{padding: '10px', flex: '1', minWidth: '100px', border: '1px solid #ddd', borderRadius: '4px'}} />
            <input type="number" step="0.01" placeholder="Avg Cost ($)" value={formData.average_cost} onChange={(e) => setFormData({...formData, average_cost: e.target.value})} required style={{padding: '10px', flex: '1', minWidth: '100px', border: '1px solid #ddd', borderRadius: '4px'}} />
            <button type="submit" style={{padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Create Position</button>
          </div>
        </form>
      )}
      
      <div className="positions-list">
        <h2>Positions</h2>
        <p>Debug: Found {summary?.positions?.length || 0} positions</p>
        <div className="positions-grid">
          {summary?.positions.map(position => (
            <PositionCard key={position.id} position={position} exchangeRate={exchangeRate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
