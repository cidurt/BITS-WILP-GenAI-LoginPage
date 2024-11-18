import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import './assets/styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="thumbi.us.auth0.com"
    clientId="O9eiiNBqf3GoDVohPJ4utC4t7UM7QIeR"
    authorizationParams={{
      redirect_uri: "http://localhost:3000",
    }}
  >
    <App />
  </Auth0Provider>
);
