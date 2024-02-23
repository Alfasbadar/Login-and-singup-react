import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/LoginSignup');
  };

  return (
    <div style={styles.container}>
      <button onClick={handleClick}>Go to Login/Signup</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Set height to full viewport height
  },
};

export default LandingPage;
