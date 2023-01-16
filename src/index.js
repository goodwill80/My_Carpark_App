import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CarparkContextProvider from './Context/CarparkContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CarparkContextProvider>
    <App />
  </CarparkContextProvider>
);
