// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { seatApi, bookingApi, passengerApi, flightApi } from '../../api/api';
// import { useAuth } from '../../context/AuthContext';
// import './SeatSelection.css';

// export default function SeatSelection() {
//   const { flightId } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { userEmail } = useAuth();

//   const passengers = parseInt(searchParams.get('passengers') || 1);

//   const [step, setStep] = useState(1); // 1=seats, 2=passenger details
//   const [seats, setSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [bookingId, setBookingId] = useState(null);

//   // passenger form - ek form per passenger
//   const [passengerForms, setPassengerForms] = useState(
//     Array(passengers).fill(null).map(() => ({
//       title: 'Mr',
//       firstName: '',
//       lastName: '',
//       dateOfBirth: '',
//       gender: 'MALE',
//       passportNumber: '',
//       nationality: 'Indian',
//       passportExpiry: '',
//       passengerType: 'ADULT',
//     }))
//   );

//   useEffect(() => {
//     fetchSeats();
//   }, []);

//   async function fetchSeats() {
//     try {
//       const res = await seatApi.getAvailableSeats(flightId);
//       setSeats(res.data);
//     } catch (err) {
//       setError('Could not load seat map.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSeatClick(seat) {
//     if (seat.status !== 'AVAILABLE') return;

//     // already selected hai toh deselect karo
//     if (selectedSeats.find(s => s.id === seat.id)) {
//       setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
//       return;
//     }

//     // max passengers ke baad select mat karo
//     if (selectedSeats.length >= passengers) {
//       alert(`You can only select ${passengers} seat(s)`);
//       return;
//     }

//     try {
//       await seatApi.holdSeat(flightId, seat.seatNumber);
//       setSelectedSeats([...selectedSeats, seat]);
//       // seat status update karo locally
//       setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'HELD' } : s));
//     } catch (err) {
//       alert(err.response?.data?.message || 'Could not hold seat');
//     }
//   }

//   async function handleProceedToPassengers() {
//     if (selectedSeats.length !== passengers) {
//       alert(`Please select ${passengers} seat(s)`);
//       return;
//     }

//     // booking banao
//     try {
//       const bookingRes = await bookingApi.createBooking({
//         flightId: parseInt(flightId),
//         userEmail,
//         seats: passengers,
//       });
//       setBookingId(bookingRes.data.bookingId);
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Booking failed');
//     }
//   }

//   async function handleSubmitPassengers(e) {
//     e.preventDefault();

//     try {
//       // har passenger ka data add karo
//       for (let i = 0; i < passengerForms.length; i++) {
//         await passengerApi.addPassenger({
//           ...passengerForms[i],
//           bookingId: bookingId.toString(),
//         });
//       }
//       // payment page pe jao
//       navigate(`/payment/${bookingId}?amount=${calculateTotal()}`);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to add passenger details');
//     }
//   }

//   function updatePassengerForm(index, field, value) {
//     const updated = [...passengerForms];
//     updated[index] = { ...updated[index], [field]: value };
//     setPassengerForms(updated);
//   }

//   function calculateTotal() {
//     // basic calculation - selected seats ki price
//     return selectedSeats.reduce((sum, seat) => sum + 4500, 0);
//   }

//   // seats ko class ke hisaab se group karo
//   const economySeats  = seats.filter(s => s.seatClass === 'ECONOMY');
//   const businessSeats = seats.filter(s => s.seatClass === 'BUSINESS');

//   if (loading) return <div className="loading">Loading seat map...</div>;

//   return (
//     <div className="page-container">
//       {/* Steps indicator */}
//       <div className="steps">
//         <div className={`step ${step >= 1 ? 'active' : ''}`}>
//           <span className="step-number">1</span>
//           <span>Select Seats</span>
//         </div>
//         <div className="step-line"></div>
//         <div className={`step ${step >= 2 ? 'active' : ''}`}>
//           <span className="step-number">2</span>
//           <span>Passenger Details</span>
//         </div>
//         <div className="step-line"></div>
//         <div className="step">
//           <span className="step-number">3</span>
//           <span>Payment</span>
//         </div>
//       </div>

//       {error && <div className="alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

//       {/* STEP 1 - Seat Map */}
//       {step === 1 && (
//         <div className="seat-step">
//           <div className="card">
//             <div className="seat-header">
//               <h2>Select Your Seats</h2>
//               <p>Select {passengers} seat(s) — {selectedSeats.length} selected</p>
//             </div>

//             {/* Legend */}
//             <div className="seat-legend">
//               <div className="legend-item"><div className="seat-demo available"></div> Available</div>
//               <div className="legend-item"><div className="seat-demo selected"></div> Selected</div>
//               <div className="legend-item"><div className="seat-demo held"></div> Held</div>
//             </div>

//             {/* Business Class */}
//             {businessSeats.length > 0 && (
//               <div className="seat-class-section">
//                 <div className="class-label business">✨ Business Class</div>
//                 <div className="seats-grid">
//                   {businessSeats.map(seat => (
//                     <div
//                       key={seat.id}
//                       className={`seat ${seat.status.toLowerCase()} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
//                       onClick={() => handleSeatClick(seat)}
//                       title={`${seat.seatNumber} - ${seat.status}`}
//                     >
//                       {seat.seatNumber}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Economy Class */}
//             {economySeats.length > 0 && (
//               <div className="seat-class-section">
//                 <div className="class-label economy">Economy Class</div>
//                 <div className="seats-grid">
//                   {economySeats.map(seat => (
//                     <div
//                       key={seat.id}
//                       className={`seat ${seat.status.toLowerCase()} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
//                       onClick={() => handleSeatClick(seat)}
//                       title={`${seat.seatNumber} - ${seat.status}`}
//                     >
//                       {seat.seatNumber}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {seats.length === 0 && (
//               <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
//                 No seats available for this flight
//               </div>
//             )}
//           </div>

//           {/* Selected seats summary */}
//           {selectedSeats.length > 0 && (
//             <div className="selected-summary card">
//               <h3>Selected Seats</h3>
//               <div className="selected-list">
//                 {selectedSeats.map(s => (
//                   <span key={s.id} className="selected-badge">{s.seatNumber}</span>
//                 ))}
//               </div>
//               <button
//                 className="btn-primary"
//                 onClick={handleProceedToPassengers}
//                 disabled={selectedSeats.length !== passengers}
//               >
//                 Continue to Passenger Details →
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* STEP 2 - Passenger Details */}
//       {step === 2 && (
//         <form onSubmit={handleSubmitPassengers} className="passenger-step">
//           {passengerForms.map((form, index) => (
//             <div key={index} className="card passenger-card">
//               <h3>Passenger {index + 1}</h3>
//               <div className="passenger-grid">
//                 <div className="form-group">
//                   <label>Title</label>
//                   <select value={form.title} onChange={e => updatePassengerForm(index, 'title', e.target.value)}>
//                     <option value="Mr">Mr</option>
//                     <option value="Mrs">Mrs</option>
//                     <option value="Ms">Ms</option>
//                     <option value="Dr">Dr</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     placeholder="Rahul"
//                     value={form.firstName}
//                     onChange={e => updatePassengerForm(index, 'firstName', e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     placeholder="Sharma"
//                     value={form.lastName}
//                     onChange={e => updatePassengerForm(index, 'lastName', e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Date of Birth</label>
//                   <input
//                     type="date"
//                     value={form.dateOfBirth}
//                     onChange={e => updatePassengerForm(index, 'dateOfBirth', e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Gender</label>
//                   <select value={form.gender} onChange={e => updatePassengerForm(index, 'gender', e.target.value)}>
//                     <option value="MALE">Male</option>
//                     <option value="FEMALE">Female</option>
//                     <option value="OTHER">Other</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Passport Number</label>
//                   <input
//                     type="text"
//                     placeholder="P1234567"
//                     value={form.passportNumber}
//                     onChange={e => updatePassengerForm(index, 'passportNumber', e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Nationality</label>
//                   <input
//                     type="text"
//                     value={form.nationality}
//                     onChange={e => updatePassengerForm(index, 'nationality', e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Passport Expiry</label>
//                   <input
//                     type="date"
//                     value={form.passportExpiry}
//                     onChange={e => updatePassengerForm(index, 'passportExpiry', e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Type</label>
//                   <select value={form.passengerType} onChange={e => updatePassengerForm(index, 'passengerType', e.target.value)}>
//                     <option value="ADULT">Adult</option>
//                     <option value="CHILD">Child</option>
//                     <option value="INFANT">Infant</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div className="step-actions">
//             <button type="button" className="btn-outline" onClick={() => setStep(1)}>← Back</button>
//             <button type="submit" className="btn-primary">Continue to Payment →</button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { seatApi, bookingApi, passengerApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './SeatSelection.css';

export default function SeatSelection() {
  const { flightId }       = useParams();
  const [searchParams]     = useSearchParams();
  const navigate           = useNavigate();
  const { userEmail }      = useAuth();
  const passengers         = parseInt(searchParams.get('passengers') || 1);

  const [step, setStep]               = useState(1);
  const [seats, setSeats]             = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [bookingId, setBookingId]     = useState(null);

  const [passengerForms, setPassengerForms] = useState(
    Array(passengers).fill(null).map(() => ({
      title: 'Mr', firstName: '', lastName: '',
      dateOfBirth: '', gender: 'MALE',
      passportNumber: '', nationality: 'Indian',
      passportExpiry: '', passengerType: 'ADULT',
    }))
  );

  useEffect(() => { fetchSeats(); }, []);

  async function fetchSeats() {
    try {
      const res = await seatApi.getAvailableSeats(flightId);
      setSeats(res.data);
    } catch (err) {
      setError('Could not load seat map. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSeatClick(seat) {
    if (seat.status !== 'AVAILABLE') return;

    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      return;
    }

    if (selectedSeats.length >= passengers) {
      alert(`You can only select ${passengers} seat(s).`);
      return;
    }

    try {
      await seatApi.holdSeat(flightId, seat.seatNumber);
      setSelectedSeats([...selectedSeats, seat]);
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'HELD' } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not hold seat. Please try again.');
    }
  }

  async function handleProceedToPassengers() {
    if (selectedSeats.length !== passengers) {
      alert(`Please select ${passengers} seat(s) to continue.`);
      return;
    }
    try {
      const res = await bookingApi.createBooking({
        flightId: parseInt(flightId),
        userEmail,
        seats: passengers,
      });
      setBookingId(res.data.bookingId);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  }

  async function handleSubmitPassengers(e) {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    for (let i = 0; i < passengerForms.length; i++) {
      const f = passengerForms[i];
      if (!f.firstName.trim() || !f.lastName.trim()) {
        setError(`Please enter the full name for Passenger ${i + 1}.`);
        return;
      }
      if (!f.dateOfBirth) {
        setError(`Please enter the date of birth for Passenger ${i + 1}.`);
        return;
      }
    }

    try {
      for (let i = 0; i < passengerForms.length; i++) {
        const f = passengerForms[i];
        await passengerApi.addPassenger({
          bookingId:      bookingId.toString(),
          title:          f.title,
          firstName:      f.firstName,
          lastName:       f.lastName,
          dateOfBirth:    f.dateOfBirth,
          gender:         f.gender,
          nationality:    f.nationality,
          passengerType:  f.passengerType,
          passportNumber: f.passportNumber || null,
          passportExpiry: f.passportExpiry || null,
        });
      }
      // navigate(`/payment/${bookingId}?amount=${calculateTotal()}`);
      navigate(`/payment/${bookingId}?amount=${calculateTotal()}&flightId=${flightId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save passenger details. Please try again.');
    }
  }

  function updatePassengerForm(index, field, value) {
    const updated = [...passengerForms];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerForms(updated);
  }

  function calculateTotal() {
    // selectedSeats mein actual flight price nahi hai — base amount per seat
    return selectedSeats.length * (parseFloat(searchParams.get('price') || 4500));
  }

  // FIRST class bhi include karo
  const firstSeats    = seats.filter(s => s.seatClass === 'FIRST');
  const businessSeats = seats.filter(s => s.seatClass === 'BUSINESS');
  const economySeats  = seats.filter(s => s.seatClass === 'ECONOMY');

  if (loading) return <div className="loading">Loading seat map...</div>;

  return (
    <div className="page-container">

      {/* Steps */}
      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span>Select Seats</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span>Passenger Details</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-number">3</span>
          <span>Payment</span>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

      {/* STEP 1 — Seat Map */}
      {step === 1 && (
        <div className="seat-step">
          <div className="card">
            <div className="seat-header">
              <h2>Select Your Seats</h2>
              <p>Select {passengers} seat(s) — {selectedSeats.length} selected</p>
            </div>

            <div className="seat-legend">
              <div className="legend-item"><div className="seat-demo available"></div> Available</div>
              <div className="legend-item"><div className="seat-demo selected"></div> Selected</div>
              <div className="legend-item"><div className="seat-demo held"></div> Held</div>
            </div>

            {/* First Class */}
            {firstSeats.length > 0 && (
              <div className="seat-class-section">
                <div className="class-label first">👑 First Class</div>
                <div className="seats-grid">
                  {firstSeats.map(seat => (
                    <div
                      key={seat.id}
                      className={`seat ${seat.status.toLowerCase()} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seat)}
                      title={`Seat ${seat.seatNumber} — ${seat.status}`}
                    >
                      {seat.seatNumber}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Class */}
            {businessSeats.length > 0 && (
              <div className="seat-class-section">
                <div className="class-label business">✨ Business Class</div>
                <div className="seats-grid">
                  {businessSeats.map(seat => (
                    <div
                      key={seat.id}
                      className={`seat ${seat.status.toLowerCase()} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seat)}
                      title={`Seat ${seat.seatNumber} — ${seat.status}`}
                    >
                      {seat.seatNumber}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Economy Class */}
            {economySeats.length > 0 && (
              <div className="seat-class-section">
                <div className="class-label economy">Economy Class</div>
                <div className="seats-grid">
                  {economySeats.map(seat => (
                    <div
                      key={seat.id}
                      className={`seat ${seat.status.toLowerCase()} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seat)}
                      title={`Seat ${seat.seatNumber} — ${seat.status}`}
                    >
                      {seat.seatNumber}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {seats.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                No seats available for this flight.
              </div>
            )}
          </div>

          {selectedSeats.length > 0 && (
            <div className="selected-summary card">
              <h3>Selected Seats</h3>
              <div className="selected-list">
                {selectedSeats.map(s => (
                  <span key={s.id} className="selected-badge">{s.seatNumber}</span>
                ))}
              </div>
              <button
                className="btn-primary"
                onClick={handleProceedToPassengers}
                disabled={selectedSeats.length !== passengers}
              >
                Continue to Passenger Details →
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — Passenger Details */}
      {step === 2 && (
        <form onSubmit={handleSubmitPassengers} className="passenger-step">
          {passengerForms.map((form, index) => (
            <div key={index} className="card passenger-card">
              <h3>Passenger {index + 1}</h3>
              <div className="passenger-grid">

                <div className="form-group">
                  <label>Title</label>
                  <select value={form.title} onChange={e => updatePassengerForm(index, 'title', e.target.value)}>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>First Name <span style={{color:'red'}}>*</span></label>
                  <input type="text" placeholder="John" value={form.firstName}
                    onChange={e => updatePassengerForm(index, 'firstName', e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Last Name <span style={{color:'red'}}>*</span></label>
                  <input type="text" placeholder="Smith" value={form.lastName}
                    onChange={e => updatePassengerForm(index, 'lastName', e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Date of Birth <span style={{color:'red'}}>*</span></label>
                  <input type="date" value={form.dateOfBirth}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={e => updatePassengerForm(index, 'dateOfBirth', e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select value={form.gender} onChange={e => updatePassengerForm(index, 'gender', e.target.value)}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Passenger Type</label>
                  <select value={form.passengerType} onChange={e => updatePassengerForm(index, 'passengerType', e.target.value)}>
                    <option value="ADULT">Adult</option>
                    <option value="CHILD">Child (2–12 yrs)</option>
                    <option value="INFANT">Infant (under 2 yrs)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nationality</label>
                  <input type="text" value={form.nationality}
                    onChange={e => updatePassengerForm(index, 'nationality', e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Passport Number <span style={{color:'#64748b', fontSize:'12px'}}>(Optional)</span></label>
                  <input type="text" placeholder="A1234567" value={form.passportNumber}
                    onChange={e => updatePassengerForm(index, 'passportNumber', e.target.value.toUpperCase())} />
                </div>

                {form.passportNumber && (
                  <div className="form-group">
                    <label>Passport Expiry</label>
                    <input type="date" value={form.passportExpiry}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => updatePassengerForm(index, 'passportExpiry', e.target.value)} />
                  </div>
                )}

              </div>
            </div>
          ))}

          <div className="step-actions">
            <button type="button" className="btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button type="submit" className="btn-primary">Continue to Payment →</button>
          </div>
        </form>
      )}
    </div>
  );
}