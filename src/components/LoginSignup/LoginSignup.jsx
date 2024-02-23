import React, { useState } from 'react';
import { getFirestore, collection, getDocs,getDoc,setDoc,doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [branches, setBranches] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCompanyFields, setShowCompanyFields] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email cannot be empty');
      return;
    }

    if (!password) {
      setPasswordError('Password cannot be empty');
      return;
    }

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      navigate('/home', { Email:email });
    } catch (error) {
      if (error) {
        console.log('User does not exist. Signup');
        setShowCompanyFields(true);
      } else {
        console.error('Error signing in:', error.message);
      }
    }
  };


  const createAccount = async () => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created successfully!');
  
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const userDocRef = doc(usersCollection, email);
      await setDoc(userDocRef, {
        companyName: companyName,
        branches: branches
      });

      console.log('Data stored in database');
      getUserByEmail(email).then((user) => {
        if (user) {
          console.log('User found:', user);
          navigate('/home', { state: { user } });
        } else {
          console.log('User not found');
        }
      });
      
    } catch (error) {
      console.error('Error creating account:', error.message);
    }
  };
  
  const getUserByEmail = async (email) => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const userDocRef = doc(usersCollection, email); // Use the email as the document ID
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        return { id: userDocSnapshot.id, ...userDocSnapshot.data() };
      } else {
        console.log('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
  };
  

  

  
  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
      />
      <div className="error-message">{emailError}</div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {showCompanyFields && (
        <>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />
          <input
            type="number"
            value={branches}
            onChange={(e) => setBranches(e.target.value)}
            placeholder="Number of Branches"
          />
        </>
      )}
      <div className="error-message">{passwordError}</div>
      <button onClick={showCompanyFields ? createAccount : handleLogin}>Go</button>
    </div>
  );
}

export default Login;
