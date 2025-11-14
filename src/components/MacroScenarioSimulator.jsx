import React, { useState } from 'react';
import { Card } from './ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Zap,
  DollarSign,
  Globe,
  Activity,
  BarChart3,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const MacroScenarioSimulator = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Current portfolio baseline
  const baselinePortfolio = {
    totalValue: 26139,
    holdings: [
      { symbol: 'NVDA', value: 6412.50, weight: 24.5, sector: 'Technology', country: 'US' },
      { symbol: 'META', value: 6123.00, weight: 23.4, sector: 'Technology', country: 'US' },
      { symbol: 'AMZN', value: 5103.00, weight: 19.5, sector: 'Consumer', country: 'US' },
      { symbol: 'LYC', value: 5482.50, weight: 21.0, sector: 'Materials', country: 'AU' },
      { symbol: 'PDN', value: 3690.00, weight: 14.1, sector: 'Energy', country: 'AU' },
    ]
  };

  // Predefined macro scenarios
  const scenarios = [
    {
      id: 'ai-rally',
      name: 'AI Tech Rally',
      description: 'Continued AI enthusiasm drives tech stocks higher',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      bgLight: 'bg-blue-50',
      impacts: {
        'NVDA': 15,
        'META': 12,
        'AMZN': 8,
        'LYC': -2,
        'PDN': 0
      },
      macroFactors: [
        { factor: 'Tech Sector', change: '+15%' },
        { factor: 'AI Spending', change: '+30%' },
        { factor: 'USD Strength', change: '+2%' }
      ]
    },
    {
      id: 'rba-cuts',
      name: 'RBA Rate Cuts',
      description: 'RBA cuts rates by 50bps, boosting AU stocks',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      bgLight: 'bg-green-50',
      impacts: {
        'NVDA': 2,
        'META': 1,
        'AMZN': 3,
        'LYC': 18,
        'PDN': 22
      },
      macroFactors: [
        { factor: 'RBA Cash Rate', change: '-50bps' },
        { factor: 'AUD/USD', change: '-3%' },
        { factor: 'AU Resources', change: '+18%' }
      ]
    },
    {
      id: 'china-slowdown',
      name: 'China Slowdown',
      description: 'Chinese economic data disappoints, hurting commodities',
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      bgLight: 'bg-red-50',
      impacts: {
        'NVDA': -5,
        'META': -3,
        'AMZN': -8,
        'LYC': -25,
        'PDN': -18
      },
      macroFactors: [
        { factor: 'China GDP', change: '-2%' },
        { factor: 'Rare Earths Demand', change: '-30%' },
        { factor: 'Commodities Index', change: '-15%' }
      ]
    },
    {
      id: 'inflation-spike',
      name: 'Inflation Spike',
      description: 'Unexpected inflation surge leads to hawkish central banks',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      bgLight: 'bg-orange-50',
      impacts: {
        'NVDA': -12,
        'META': -10,
        'AMZN': -15,
        'LYC': 8,
        'PDN': 12
      },
      macroFactors: [
        { factor: 'US CPI', change: '+1.5%' },
        { factor: 'Fed Funds Rate', change: '+100bps' },
        { factor: 'Real Assets', change: '+10%' }
      ]
    },
    {
      id: 'tech-rotation',
      name: 'Tech Rotation',
      description: 'Market rotates from growth to value stocks',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      bgLight: 'bg-purple-50',
      impacts: {
        'NVDA': -8,
        'META': -12,
        'AMZN': -10,
        'LYC': 15,
        'PDN': 18
      },
      macroFactors: [
        { factor: 'Growth Stocks', change: '-10%' },
        { factor: 'Value Stocks', change: '+15%' },
        { factor: 'Market Breadth', change: 'Improving' }
      ]
    },
    {
      id: 'geopolitical-risk',
      name: 'Geopolitical Risk',
      description: 'Rising tensions increase market volatility',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-yellow-600',
      borderColor: 'border-yellow-600',
      bgLight: 'bg-yellow-50',
      impacts: {
        'NVDA': -6,
        'META': -8,
        'AMZN': -7,
        'LYC': -10,
        'PDN': 15
      },
      macroFactors: [
        { factor: 'VIX Index', change: '+45%' },
        { factor: 'Defense/Energy', change: '+12%' },
        { factor: 'Safe Havens', change: '+8%' }
      ]
    }
  ];

  const runSimulation = (scenario) => {
    setLoading(true);
    setSelectedScenario(scenario);

    setTimeout(() => {
      const results = baselinePortfolio.holdings.map(holding => {
        const impact = scenario.impacts[holding.symbol] || 0;
        const newValue = holding.value * (1 + impact / 100);
        const absoluteChange = newValue - holding.value;
        
        return {
          ...holding,
          impact: impact,
          newValue: newValue,
          absoluteChange: absoluteChange,
          percentChange: impact
        };
      });

      const totalChange = results.reduce((sum, h) => sum + h.absoluteChange, 0);
      const newTotalValue = baselinePortfolio.totalValue + totalChange;
      const totalPercentChange = (totalChange / baselinePortfolio.totalValue) * 100;

      setSimulationResults({
        holdings: results,
        totalChange: totalChange,
        newTotalValue: newTotalValue,
        totalPercentChange: totalPercentChange
      });
      setLoading(false);
    }, 800);
  };

  const resetSimulation = () => {
    setSelectedScenario(null);
    setSimulationResults(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Prepare chart data
  const getComparisonData = () => {
    if (!simulationResults) return [];
    
    return simulationResults.holdings.map(h => ({
      symbol: h.symbol,
      current: h.value,
      projected: h.newValue,
      change: h.absoluteChange
    }));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Macro Scenario Simulator</h1>
          <p className="text-sm text-gray-600 mt-1">
            Test how your portfolio performs under different market conditions
          </p>
        </div>
        {selectedScenario && (
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Current Portfolio Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Current Portfolio Value</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(baselinePortfolio.totalValue)}</p>
            <p className="text-sm text-blue-100 mt-2">Ready for scenario testing</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <BarChart3 className="w-12 h-12" />
          </div>
        </div>
      </Card>

      {!selectedScenario ? (
        // Scenario Selection Grid
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select a Scenario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <Card
                key={scenario.id}
                className={`p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${scenario.borderColor} ${scenario.bgLight}`}
                onClick={() => runSimulation(scenario)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${scenario.color} text-white`}>
                    {scenario.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{scenario.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    
                    <div className="mt-4 space-y-1">
                      <p className="text-xs font-semibold text-gray-700">Key Factors:</p>
                      {scenario.macroFactors.map((factor, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-600">
                          <span>{factor.factor}</span>
                          <span className="font-semibold">{factor.change}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-end text-sm font-semibold text-gray-700">
                      Run Simulation <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : loading ? (
        // Loading State
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Activity className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            <p className="text-lg font-semibold text-gray-700 mt-4">Running simulation...</p>
          </div>
        </div>
      ) : (
        // Results Display
        <div className="space-y-6">
          {/* Scenario Header */}
          <Card className={`p-6 border-2 ${selectedScenario.borderColor} ${selectedScenario.bgLight}`}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${selectedScenario.color} text-white`}>
                {selectedScenario.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedScenario.name}</h2>
                <p className="text-gray-600 mt-1">{selectedScenario.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {selectedScenario.macroFactors.map((factor, idx) => (
                <div key={idx} className="bg-white/80 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">{factor.factor}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{factor.change}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Impact Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white border-2 border-gray-200 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(baselinePortfolio.totalValue)}
              </p>
            </Card>

            <Card className={`p-6 border-2 shadow-lg ${
              simulationResults.totalChange >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <p className="text-sm font-medium text-gray-600">Projected Change</p>
              <p className={`text-3xl font-bold mt-2 flex items-center gap-2 ${
                simulationResults.totalChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {simulationResults.totalChange >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {formatCurrency(Math.abs(simulationResults.totalChange))}
              </p>
              <p className={`text-sm font-semibold mt-1 ${
                simulationResults.totalChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(simulationResults.totalPercentChange)}
              </p>
            </Card>

            <Card className="p-6 bg-blue-50 border-2 border-blue-200 shadow-lg">
              <p className="text-sm font-medium text-gray-600">Projected Value</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatCurrency(simulationResults.newTotalValue)}
              </p>
            </Card>
          </div>

          {/* Comparison Chart */}
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '2px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="current" fill="#94a3b8" name="Current Value" />
                <Bar dataKey="projected" fill="#3b82f6" name="Projected Value" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Detailed Holdings Impact */}
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Individual Holdings Impact</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Symbol</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Current Value</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Impact</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Projected Value</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationResults.holdings.map(holding => (
                    <tr key={holding.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{holding.symbol}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{holding.sector}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right text-gray-900">{formatCurrency(holding.value)}</td>
                      <td className={`p-3 text-right font-semibold ${
                        holding.impact >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercent(holding.impact)}
                      </td>
                      <td className="p-3 text-right font-semibold text-blue-600">
                        {formatCurrency(holding.newValue)}
                      </td>
                      <td className={`p-3 text-right font-bold ${
                        holding.absoluteChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {holding.absoluteChange >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(holding.absoluteChange))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={resetSimulation}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Try Another Scenario
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MacroScenarioSimulator;
