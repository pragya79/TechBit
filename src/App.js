import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';

function App() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log("User from onAuthStateChanged:", user);
    if (user) {
      setIsAuth(true);
      localStorage.setItem('isAuth', true);
    } else {
      setIsAuth(false);
      localStorage.setItem('isAuth', false); // Use setItem instead of removeItem
    }
  });

  return () => unsubscribe();
}, []);

  const signUserOut = () => {
    signOut(auth).then(() => {
      setIsAuth(false);
      localStorage.clear();
      navigate('/login');
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">
            <Link to="/">TechBit</Link>
          </div>
          <button className="hamburger" onClick={toggleMenu}>
            <span className="hamburger-icon">☰</span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {!isAuth ? (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            ) : (
              <div className="create">
                <Link to="/createpost" onClick={() => setIsMenuOpen(false)}>Create Post</Link>
                <button onClick={signUserOut}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home isAuth={isAuth} />} />
          <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
