import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'
import logo from './../../images/logo.png'

const LandingPage = () => {
  const imgSlider = (imageSrc) => {
    document.querySelector('.starbucks').src = `./images/${imageSrc}`;
  };

  const changeCircleColor = (color) => {
    document.querySelector('.circle').style.background = color;
  };

  return (
    <section>
      <div className="landing-circle"></div>
      <header>
        <a href="#"><img src={logo} className="logo" alt="Logo" /></a>
        {/* <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#">What's New</a></li>
          <li><a href="#">Contact</a></li>
        </ul> */}
      </header>
      <div className="landing-container">
        <div className="landing-text-box">
          <h2>Simple & Powerful <br />Inventory Management System <span>Stockdash</span></h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor modi consequatur nulla, fugit odit rerum quaerat illo at! Nihil velit tempore debitis. Doloribus quasi perspiciatis fuga nulla aspernatur necessitatibus adipisci.</p>
          <Link to="/LoginSignup" className="learn-more">Get Started</Link>
        </div>
        <div className="landing-img-box">
          <img src={logo} className="starbucks" alt="Starbucks Coffee" />
        </div>
      </div>
      {/* <ul className="landing-thumb">
        <li><img src="./images/thumb1.png" onClick={() => { imgSlider('img1.png'); changeCircleColor('#017143'); }} alt="Thumb 1" /></li>
        <li><img src="./images/thumb2.png" onClick={() => { imgSlider('img2.png'); changeCircleColor('#0eb7495'); }} alt="Thumb 2" /></li>
        <li><img src="./images/thumb3.png" onClick={() => { imgSlider('img3.png'); changeCircleColor('#d752b1'); }} alt="Thumb 3" /></li>
      </ul> */}
      {/* <ul className="social">
        <li><a href="#"><img src="./images/facebook.png" alt="Facebook" /></a></li>
        <li><a href="#"><img src="./images/instagram.png" alt="Instagram" /></a></li>
        <li><a href="#"><img src="./images/twitter.png" alt="Twitter" /></a></li>
      </ul> */}
    </section>
  );
};

export default LandingPage;
