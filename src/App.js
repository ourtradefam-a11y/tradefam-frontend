import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PortfolioDashboard from './components/PortfolioDashboard';
import PortfolioPage from './components/PortfolioPage';
import PortfolioDetail from './components/PortfolioDetail';
import MacroScenarioSimulator from './components/MacroScenarioSimulator';
import CMCImport from './components/CMCImport';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/portfolio-dashboard" element={isAuthenticated ? <PortfolioDashboard /> : <Navigate to="/" />} />
        <Route path="/portfolio/:id" element={isAuthenticated ? <PortfolioPage /> : <Navigate to="/" />} />
        <Route path="/portfolio/:id/manage" element={isAuthenticated ? <PortfolioDetail /> : <Navigate to="/" />} />
        <Route path="/import" element={isAuthenticated ? <CMCImport /> : <Navigate to="/" />} />
        <Route path="/scenarios" element={isAuthenticated ? <MacroScenarioSimulator /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
