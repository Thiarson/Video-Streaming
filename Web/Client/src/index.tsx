import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import App from './components/App';
import context from './components/utils/context';

import './index.css'

const serverData = {
  protocol: window.location.protocol,
  hostname: window.location.hostname,
  port: window.location.port,
}

const { ServerContext } = context
let serverUrl = `${serverData.protocol}//${serverData.hostname}:${serverData.port}`

if (serverUrl === "http://localhost:3000")
  serverUrl = "https://localhost:8080"

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ServerContext.Provider value={serverUrl}>
      <App/> 
    </ServerContext.Provider>
  </React.StrictMode>
);

reportWebVitals();
