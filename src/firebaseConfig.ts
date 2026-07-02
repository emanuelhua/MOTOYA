import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARcx9C0dnxXFcxTQxAkslweg4d-xxh3ik",
  authDomain: "motoya-de6e5.firebaseapp.com",
  projectId: "motoya-de6e5",
  storageBucket: "motoya-de6e5.firebasestorage.app",
  messagingSenderId: "382525303770",
  appId: "1:382525303770:web:cc321e6b520d58e7876ee3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);