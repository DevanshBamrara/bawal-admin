import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials. Try admin / admin');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#fff', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="bawal-logo" style={{ fontSize: '3rem' }}>BAWAL<sup>TM</sup></h1>
          <p className="grid-block-header" style={{ marginTop: '8px' }}>SYSTEM ACCESS</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffe1e1', color: 'var(--accent-red)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label className="bawal-label">USERNAME</label>
            <input 
              required
              type="text" 
              className="bawal-input" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username" 
            />
          </div>

          <div>
            <label className="bawal-label">PASSWORD</label>
            <input 
              required
              type="password" 
              className="bawal-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password" 
            />
          </div>

          <button type="submit" className="bawal-button" style={{ marginTop: '16px', width: '100%' }}>
            AUTHENTICATE
          </button>
          
        </form>

      </div>

    </div>
  );
};

export default Login;
