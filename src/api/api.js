import axios from 'axios';

// API Gateway - sirf yeh ek URL - sab requests yahan se jayengi
// Gateway port 8080 pe chalta hai aur sahi service pe forward karta hai
const GATEWAY_URL = 'http://localhost:8080';

// token header banao - har protected request mein lagega
function authHeader() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

// ==================== AUTH (Gateway → 8081) ====================
export const authApi = {
  register: (data) =>
    axios.post(`${GATEWAY_URL}/auth/register`, data),

  login: (data) =>
    axios.post(`${GATEWAY_URL}/auth/login`, data),

  getProfile: () =>
    axios.get(`${GATEWAY_URL}/auth/profile`, { headers: authHeader() }),
};

// ==================== FLIGHTS (Gateway → 8082) ====================
export const flightApi = {
  // search public hai - bina login ke bhi chalega
  search: (source, destination, date) =>
    axios.get(`${GATEWAY_URL}/flights/search`, {
      params: { source, destination, date },
    }),

  getAll: () =>
    axios.get(`${GATEWAY_URL}/flights`, { headers: authHeader() }),

  addFlight: (data) =>
    axios.post(`${GATEWAY_URL}/flights`, data, { headers: authHeader() }),

  reduceSeats: (flightId, seats) =>
    axios.put(`${GATEWAY_URL}/flights/${flightId}/reduce-seats`, null, {
      params: { seats },
      headers: authHeader(),
    }),
};

// ==================== SEATS (Gateway → 8086) ====================
export const seatApi = {
  getSeatsByFlight: (flightId) =>
    axios.get(`${GATEWAY_URL}/seats/flight/${flightId}`, { headers: authHeader() }),

  getAvailableSeats: (flightId) =>
    axios.get(`${GATEWAY_URL}/seats/flight/${flightId}/available`, { headers: authHeader() }),

  holdSeat: (flightId, seatNumber) =>
    axios.put(`${GATEWAY_URL}/seats/flight/${flightId}/hold/${seatNumber}`, null, {
      headers: authHeader(),
    }),

  confirmSeat: (flightId, seatNumber) =>
    axios.put(`${GATEWAY_URL}/seats/flight/${flightId}/confirm/${seatNumber}`, null, {
      headers: authHeader(),
    }),

  addSeat: (data) =>
    axios.post(`${GATEWAY_URL}/seats`, data, { headers: authHeader() }),
};

// ==================== BOOKING (Gateway → 8083) ====================
export const bookingApi = {
  createBooking: (data) =>
    axios.post(`${GATEWAY_URL}/bookings`, data, { headers: authHeader() }),
};

// ==================== PASSENGER (Gateway → 8084) ====================
export const passengerApi = {
  addPassenger: (data) =>
    axios.post(`${GATEWAY_URL}/passengers`, data, { headers: authHeader() }),

  getByBooking: (bookingId) =>
    axios.get(`${GATEWAY_URL}/passengers/booking/${bookingId}`, { headers: authHeader() }),
};

// ==================== PAYMENT (Gateway → 8085) ====================
export const paymentApi = {
  pay: (data) =>
    axios.post(`${GATEWAY_URL}/payments`, data, { headers: authHeader() }),

  getByBooking: (bookingId) =>
    axios.get(`${GATEWAY_URL}/payments/booking/${bookingId}`, { headers: authHeader() }),

  getByUser: (email) =>
    axios.get(`${GATEWAY_URL}/payments/user/${email}`, { headers: authHeader() }),

  refund: (bookingId) =>
    axios.post(`${GATEWAY_URL}/payments/refund/${bookingId}`, null, { headers: authHeader() }),
};

// ==================== AIRLINE (Gateway → 8087) ====================
export const airlineApi = {
  getAll: () =>
    axios.get(`${GATEWAY_URL}/airlines`, { headers: authHeader() }),

  addAirline: (data) =>
    axios.post(`${GATEWAY_URL}/airlines`, data, { headers: authHeader() }),

  toggleStatus: (id) =>
    axios.put(`${GATEWAY_URL}/airlines/${id}/toggle-status`, null, { headers: authHeader() }),

  searchAirports: (keyword) =>
    axios.get(`${GATEWAY_URL}/airports/search`, {
      params: { keyword },
      headers: authHeader(),
    }),

  getAllAirports: () =>
    axios.get(`${GATEWAY_URL}/airports`, { headers: authHeader() }),

  addAirport: (data) =>
    axios.post(`${GATEWAY_URL}/airports`, data, { headers: authHeader() }),
};





// import axios from 'axios';

// // Base URLs - har service ka alag port
// const AUTH_URL      = 'http://localhost:8081';
// const FLIGHT_URL    = 'http://localhost:8082';
// const BOOKING_URL   = 'http://localhost:8083';
// const PASSENGER_URL = 'http://localhost:8084';
// const PAYMENT_URL   = 'http://localhost:8085';
// const SEAT_URL      = 'http://localhost:8086';
// const AIRLINE_URL   = 'http://localhost:8087';

// // token header banao
// function authHeader() {
//   const token = localStorage.getItem('token');
//   return { Authorization: `Bearer ${token}` };
// }

// // ==================== AUTH ====================
// export const authApi = {
//   register: (data) => axios.post(`${AUTH_URL}/auth/register`, data),
//   login: (data) => axios.post(`${AUTH_URL}/auth/login`, data),
//   getProfile: () => axios.get(`${AUTH_URL}/auth/profile`, { headers: authHeader() }),
// };

// // ==================== FLIGHTS ====================
// export const flightApi = {
//   // search: (source, destination, date) =>
//   //   axios.get(`${FLIGHT_URL}/flights/search`, {
//   //     params: { source, destination, date },
//   //     headers: authHeader(),
//   //   }),
// //   search: (source, destination, date) => {
// //   const token = localStorage.getItem('token');
// //   const config = { params: { source, destination, date } };
// //   if (token) config.headers = authHeader();  // ✅ token ho toh lagao, na ho toh mat lagao
// //   return axios.get(`${FLIGHT_URL}/flights/search`, config);
// // },
// search: (source, destination, date) =>
//   axios.get(`${FLIGHT_URL}/flights/search`, {
//     params: { source, destination, date },
//     // token nahi chahiye — public endpoint hai
//   }),

//   getAll: () => axios.get(`${FLIGHT_URL}/flights`, { headers: authHeader() }),
//   addFlight: (data) => axios.post(`${FLIGHT_URL}/flights`, data, { headers: authHeader() }),
//   reduceSeats: (flightId, seats) =>
//     axios.put(`${FLIGHT_URL}/flights/${flightId}/reduce-seats`, null, {
//       params: { seats },
//       headers: authHeader(),
//     }),
// };

// // ==================== SEATS ====================
// export const seatApi = {
//   getSeatsByFlight: (flightId) =>
//     axios.get(`${SEAT_URL}/seats/flight/${flightId}`, { headers: authHeader() }),
//   getAvailableSeats: (flightId) =>
//     axios.get(`${SEAT_URL}/seats/flight/${flightId}/available`, { headers: authHeader() }),
//   holdSeat: (flightId, seatNumber) =>
//     axios.put(`${SEAT_URL}/seats/flight/${flightId}/hold/${seatNumber}`, null, { headers: authHeader() }),
//   confirmSeat: (flightId, seatNumber) =>
//     axios.put(`${SEAT_URL}/seats/flight/${flightId}/confirm/${seatNumber}`, null, { headers: authHeader() }),
//   addSeat: (data) => axios.post(`${SEAT_URL}/seats`, data, { headers: authHeader() }),
// };

// // ==================== BOOKING ====================
// export const bookingApi = {
//   createBooking: (data) =>
//     axios.post(`${BOOKING_URL}/bookings`, data, { headers: authHeader() }),
// };

// // ==================== PASSENGER ====================
// export const passengerApi = {
//   addPassenger: (data) =>
//     axios.post(`${PASSENGER_URL}/passengers`, data, { headers: authHeader() }),
//   getByBooking: (bookingId) =>
//     axios.get(`${PASSENGER_URL}/passengers/booking/${bookingId}`, { headers: authHeader() }),
// };

// // ==================== PAYMENT ====================
// export const paymentApi = {
//   pay: (data) =>
//     axios.post(`${PAYMENT_URL}/payments`, data, { headers: authHeader() }),
//   getByBooking: (bookingId) =>
//     axios.get(`${PAYMENT_URL}/payments/booking/${bookingId}`, { headers: authHeader() }),
//   getByUser: (email) =>
//     axios.get(`${PAYMENT_URL}/payments/user/${email}`, { headers: authHeader() }),
//   refund: (bookingId) =>
//     axios.post(`${PAYMENT_URL}/payments/refund/${bookingId}`, null, { headers: authHeader() }),
// };

// // ==================== AIRLINE ====================
// export const airlineApi = {
//   getAll: () => axios.get(`${AIRLINE_URL}/airlines`, { headers: authHeader() }),
//   addAirline: (data) => axios.post(`${AIRLINE_URL}/airlines`, data, { headers: authHeader() }),
//   toggleStatus: (id) =>
//     axios.put(`${AIRLINE_URL}/airlines/${id}/toggle-status`, null, { headers: authHeader() }),
//   searchAirports: (keyword) =>
//     axios.get(`${AIRLINE_URL}/airports/search`, { params: { keyword }, headers: authHeader() }),
//   getAllAirports: () => axios.get(`${AIRLINE_URL}/airports`, { headers: authHeader() }),
//   addAirport: (data) => axios.post(`${AIRLINE_URL}/airports`, data, { headers: authHeader() }),
// };
