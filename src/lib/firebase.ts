import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBjddjB_aupnZBLRZdnO6tNfKC_WkYjTZ8',
  authDomain: 'student-loan-study.firebaseapp.com',
  projectId: 'student-loan-study',
  storageBucket: 'student-loan-study.appspot.com',
  messagingSenderId: '917088176108',
  appId: '1:917088176108:web:7f3a3dd65b7ad82b0f91a9',
  measurementId: 'G-Q9RWYBBTKV',
};

export function initFirebase() {
  if (typeof window === 'undefined') return;
  if (window.location.origin !== 'https://studentloanstudy.uk') return;
  if (getApps().length > 0) return;

  const app = initializeApp(firebaseConfig);
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}
