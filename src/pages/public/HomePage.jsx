import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    source: '',
    destination: '',
    date: '',
    passengers: 1,
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    e.preventDefault();

    if (!form.source || !form.destination || !form.date) {
      alert('Please fill all fields');
      return;
    }

    // search results page pe bhejo with query params
    navigate(`/search?source=${form.source}&destination=${form.destination}&date=${form.date}&passengers=${form.passengers}`);
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Flight</h1>
          <p>Search hundreds of flights and book at the best price</p>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="form-group">
                <label>From</label>
                <input
                  type="text"
                  name="source"
                  placeholder="e.g. Delhi"
                  value={form.source}
                  onChange={handleChange}
                />
              </div>

              <div className="swap-icon">⇄</div>

              <div className="form-group">
                <label>To</label>
                <input
                  type="text"
                  name="destination"
                  placeholder="e.g. Mumbai"
                  value={form.destination}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Passengers</label>
                <select name="passengers" value={form.passengers} onChange={handleChange}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary search-btn">
              🔍 Search Flights
            </button>
          </form>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="page-container">
        <h2 className="section-title">Popular Routes</h2>
        <div className="routes-grid">
          {popularRoutes.map((route, i) => (
            <div
              key={i}
              className="route-card"
              onClick={() => navigate(`/search?source=${route.from}&destination=${route.to}&date=${getNextWeekDate()}&passengers=1`)}
            >
              <div className="route-cities">
                <span>{route.from}</span>
                <span className="route-arrow">✈</span>
                <span>{route.to}</span>
              </div>
              <div className="route-price">Starting from ₹{route.price}</div>
            </div>
          ))}
        </div>

        {/* Why SkyBooker */}
        <h2 className="section-title" style={{ marginTop: '48px' }}>Why SkyBooker?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const popularRoutes = [
  { from: 'Delhi', to: 'Mumbai', price: '3,499' },
  { from: 'Mumbai', to: 'Bengaluru', price: '2,799' },
  { from: 'Delhi', to: 'Bengaluru', price: '3,999' },
  { from: 'Mumbai', to: 'Delhi', price: '3,299' },
];

const features = [
  { icon: '💰', title: 'Best Prices', desc: 'Compare fares across all airlines and find the cheapest deals' },
  { icon: '🔒', title: 'Secure Booking', desc: 'Your payment and personal data is always safe with us' },
  { icon: '📱', title: 'Easy Management', desc: 'Manage all your bookings from one simple dashboard' },
  { icon: '⚡', title: 'Instant Confirmation', desc: 'Get your e-ticket immediately after booking' },
];

function getNextWeekDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}
