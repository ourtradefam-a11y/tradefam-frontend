import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PortfolioDashboard from './components/PortfolioDashboard';
import MacroScenarioSimulator from './components/MacroScenarioSimulator';
import CMCImport from './components/CMCImport';
import PortfolioDetail from './components/PortfolioDetail';
import PortfolioPage from './components/PortfolioPage';
import Navigation from './components/Navigation';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <Router>
      <div className="App">
        <Navigation />
       <Routes>
  {/* New Portfolio Dashboard Routes */}
  <Route path="/portfolio-dashboard" element={
    isAuthenticated ? <PortfolioDashboard /> : <Navigate to="/" />
  } />
<Route path="/import" element={
  isAuthenticated ? <CMCImport /> : <Navigate to="/" />
} />
  <Route path="/scenarios" element={
    isAuthenticated ? <MacroScenarioSimulator /> : <Navigate to="/" />
  } />
  
  {/* Existing Routes */}
  <Route path="/" element={
    isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
  } />
  <Route path="/dashboard" element={
    isAuthenticated ? <Dashboard /> : <Navigate to="/" />
  } />
  <Route path="/portfolio/:id" element={
    isAuthenticated ? <PortfolioPage /> : <Navigate to="/" />
  } />
  <Route path="/portfolio/:id/manage" element={
    isAuthenticated ? <PortfolioDetail /> : <Navigate to="/" />
  } />
</Routes>
     </div>
    </Router>
  );
}

export default App;
