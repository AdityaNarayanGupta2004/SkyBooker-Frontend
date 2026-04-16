import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { flightApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const source      = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date        = searchParams.get('date');
  const passengers  = searchParams.get('passengers') || 1;

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    fetchFlights();
  }, []);

  async function fetchFlights() {
    try {
      setLoading(true);
      const res = await flightApi.search(source, destination, date);
      setFlights(res.data);
    } catch (err) {
      setError('Could not fetch flights. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectFlight(flight) {
    if (!isLoggedIn) {
      // login ke baad wापस aane ke liye current URL save karo
      navigate('/login', { state: { from: `/seats/${flight.id}?passengers=${passengers}` } });
      return;
    }
    navigate(`/seats/${flight.id}?passengers=${passengers}`);
  }

  // sorting
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
    return 0;
  });

  if (loading) return <div className="loading">Searching flights...</div>;

  return (
    <div className="page-container">
      {/* Search Summary */}
      <div className="search-summary">
        <div className="summary-route">
          <span>{source}</span>
          <span className="summary-arrow">✈</span>
          <span>{destination}</span>
        </div>
        <div className="summary-info">
          <span>📅 {date}</span>
          <span>👤 {passengers} Passenger{passengers > 1 ? 's' : ''}</span>
          <button className="btn-outline" onClick={() => navigate('/')}>
            Change Search
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert-error">{error}</div>}

      {/* Sort + Results */}
      {!error && (
        <>
          <div className="results-header">
            <h2>{sortedFlights.length} Flights Found</h2>
            <div className="sort-bar">
              <span>Sort by:</span>
              <button
                className={sortBy === 'price' ? 'sort-btn active' : 'sort-btn'}
                onClick={() => setSortBy('price')}
              >
                Price
              </button>
              <button
                className={sortBy === 'duration' ? 'sort-btn active' : 'sort-btn'}
                onClick={() => setSortBy('duration')}
              >
                Duration
              </button>
            </div>
          </div>

          {sortedFlights.length === 0 ? (
            <div className="no-flights">
              <div className="no-flights-icon">✈️</div>
              <h3>No flights found</h3>
              <p>Try changing your dates or route</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Search Again
              </button>
            </div>
          ) : (
            <div className="flights-list">
              {sortedFlights.map((flight) => (
                <div key={flight.id} className="flight-card">
                  <div className="flight-main">
                    <div className="flight-airline">
                      <span className="airline-name">{flight.airline}</span>
                      <span className="flight-number">{flight.flightNumber}</span>
                    </div>

                    <div className="flight-times">
                      <div className="time-block">
                        <div className="time">{flight.departureTime}</div>
                        <div className="city">{source}</div>
                      </div>
                      <div className="flight-line">
                        <div className="line"></div>
                        <span>✈</span>
                        <div className="line"></div>
                      </div>
                      <div className="time-block">
                        <div className="time">{flight.arrivalTime}</div>
                        <div className="city">{destination}</div>
                      </div>
                    </div>

                    <div className="flight-seats">
                      <span className={flight.availableSeats < 10 ? 'seats-low' : 'seats-ok'}>
                        {flight.availableSeats} seats left
                      </span>
                    </div>
                  </div>

                  <div className="flight-right">
                    <div className="flight-price">
                      <span className="price-label">Per person</span>
                      <span className="price">₹{flight.price?.toLocaleString()}</span>
                      <span className="price-total">
                        Total: ₹{(flight.price * passengers)?.toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="btn-primary book-btn"
                      onClick={() => handleSelectFlight(flight)}
                      disabled={flight.availableSeats === 0}
                    >
                      {flight.availableSeats === 0 ? 'Sold Out' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
