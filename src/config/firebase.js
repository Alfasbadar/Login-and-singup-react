import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDKkDFGQpbDVpXKXnkvh80_dVC5Fogw9X8",
  authDomain: "inventory-management-ce97e.firebaseapp.com",
  projectId: "inventory-management-ce97e",
  storageBucket: "inventory-management-ce97e.appspot.com",
  messagingSenderId: "101037199273",
  appId: "1:101037199273:web:98e8c4329e5fd9b411feb8"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export { app, getAuth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut};