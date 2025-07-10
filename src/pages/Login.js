import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem('isAuth', true);
      setIsAuth(true);
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
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