import React, { useState } from "react";
import { getFirestore, collection, getDoc, setDoc, doc,addDoc,deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import "./LoginSignup.css";

function LoginSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSignupClick = () => {
    document.querySelector("form.login").style.marginLeft = "-50%";
    document.querySelector(".title-text .login").style.marginLeft = "-50%";
  };

  const handleLoginClick = () => {
    document.querySelector("form.login").style.marginLeft = "0%";
    document.querySelector(".title-text .login").style.marginLeft = "0%";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

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
      navigate('/home', { state: { email } });
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created successfully!');
  
      const db = getFirestore();

      // Create users collection if not exist
      const usersCollection = collection(db, 'users');
  
      // Create user document with email as ID
      const userDocRef = doc(usersCollection, email);
      await setDoc(userDocRef, {});
  
      // Create Personal collection with company name
      const personalsCollectionRef = collection(userDocRef, 'Personal');
      await setDoc(doc(personalsCollectionRef, 'info'), {
        companyName: companyName,
      });
  
      // Create other collections
      const collections = ['Products', 'Distribution', 'Inventory', 'Stores', 'Orders', 'Customers', 'Others'];
      for (const collectionName of collections) {
        const collectionRef = collection(userDocRef, collectionName);
        await addDoc(collectionRef, { dummy: true }); // Add a dummy document to create the collection
      }
  
  
      console.log('Data stored in database');
      navigate('/home', { state: { email } });
    } catch (error) {
      console.error('Error creating account:', error.message);
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title-text">
          <div className="title login">{}</div>
          <div className="title signup">{}</div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" defaultChecked />
            <input type="radio" name="slide" id="signup" />
            <label htmlFor="login" className="slide login" onClick={handleLoginClick}>
              Login
            </label>
            <label htmlFor="signup" className="slide signup" onClick={handleSignupClick}>
              Signup
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form action="#" className="login" onSubmit={handleLogin}>
              <div className="field">
                <input type="text" placeholder="Email Address" required onChange={(e) => setEmail(e.target.value)} />
                <span className="error">{emailError}</span>
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                <span className="error">{passwordError}</span>
              </div>
              <div className="pass-link">
                <a href="#">Forgot password?</a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
            </form>
            <form action="#" className="signup" onSubmit={handleSignup}>
              <div className="field">
                <input type="text" placeholder="Email Address" required onChange={(e) => setEmail(e.target.value)} />
                <span className="error">{emailError}</span>
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                <span className="error">{passwordError}</span>
              </div>
              <div className="field">
                <input type="password" placeholder="Confirm password" required onChange={(e) => setResetPassword(e.target.value)} />
              </div>
              <div className="field">
                <input type="text" placeholder="Company Name" required onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
