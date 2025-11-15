import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Navigation() {
  const { user, logout } = useAuth0();

  return (
    <div className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-white">TradeFam</h1>
            <div className="flex space-x-6">
              <Link 
                to="/dashboard" 
                className="text-white hover:text-blue-400 font-medium px-3 py-2 rounded"
              >
                Dashboard
              </Link>
              <Link 
                to="/import" 
                className="text-white hover:text-blue-400 font-medium px-3 py-2 rounded"
              >
                Import CSV
              </Link>
              <Link 
                to="/scenarios" 
                className="text-white hover:text-blue-400 font-medium px-3 py-2 rounded"
              >
                Scenarios
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">{user?.name || 'Julia TRADEFAM'}</span>
            <button 
              onClick={() => logout({ returnTo: window.location.origin })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
