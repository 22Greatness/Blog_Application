import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Navbar() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setCurrentUser(null);
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav>
      <Link to="/" className="nav-logo">Noni Blog</Link>
      <div className="nav-links">
        {currentUser ? (
          <>
            <Link to="/create" className="nav-link">Write</Link>
            <span className="nav-link" style={{color: 'var(--accent-color)'}}>{currentUser.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
