import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Navigation() {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          <Link to="/import" className="hover:text-blue-300">Import CSV</Link>
          <Link to="/scenarios" className="hover:text-blue-300">Scenarios</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span>{user?.name}</span>
          <button 
            onClick={() => logout({ returnTo: window.location.origin })}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
