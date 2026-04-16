import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { isLoggedIn, userEmail, userRole, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  // role ke hisaab se dashboard link
  function getDashboardLink() {
    if (userRole === 'ADMIN') return '/admin';
    if (userRole === 'AIRLINE_STAFF') return '/staff';
    return '/my-bookings';
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          ✈️ SkyBooker
        </Link>

        <div className="navbar-links">
          <Link to="/">Search Flights</Link>

          {isLoggedIn ? (
            <>
              <Link to={getDashboardLink()}>
                {userRole === 'ADMIN' ? 'Admin Panel' :
                 userRole === 'AIRLINE_STAFF' ? 'Staff Panel' :
                 'My Bookings'}
              </Link>
              <span className="navbar-email">{userEmail}</span>
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn-primary">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
