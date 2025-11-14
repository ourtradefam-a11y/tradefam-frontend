import React from 'react';
const formatDual = (usd, rate) => `$${usd.toFixed(2)} USD ($${(usd * rate).toFixed(2)} AUD)`;

const PortfolioSummary = ({ summary, onRefresh, refreshing, exchangeRate }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatPercent = (percent) => {
    if (percent === null || percent === undefined) return 'N/A';
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getGainClass = (gain) => {
    if (!gain) return '';
    return gain >= 0 ? 'positive' : 'negative';
  };

  if (!summary) return null;

  return (
    <div className="summary-section">
      <div className="summary-header">
        <h2>{summary.portfolio_name}</h2>
        <button onClick={onRefresh} disabled={refreshing}>
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Prices'}
        </button>
      </div>

      <div className="summary-stats">
        <div className="stat">
          <label>Total Value</label>
          <h3>{formatDual(summary.total_market_value, exchangeRate)}</h3>
        </div>
        <div className="stat">
          <label>Cost Basis</label>
          <p>{formatDual(summary.total_cost_basis, exchangeRate)}</p>
        </div>
        <div className={`stat gain ${getGainClass(summary.total_unrealized_gain)}`}>
          <label>Total Gain/Loss</label>
          <h3>{formatDual(summary.total_unrealized_gain, exchangeRate)}</h3>
          <p>{formatPercent(summary.total_unrealized_gain_percent)}</p>
        </div>
        <div className="stat">
          <label>Positions</label>
          <p>{summary.total_positions}</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
