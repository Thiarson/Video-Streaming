import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import App from './components/App';
import { QueryProvider } from './components/utils/context/query';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryProvider>
      <App/>
    </QueryProvider>
  </React.StrictMode>
);

reportWebVitals();
