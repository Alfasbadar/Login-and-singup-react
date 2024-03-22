import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login,signup } from "../../Database/Database";
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
    if(login(email,password)){
      console.log("Login success")
      navigate('/home/dashboard')
    }
    else{
      console.log("Login error");
    }


  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup clicked")
if(signup(email,password,companyName)){
console.log("Signup success");
navigate('/home/dashboard')
}else{
  console.log("Signup error")
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
