import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Register</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required minLength={3} />
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn" style={{width: '100%'}}>Register</button>
        {error && <p style={{color: 'red', marginTop: '10px', textAlign: 'center'}}>Registration failed. Username/Email might be taken.</p>}
      </form>
      <p style={{textAlign: 'center', marginTop: '20px'}}>
        Already have an account? <Link to="/login" style={{color: 'var(--accent-color)'}}>Login here</Link>
      </p>
    </div>
  );
}
