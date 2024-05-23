import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import App from './components/App';
import { ServerProvider } from './components/utils/context/server';
import { ThemeProvider } from './components/utils/context/theme';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ServerProvider>
    <ThemeProvider>
      <App/>
    </ThemeProvider>
    </ServerProvider>
  </React.StrictMode>
);

reportWebVitals();
