import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';
import App from './components/App';
import { store } from './components/utils/context/store';
import { QueryProvider } from './components/utils/context/query';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <QueryProvider>
      <App/>
    </QueryProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals(undefined);
