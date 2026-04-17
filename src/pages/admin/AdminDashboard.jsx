import React, { useState, useEffect } from 'react';
import { airlineApi } from '../../api/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [tab, setTab] = useState('airlines');

  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [airlineForm, setAirlineForm] = useState({
    name: '', iataCode: '', icaoCode: '', country: '',
    contactEmail: '', contactPhone: ''
  });

  const [airportForm, setAirportForm] = useState({
    name: '', iataCode: '', icaoCode: '', city: '',
    country: '', latitude: '', longitude: '', timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [airlineRes, airportRes] = await Promise.all([
        airlineApi.getAll(),
        airlineApi.getAllAirports(),
      ]);
      setAirlines(airlineRes.data);
      setAirports(airportRes.data);
    } catch (err) {
      setError('Could not load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAirline(e) {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await airlineApi.addAirline(airlineForm);
      setMessage('Airline added successfully!');
      setAirlineForm({ name: '', iataCode: '', icaoCode: '', country: '', contactEmail: '', contactPhone: '' });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add airline');
    }
  }

  async function handleAddAirport(e) {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await airlineApi.addAirport({
        ...airportForm,
        latitude: parseFloat(airportForm.latitude),
        longitude: parseFloat(airportForm.longitude),
      });
      setMessage('Airport added successfully!');
      setAirportForm({ name: '', iataCode: '', icaoCode: '', city: '', country: '', latitude: '', longitude: '', timezone: 'Asia/Kolkata' });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add airport');
    }
  }

  async function handleToggle(id) {
    try {
      await airlineApi.toggleStatus(id);
      fetchAll();
    } catch (err) {
      setError('Could not update airline status');
    }
  }

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage airlines and airports</p>
      </div>

      {message && <div className="alert-success" style={{ marginBottom: '16px' }}>{message}</div>}
      {error   && <div className="alert-error"   style={{ marginBottom: '16px' }}>{error}</div>}

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{airlines.length}</div>
          <div className="stat-label">Total Airlines</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{airlines.filter(a => a.active).length}</div>
          <div className="stat-label">Active Airlines</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{airports.length}</div>
          <div className="stat-label">Total Airports</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={tab === 'airlines' ? 'tab active' : 'tab'} onClick={() => setTab('airlines')}>
          Airlines ({airlines.length})
        </button>
        <button className={tab === 'add-airline' ? 'tab active' : 'tab'} onClick={() => setTab('add-airline')}>
          + Add Airline
        </button>
        <button className={tab === 'airports' ? 'tab active' : 'tab'} onClick={() => setTab('airports')}>
          Airports ({airports.length})
        </button>
        <button className={tab === 'add-airport' ? 'tab active' : 'tab'} onClick={() => setTab('add-airport')}>
          + Add Airport
        </button>
      </div>

      {/* Airlines List */}
      {tab === 'airlines' && (
        <div className="card">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Airline</th>
                <th>IATA</th>
                <th>Country</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map(airline => (
                <tr key={airline.id}>
                  <td><strong>{airline.name}</strong></td>
                  <td><span className="iata-code">{airline.iataCode}</span></td>
                  <td>{airline.country}</td>
                  <td>{airline.contactEmail}</td>
                  <td>
                    <span className={`badge ${airline.active ? 'badge-success' : 'badge-danger'}`}>
                      {airline.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`toggle-btn ${airline.active ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggle(airline.id)}
                    >
                      {airline.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {airlines.length === 0 && <div className="empty-state-small">No airlines added yet</div>}
        </div>
      )}

      {/* Add Airline */}
      {tab === 'add-airline' && (
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Add New Airline</h2>
          <form onSubmit={handleAddAirline} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Airline Name</label>
                <input type="text" placeholder="IndiGo"
                  value={airlineForm.name}
                  onChange={e => setAirlineForm({ ...airlineForm, name: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>IATA Code</label>
                <input type="text" placeholder="6E" maxLength={3}
                  value={airlineForm.iataCode}
                  onChange={e => setAirlineForm({ ...airlineForm, iataCode: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>ICAO Code</label>
                <input type="text" placeholder="IGO"
                  value={airlineForm.icaoCode}
                  onChange={e => setAirlineForm({ ...airlineForm, icaoCode: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" placeholder="India"
                  value={airlineForm.country}
                  onChange={e => setAirlineForm({ ...airlineForm, country: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" placeholder="support@airline.com"
                  value={airlineForm.contactEmail}
                  onChange={e => setAirlineForm({ ...airlineForm, contactEmail: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="text" placeholder="1800-xxx-xxxx"
                  value={airlineForm.contactPhone}
                  onChange={e => setAirlineForm({ ...airlineForm, contactPhone: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary">Add Airline</button>
          </form>
        </div>
      )}

      {/* Airports List */}
      {tab === 'airports' && (
        <div className="card">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Airport</th>
                <th>IATA</th>
                <th>City</th>
                <th>Country</th>
                <th>Timezone</th>
              </tr>
            </thead>
            <tbody>
              {airports.map(airport => (
                <tr key={airport.id}>
                  <td><strong>{airport.name}</strong></td>
                  <td><span className="iata-code">{airport.iataCode}</span></td>
                  <td>{airport.city}</td>
                  <td>{airport.country}</td>
                  <td>{airport.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {airports.length === 0 && <div className="empty-state-small">No airports added yet</div>}
        </div>
      )}

      {/* Add Airport */}
      {tab === 'add-airport' && (
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Add New Airport</h2>
          <form onSubmit={handleAddAirport} className="admin-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Airport Name</label>
                <input type="text" placeholder="Indira Gandhi International Airport"
                  value={airportForm.name}
                  onChange={e => setAirportForm({ ...airportForm, name: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>IATA Code</label>
                <input type="text" placeholder="DEL" maxLength={3}
                  value={airportForm.iataCode}
                  onChange={e => setAirportForm({ ...airportForm, iataCode: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>ICAO Code</label>
                <input type="text" placeholder="VIDP"
                  value={airportForm.icaoCode}
                  onChange={e => setAirportForm({ ...airportForm, icaoCode: e.target.value })} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="Delhi"
                  value={airportForm.city}
                  onChange={e => setAirportForm({ ...airportForm, city: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" placeholder="India"
                  value={airportForm.country}
                  onChange={e => setAirportForm({ ...airportForm, country: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input type="number" step="0.0001" placeholder="28.5562"
                  value={airportForm.latitude}
                  onChange={e => setAirportForm({ ...airportForm, latitude: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input type="number" step="0.0001" placeholder="77.1000"
                  value={airportForm.longitude}
                  onChange={e => setAirportForm({ ...airportForm, longitude: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <input type="text" placeholder="Asia/Kolkata"
                  value={airportForm.timezone}
                  onChange={e => setAirportForm({ ...airportForm, timezone: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary">Add Airport</button>
          </form>
        </div>
      )}
    </div>
  );
}
