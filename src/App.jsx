import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginSignup from './components/LoginSignup/LoginSignup';
import Home from './components/Home/Home';
import LandingPage from './components/LandingPage/LandingPage';
import { getAuth, onAuthStateChanged } from './config/firebase';

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Render Home if user is authenticated, otherwise render LandingPage */}
        <Route path="/" element={user ? <Home user={user} /> : <LandingPage />} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
        {/* Redirect to LandingPage if user is not authenticated */}
        <Route path="/home/*" element={user ? <Home user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
