import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../services/api';

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [portfolio, setPortfolio] = useState(null);
  const [positions, setPositions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPositionForm, setShowAddPositionForm] = useState(false);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    quantity: '',
    average_cost: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    type: 'buy',
    symbol: '',
    quantity: '',
    price: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchPortfolio();
    fetchPositions();
    fetchTransactions();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.getPortfolio(token, id);
      setPortfolio(response.data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.getPositions(token, id);
      setPositions(response.data);
    } catch (err) {
      console.error('Error fetching positions:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await api.getTransactions(token, id);
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await api.createPosition(token, id, {
        symbol: newPosition.symbol.toUpperCase(),
        quantity: parseFloat(newPosition.quantity),
        average_cost: parseFloat(newPosition.average_cost)
      });
      setNewPosition({ symbol: '', quantity: '', average_cost: '' });
      setShowAddPositionForm(false);
      fetchPositions();
    } catch (err) {
      console.error('Error creating position:', err);
      alert('Failed to create position');
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await api.createTransaction(token, id, {
        type: newTransaction.type,
        symbol: newTransaction.symbol.toUpperCase(),
        quantity: parseFloat(newTransaction.quantity),
        price: parseFloat(newTransaction.price),
        transaction_date: new Date(newTransaction.transaction_date).toISOString(),
        notes: newTransaction.notes
      });
      setNewTransaction({
        type: 'buy',
        symbol: '',
        quantity: '',
        price: '',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddTransactionForm(false);
      fetchPositions();
      fetchTransactions();
    } catch (err) {
      console.error('Error creating transaction:', err);
      alert(err.response?.data?.detail || 'Failed to create transaction');
    }
  };

  const handleDeletePosition = async (positionId) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    try {
      const token = await getAccessTokenSilently();
      await api.deletePosition(token, id, positionId);
      fetchPositions();
    } catch (err) {
      console.error('Error deleting position:', err);
      alert('Failed to delete position');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const token = await getAccessTokenSilently();
      await api.deleteTransaction(token, id, transactionId);
      fetchPositions();
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction');
    }
  };

  const calculateTotal = () => {
    return positions.reduce((sum, pos) => sum + (pos.quantity * pos.average_cost), 0);
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!portfolio) return <div className="container">Portfolio not found</div>;

  return (
    <div className="container">
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Dashboard
      </button>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>{portfolio.name}</h1>
        {portfolio.description && (
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>
            {portfolio.description}
          </p>
        )}
        <div style={{ 
          display: 'flex', 
          gap: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <div>
            <span style={{ color: '#666', fontSize: '14px' }}>Total Value:</span>
            <strong style={{ marginLeft: '8px', fontSize: '18px', color: '#16c79a' }}>
              {portfolio.currency} {calculateTotal().toFixed(2)}
            </strong>
          </div>
          <div>
            <span style={{ color: '#666', fontSize: '14px' }}>Currency:</span>
            <strong style={{ marginLeft: '8px' }}>{portfolio.currency}</strong>
          </div>
          <div>
            <span style={{ color: '#666', fontSize: '14px' }}>Created:</span>
            <strong style={{ marginLeft: '8px' }}>
              {new Date(portfolio.created_at).toLocaleDateString()}
            </strong>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Positions</h2>
          <button 
            onClick={() => setShowAddPositionForm(!showAddPositionForm)}
            style={{
              padding: '10px 20px',
              background: showAddPositionForm ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showAddPositionForm ? 'Cancel' : '+ Add Position'}
          </button>
        </div>

        {showAddPositionForm && (
          <form onSubmit={handleAddPosition} style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <input
                type="text"
                placeholder="Symbol (e.g., AAPL)"
                value={newPosition.symbol}
                onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Quantity"
                value={newPosition.quantity}
                onChange={(e) => setNewPosition({...newPosition, quantity: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Average Cost"
                value={newPosition.average_cost}
                onChange={(e) => setNewPosition({...newPosition, average_cost: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <button 
              type="submit"
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: '#16c79a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Position
            </button>
          </form>
        )}

        {positions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#999'
          }}>
            <p style={{ fontSize: '18px', margin: 0 }}>
              No positions yet. Click "Add Position" to get started.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Symbol</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Quantity</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Avg Cost</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Total Value</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(pos => (
                <tr key={pos.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{pos.symbol}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{pos.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    {portfolio.currency} {pos.average_cost.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    {portfolio.currency} {(pos.quantity * pos.average_cost).toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <button
                      onClick={() => handleDeletePosition(pos.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#e94560',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Transactions</h2>
          <button 
            onClick={() => setShowAddTransactionForm(!showAddTransactionForm)}
            style={{
              padding: '10px 20px',
              background: showAddTransactionForm ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showAddTransactionForm ? 'Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {showAddTransactionForm && (
          <form onSubmit={handleAddTransaction} style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              <input
                type="text"
                placeholder="Symbol (e.g., AAPL)"
                value={newTransaction.symbol}
                onChange={(e) => setNewTransaction({...newTransaction, symbol: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="number"
                step="0.01"
                placeholder="Quantity"
                value={newTransaction.quantity}
                onChange={(e) => setNewTransaction({...newTransaction, quantity: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newTransaction.price}
                onChange={(e) => setNewTransaction({...newTransaction, price: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input
                type="date"
                value={newTransaction.transaction_date}
                onChange={(e) => setNewTransaction({...newTransaction, transaction_date: e.target.value})}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newTransaction.notes}
              onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '15px' }}
            />
            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#16c79a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Transaction
            </button>
          </form>
        )}

        {transactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#999'
          }}>
            <p style={{ fontSize: '18px', margin: 0 }}>
              No transactions yet. Click "Add Transaction" to get started.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Symbol</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Quantity</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Total</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Notes</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    {new Date(txn.transaction_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: txn.type === 'buy' ? '#d4edda' : '#f8d7da',
                      color: txn.type === 'buy' ? '#155724' : '#721c24'
                    }}>
                      {txn.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{txn.symbol}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{txn.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    {portfolio.currency} {txn.price.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    {portfolio.currency} {txn.total_amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                    {txn.notes || '-'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <button
                      onClick={() => handleDeleteTransaction(txn.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#e94560',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;
