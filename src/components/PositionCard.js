import React from 'react';

const formatDual = (usd, rate) => `$${usd.toFixed(2)} USD ($${(usd * rate).toFixed(2)} AUD)`;
const PositionCard = ({ position, exchangeRate = 1.52 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatPercent = (percent) => {
    if (!percent) return 'N/A';
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="position-card">
      <div className="position-header">
        <h3>{position.symbol}</h3>
        {position.current_price && (
          <span className="price">{formatDual(position.current_price, exchangeRate)}</span>
        )}
      </div>

      <div className="position-info">
        <p>Shares: {position.quantity}</p>
        <p>Avg Cost: {formatDual(position.average_cost, exchangeRate)}</p>
        <p>Cost Basis: {formatDual(position.cost_basis, exchangeRate)}</p>
        
        {position.market_value && (
          <>
            <p>Market Value: {formatDual(position.market_value, exchangeRate)}</p>
            <p className={position.unrealized_gain >= 0 ? 'gain-positive' : 'gain-negative'}>
              Gain: {formatDual(position.unrealized_gain, exchangeRate)} ({formatPercent(position.unrealized_gain_percent)})
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PositionCard;
