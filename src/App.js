import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">
            <Link to="/">TechBit</Link>
          </div>
          <button className="hamburger" onClick={toggleMenu}>
            <span className="hamburger-icon">☰</span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {/* <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link> */}
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
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;