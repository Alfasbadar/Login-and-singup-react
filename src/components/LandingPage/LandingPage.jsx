import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from './../../images/logo.png';
import decimalImg from './../../images/decimal.png';
import customChargeImg from './../../images/customcharges.png';
import robustImg from './../../images/robust.png';
import storefrontImg from './../../images/storefront.png';

const LandingPage = () => {
  return (
    <div>
      <section className="landing-section">
        <div className="landing-circle"></div>
        <header>
          <a href="#"><img src={logo} className="logo" alt="Logo" /></a>
        </header>
        <div className="landing-container">
          <div className="landing-text-box">
            <h2><span>Stockdash</span> <br/>A Perfect Inventory <br/> Manager<br /> for Your <br/> Business <br/> </h2>
            <p>Track your commodities from distributors to store fronts through your inventories</p>
            <Link to="/LoginSignup" className="learn-more">Get Started</Link>
          </div>
          <div className="landing-img-box">
          </div>
        </div>
      </section>

      <section className="features-section">
        <h1>Features</h1>
        <p className="features-description">Our inventory management system offers a variety of features designed to help you track and manage your inventory efficiently.</p>
        <div className="features-container">
          <div className="features-section-card">
            <img src={decimalImg} alt="Decimal Quantity Support" />
            <h3>Decimal Units</h3>
            <p>Loose purchase and sales in quantities for precise inventory management.</p>
          </div>
          <div className="features-section-card">
            <img src={customChargeImg} alt="Custom Charges and Immediate Changes" />
            <h3>Custom Charges & Immediate Changes</h3>
            <p>Set custom charges and Immediate changes in bills</p>
          </div>
          <div className="features-section-card">
            <img src={robustImg} alt="Robust Inventory Management System" />
            <h3>Robust Inventory System</h3>
            <p>Properly track commoities from distributor to your inventories and store fronts.</p>
          </div>
          <div className="features-section-card">
            <img src={storefrontImg} alt="Store Fronts and POS" />
            <h3>POS & Customers</h3>
            <p>Integrated with Point of Sale systems for seamless customer transactions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
