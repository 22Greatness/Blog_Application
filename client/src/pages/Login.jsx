import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password }, { withCredentials: true });
      setCurrentUser(res.data);
      navigate('/');
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn" style={{width: '100%'}}>Login</button>
        {error && <p style={{color: 'red', marginTop: '10px', textAlign: 'center'}}>Something went wrong!</p>}
      </form>
      <p style={{textAlign: 'center', marginTop: '20px'}}>
        Don't have an account? <Link to="/register" style={{color: 'var(--accent-color)'}}>Register here</Link>
      </p>
    </div>
  );
}
