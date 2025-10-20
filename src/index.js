import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="ourtradefam.au.auth0.com"
      clientId="2H7BTZfBOoQsmQ667uKaKmik8X4gKTNA"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://api.tradefam.app"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
