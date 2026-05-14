// axios mock kar rahe hain — real network call nahi hogi
// api.js ka structure same test kar rahe hain

jest.mock('axios', () => ({
  post: jest.fn(),
  get:  jest.fn(),
  put:  jest.fn(),
  interceptors: {
    response: { use: jest.fn() },
    request:  { use: jest.fn() },
  },
  create: jest.fn().mockReturnThis(),
  defaults: { headers: { common: {} } },
}));

const axios = require('axios');

// ── API helper functions — api.js se match karta hai ─────────────────────────
const GATEWAY_URL = 'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com';

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

// ── Auth API Tests ────────────────────────────────────────────────────────────
describe('Auth API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Login API sahi URL aur data ke saath call hoti hai', async () => {
    axios.post.mockResolvedValue({ data: { token: 'fake-token' } });

    const loginData = { email: 'rahul@gmail.com', password: 'Rahul@123' };
    await axios.post(`${GATEWAY_URL}/auth/login`, loginData);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/auth/login',
      loginData
    );
  });

  test('Register API sahi URL ke saath call hoti hai', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Registration successful' } });

    const registerData = {
      fullName: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      password: 'Rahul@123',
      role: 'PASSENGER',
    };
    await axios.post(`${GATEWAY_URL}/auth/register`, registerData);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/auth/register',
      registerData
    );
  });

  test('Google login API sahi URL ke saath call hoti hai', async () => {
    axios.post.mockResolvedValue({ data: { token: 'google-token', role: 'PASSENGER' } });

    await axios.post(`${GATEWAY_URL}/auth/google`, { credential: 'google-credential' });

    expect(axios.post).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/auth/google',
      { credential: 'google-credential' }
    );
  });

  test('Login API failure pe error throw hota hai', async () => {
    axios.post.mockRejectedValue({
      response: { status: 401, data: { message: 'Incorrect password' } }
    });

    await expect(
      axios.post(`${GATEWAY_URL}/auth/login`, { email: 'x@x.com', password: 'wrong' })
    ).rejects.toMatchObject({
      response: { status: 401 }
    });
  });

});

// ── Flight API Tests ──────────────────────────────────────────────────────────
describe('Flight API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Flight search sahi params ke saath call hoti hai', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const token = 'test-token';
    await axios.get(`${GATEWAY_URL}/flights/search`, {
      params: { source: 'Delhi', destination: 'Mumbai', date: '2025-12-01' }
    });

    expect(axios.get).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/flights/search',
      { params: { source: 'Delhi', destination: 'Mumbai', date: '2025-12-01' } }
    );
  });

  test('Add flight sahi Authorization header ke saath call hota hai', async () => {
    axios.post.mockResolvedValue({ data: { id: 1 } });

    const token = 'test-token';
    const flightData = { flightNumber: '6E-101', source: 'Delhi', destination: 'Mumbai' };

    await axios.post(`${GATEWAY_URL}/flights`, flightData, {
      headers: authHeader(token)
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/flights',
      flightData,
      { headers: { Authorization: 'Bearer test-token' } }
    );
  });

  test('No connection pe error sahi milta hai', async () => {
    axios.get.mockRejectedValue({ request: {}, message: 'Network Error' });

    await expect(
      axios.get(`${GATEWAY_URL}/flights/search`)
    ).rejects.toMatchObject({ message: 'Network Error' });
  });

});

// ── Seat API Tests ────────────────────────────────────────────────────────────
describe('Seat API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAvailableSeats sahi flightId ke saath call hota hai', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const flightId = 5;
    await axios.get(`${GATEWAY_URL}/seats/flight/${flightId}/available`, {
      headers: authHeader('token')
    });

    expect(axios.get).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/seats/flight/5/available',
      expect.any(Object)
    );
  });

  test('holdSeat sahi URL ke saath PUT call hota hai', async () => {
    axios.put.mockResolvedValue({ data: { status: 'HELD' } });

    await axios.put(
      `${GATEWAY_URL}/seats/flight/5/hold/12A`,
      null,
      { headers: authHeader('token') }
    );

    expect(axios.put).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/seats/flight/5/hold/12A',
      null,
      expect.any(Object)
    );
  });

  test('confirmSeat sahi URL ke saath PUT call hota hai', async () => {
    axios.put.mockResolvedValue({ data: { status: 'CONFIRMED' } });

    await axios.put(
      `${GATEWAY_URL}/seats/flight/5/confirm/12A`,
      null,
      { headers: authHeader('token') }
    );

    expect(axios.put).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/seats/flight/5/confirm/12A',
      null,
      expect.any(Object)
    );
  });

});

// ── Payment API Tests ─────────────────────────────────────────────────────────
describe('Payment API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Pay API sahi data ke saath call hoti hai', async () => {
    axios.post.mockResolvedValue({ data: { status: 'PAID', transactionId: 'UPI-ABC123' } });

    const paymentData = {
      bookingId: 10,
      userEmail: 'rahul@gmail.com',
      amount: 5310,
      paymentMode: 'UPI',
    };

    await axios.post(`${GATEWAY_URL}/payments`, paymentData, {
      headers: authHeader('token')
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/payments',
      paymentData,
      expect.any(Object)
    );
  });

  test('Refund API sahi bookingId ke saath call hoti hai', async () => {
    axios.post.mockResolvedValue({ data: { status: 'REFUNDED' } });

    await axios.post(
      `${GATEWAY_URL}/payments/refund/10`,
      null,
      { headers: authHeader('token') }
    );

    expect(axios.post).toHaveBeenCalledWith(
      'https://api-gateway-adityanarayangupta81-dev.apps.rm1.0a51.p1.openshiftapps.com/payments/refund/10',
      null,
      expect.any(Object)
    );
  });

  test('Payment duplicate hone pe error aata hai', async () => {
    axios.post.mockRejectedValue({
      response: { status: 400, data: { message: 'Payment already done for booking: 10' } }
    });

    await expect(
      axios.post(`${GATEWAY_URL}/payments`, { bookingId: 10 })
    ).rejects.toMatchObject({
      response: { data: { message: 'Payment already done for booking: 10' } }
    });
  });

});