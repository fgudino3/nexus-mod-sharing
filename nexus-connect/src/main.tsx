import ReactDOM from 'react-dom/client';
import React from 'react';
import App from '@/app';

import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';
import 'simplebar-react/dist/simplebar.min.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // TODO: uncomment
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
