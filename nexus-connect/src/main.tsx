import ReactDOM from 'react-dom/client';
import React from 'react';
import App from '@/app';

import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
