import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    console.log("Initiating Google Sign-In popup");
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result.user);
        localStorage.setItem('isAuth', true);
        navigate('/createpost');
      })
      .catch((error) => {
        console.error('Popup login error:', error.message, error.code);
      });
  };

  return (
    <div className="loginPage">
      <div className="loginContent">
        <h1>Welcome to TechBit</h1>
        <h2>Share Your Tech Insights</h2>
        <button className="get-started-btn" onClick={signInWithGoogle}>
          Get Started
        </button>
        <p className="tagline">Join our community to post and explore tech blogs!</p>
      </div>
    </div>
  );
}

export default Login;