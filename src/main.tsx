import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

(async () => {
  if (window.location.origin === 'https://studentloanstudy.uk') {
    const { initializeApp } = await import('firebase/app');
    const { getPerformance } = await import('firebase/performance');
    const { getAnalytics } = await import('firebase/analytics');

    const firebaseConfig = {
      apiKey: 'AIzaSyDR92qhYCm5356Yuwustpl3wTl9n15voUQ',
      authDomain: 'uk-student-loan-study.firebaseapp.com',
      projectId: 'uk-student-loan-study',
      storageBucket: 'uk-student-loan-study.appspot.com',
      messagingSenderId: '941311784665',
      appId: '1:941311784665:web:7329fc946da95d131ff0c8',
      measurementId: 'G-C0MSJCEZVN',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    getPerformance(app);
    getAnalytics(app);
  }
})();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
