import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDO4l5IerJN1nYmGAVeWYO3xPGMCcT1Gtk",
    authDomain: "iammail-a2c4d.firebaseapp.com",
    projectId: "iammail-a2c4d",
    storageBucket: "iammail-a2c4d.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth helpers
export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

export const onAuthChange = (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
};
