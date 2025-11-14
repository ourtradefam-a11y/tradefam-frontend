import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  DollarSign,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PortfolioDashboard = () => {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 26139,
    dayChange: 342,
    dayChangePercent: 1.32,
    totalPnL: 2145,
    totalPnLPercent: 8.94,
    holdings: [],
    alerts: [],
    lastUpdated: new Date()
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Mock data for initial display
  const mockHoldings = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', shares: 45, price: 142.50, marketValue: 6412.50, dayChange: 2.3, totalPnL: 890.25, totalPnLPercent: 16.12, sector: 'Technology', country: 'US' },
    { symbol: 'META', name: 'Meta Platforms', shares: 12, price: 510.25, marketValue: 6123.00, dayChange: -0.8, totalPnL: -124.50, totalPnLPercent: -1.99, sector: 'Technology', country: 'US' },
    { symbol: 'AMZN', name: 'Amazon.com', shares: 35, price: 145.80, marketValue: 5103.00, dayChange: 1.5, totalPnL: 456.78, totalPnLPercent: 9.83, sector: 'Consumer', country: 'US' },
    { symbol: 'LYC', name: 'Lynas Rare Earths', shares: 850, price: 6.45, marketValue: 5482.50, dayChange: -1.2, totalPnL: 234.50, totalPnLPercent: 4.47, sector: 'Materials', country: 'AU' },
    { symbol: 'PDN', name: 'Paladin Energy', shares: 450, price: 8.20, marketValue: 3690.00, dayChange: 3.8, totalPnL: 567.00, totalPnLPercent: 18.17, sector: 'Energy', country: 'AU' },
  ];

  const mockAlerts = [
    { id: 1, type: 'warning', symbol: 'LYC', message: 'RSI Oversold (28.5) - Consider buying opportunity', severity: 'medium', timestamp: new Date() },
    { id: 2, type: 'danger', symbol: 'META', message: 'Stop-loss triggered at $485. Position closed.', severity: 'high', timestamp: new Date() },
    { id: 3, type: 'info', symbol: 'NVDA', message: 'Volume spike detected (+145% above average)', severity: 'low', timestamp: new Date() },
  ];

  useEffect(() => {
    fetchPortfolioData();
    const interval = setInterval(fetchPortfolioData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/portfolio`);
      
      // Using mock data for now
      setTimeout(() => {
        setPortfolioData({
          ...portfolioData,
          holdings: mockHoldings,
          alerts: mockAlerts,
          lastUpdated: new Date()
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedHoldings = React.useMemo(() => {
    let sortableHoldings = [...portfolioData.holdings];
    if (sortConfig.key) {
      sortableHoldings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableHoldings;
  }, [portfolioData.holdings, sortConfig]);

  const dismissAlert = (alertId) => {
    setDismissedAlerts(new Set([...dismissedAlerts, alertId]));
  };

  const visibleAlerts = portfolioData.alerts.filter(alert => !dismissedAlerts.has(alert.id));

  // Calculate geographic allocation
  const geoAllocation = portfolioData.holdings.reduce((acc, holding) => {
    const country = holding.country || 'Unknown';
    acc[country] = (acc[country] || 0) + holding.marketValue;
    return acc;
  }, {});

  const geoData = Object.entries(geoAllocation).map(([country, value]) => ({
    name: country === 'US' ? '🇺🇸 United States' : country === 'AU' ? '🇦🇺 Australia' : country,
    value: value,
    percentage: ((value / portfolioData.totalValue) * 100).toFixed(1)
  }));

  // Calculate sector allocation
  const sectorAllocation = portfolioData.holdings.reduce((acc, holding) => {
    const sector = holding.sector || 'Other';
    acc[sector] = (acc[sector] || 0) + holding.marketValue;
    return acc;
  }, {});

  const sectorData = Object.entries(sectorAllocation).map(([sector, value]) => ({
    name: sector,
    value: value,
    percentage: ((value / portfolioData.totalValue) * 100).toFixed(1)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading && portfolioData.holdings.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {portfolioData.lastUpdated.toLocaleTimeString()}
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
          </p>
        </div>
        <button 
          onClick={fetchPortfolioData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-6 bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(portfolioData.totalValue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className={`p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          portfolioData.dayChange >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Change</p>
              <p className={`text-3xl font-bold mt-2 flex items-center gap-2 ${
                portfolioData.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioData.dayChange >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                {formatCurrency(Math.abs(portfolioData.dayChange))}
              </p>
              <p className={`text-sm font-semibold mt-1 ${
                portfolioData.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(portfolioData.dayChangePercent)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              portfolioData.dayChange >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {portfolioData.dayChange >= 0 ? 
                <TrendingUp className="w-8 h-8 text-green-600" /> : 
                <TrendingDown className="w-8 h-8 text-red-600" />
              }
            </div>
          </div>
        </Card>

        <Card className={`p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          portfolioData.totalPnL >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total P&L</p>
              <p className={`text-3xl font-bold mt-2 flex items-center gap-2 ${
                portfolioData.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {portfolioData.totalPnL >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {formatCurrency(Math.abs(portfolioData.totalPnL))}
              </p>
              <p className={`text-sm font-semibold mt-1 ${
                portfolioData.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {formatPercent(portfolioData.totalPnLPercent)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              portfolioData.totalPnL >= 0 ? 'bg-emerald-100' : 'bg-rose-100'
            }`}>
              <Activity className={`w-8 h-8 ${
                portfolioData.totalPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`} />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Active Alerts</h2>
          </div>
          <div className="space-y-2">
            {visibleAlerts.map(alert => (
              <Alert 
                key={alert.id}
                className={`border-l-4 shadow-md hover:shadow-lg transition-all ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-900">{alert.symbol}</p>
                      <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Allocation */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Geographic Allocation</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={geoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percentage}) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {geoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Sector Allocation */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sector Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="p-6 bg-white shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th 
                  className="text-left p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('symbol')}
                >
                  <span className="font-semibold text-gray-700">Symbol</span>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700 hidden md:table-cell">Name</th>
                <th 
                  className="text-right p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('shares')}
                >
                  <span className="font-semibold text-gray-700">Shares</span>
                </th>
                <th 
                  className="text-right p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <span className="font-semibold text-gray-700">Price</span>
                </th>
                <th 
                  className="text-right p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('marketValue')}
                >
                  <span className="font-semibold text-gray-700">Value</span>
                </th>
                <th 
                  className="text-right p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('dayChange')}
                >
                  <span className="font-semibold text-gray-700">Day</span>
                </th>
                <th 
                  className="text-right p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort('totalPnLPercent')}
                >
                  <span className="font-semibold text-gray-700">Total P&L</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((holding, index) => (
                <tr 
                  key={holding.symbol}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{holding.symbol}</span>
                      <span className="text-xs text-gray-500">{holding.country === 'US' ? '🇺🇸' : '🇦🇺'}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 text-sm hidden md:table-cell">{holding.name}</td>
                  <td className="p-3 text-right text-gray-900">{holding.shares.toLocaleString()}</td>
                  <td className="p-3 text-right text-gray-900">{formatCurrency(holding.price)}</td>
                  <td className="p-3 text-right font-semibold text-gray-900">{formatCurrency(holding.marketValue)}</td>
                  <td className={`p-3 text-right font-semibold flex items-center justify-end gap-1 ${
                    holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {holding.dayChange >= 0 ? '▲' : '▼'}
                    {formatPercent(Math.abs(holding.dayChange))}
                  </td>
                  <td className="p-3 text-right">
                    <div className={`font-semibold ${
                      holding.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(holding.totalPnL))}
                    </div>
                    <div className={`text-xs ${
                      holding.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(holding.totalPnLPercent)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;
