import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '', email: '', password: '', phone: '', role: 'PASSENGER'
  });

  // login ke baad kahan jaana hai
  const redirectTo = location.state?.from || '/';

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login(loginForm);
      const token = res.data.token;

      // token se role nikalo (JWT decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || 'PASSENGER';

      login(token, loginForm.email, role);

      // role ke hisaab se redirect
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'AIRLINE_STAFF') navigate('/staff');
      else navigate(redirectTo);

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register(registerForm);
      setTab('login');
      setLoginForm({ email: registerForm.email, password: '' });
      setError('');
      alert('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>✈️ SkyBooker</h1>
          <p>Your journey starts here</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === 'login' ? 'tab active' : 'tab'}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Login
          </button>
          <button
            className={tab === 'register' ? 'tab active' : 'tab'}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={registerForm.fullName}
                onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={registerForm.password}
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder="9876543210"
                value={registerForm.phone}
                onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={registerForm.role}
                onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}
              >
                <option value="PASSENGER">Passenger</option>
                <option value="AIRLINE_STAFF">Airline Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-primary submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
