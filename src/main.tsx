import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import App from './components/App';

const firebaseConfig = {
  apiKey: 'AIzaSyDR92qhYCm5356Yuwustpl3wTl9n15voUQ',
  authDomain: 'uk-student-loan-study.firebaseapp.com',
  projectId: 'uk-student-loan-study',
  storageBucket: 'uk-student-loan-study.appspot.com',
  messagingSenderId: '941311784665',
  appId: '1:941311784665:web:7329fc946da95d131ff0c8',
  measurementId: 'G-C0MSJCEZVN',
};
const app = initializeApp(firebaseConfig);
getAnalytics(app);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
