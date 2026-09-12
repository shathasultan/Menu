import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC-edK5Kp2G032Fjm53aZvTQ9LeHMv7I9c',
  authDomain: 'menu-app-33cd1.firebaseapp.com',
  projectId: 'menu-app-33cd1',
  storageBucket: 'menu-app-33cd1.firebasestorage.app',
  messagingSenderId: '593200334137',
  appId: '1:593200334137:web:8234b89b51280bf72654e8',
};

export const GOOGLE_WEB_CLIENT_ID =
  '593200334137-74128cuhafkiva62e9iojll25onul6h2.apps.googleusercontent.com';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };
export const db = getFirestore(app);
