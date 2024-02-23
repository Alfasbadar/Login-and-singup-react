import React from 'react';
import { getAuth, signOut } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate(); // Using useNavigate for navigation

  const handleLogoutClick = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/home'); // Navigate to home page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      <h2>About Page</h2>
      <p>This is the about page content.</p>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default About;
