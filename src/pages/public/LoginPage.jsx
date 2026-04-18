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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    role: 'PASSENGER',
    staffSecretKey: '',
    adminSecretKey: '',
  });

  const redirectTo = location.state?.from || '/';

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authApi.login(loginForm);
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || 'PASSENGER';
      login(token, loginForm.email, role);
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'AIRLINE_STAFF') navigate('/staff');
      else navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = {
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        role: registerForm.role,
        staffSecretKey: registerForm.role === 'AIRLINE_STAFF' ? registerForm.staffSecretKey : undefined,
        adminSecretKey: registerForm.role === 'ADMIN' ? registerForm.adminSecretKey : undefined,
      };
      await authApi.register(payload);
      setSuccess('Registration successful! Please login.');
      setTab('login');
      setLoginForm({ email: registerForm.email, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>✈️ SkyBooker</h1>
          <p>Your journey starts here</p>
        </div>
        <div className="tabs">
          <button className={tab === 'login' ? 'tab active' : 'tab'}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>Login</button>
          <button className={tab === 'register' ? 'tab active' : 'tab'}
            onClick={() => { setTab('register'); setError(''); setSuccess(''); }}>Register</button>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534',
            padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
            {success}
          </div>
        )}

        {/* LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Rahul Sharma" value={registerForm.fullName}
                onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Min 6 characters" value={registerForm.password}
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" placeholder="9876543210" value={registerForm.phone}
                onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            </div>

            {/* Role selector */}
            <div className="form-group">
              <label>Register As</label>
              <select value={registerForm.role}
                onChange={e => setRegisterForm({
                  ...registerForm, role: e.target.value,
                  staffSecretKey: '', adminSecretKey: ''
                })}>
                <option value="PASSENGER">Passenger</option>
                <option value="AIRLINE_STAFF">Airline Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Staff Secret Key */}
            {registerForm.role === 'AIRLINE_STAFF' && (
              <div className="form-group">
                <label>Staff Secret Key</label>
                <input type="password"
                  placeholder="Enter staff secret key provided by admin"
                  value={registerForm.staffSecretKey}
                  onChange={e => setRegisterForm({ ...registerForm, staffSecretKey: e.target.value })}
                  required />
                <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Contact your airline administrator for this key.
                </small>
              </div>
            )}

            {/* Admin Secret Key */}
            {registerForm.role === 'ADMIN' && (
              <div className="form-group">
                <label>Admin Secret Key</label>
                <input type="password"
                  placeholder="Enter admin secret key"
                  value={registerForm.adminSecretKey}
                  onChange={e => setRegisterForm({ ...registerForm, adminSecretKey: e.target.value })}
                  required />
                <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  System admin secret key required. Only one admin account is allowed.
                </small>
              </div>
            )}

            <button type="submit" className="btn-primary submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}