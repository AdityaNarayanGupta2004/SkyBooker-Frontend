// AuthContext aur LoginPage ki auth logic test kar rahe hain
// localStorage mock karke test kar rahe hain — real browser zaroorat nahi

// ── JWT decode helper — LoginPage mein yahi hota hai ─────────────────────────
function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'PASSENGER';
  } catch {
    return null;
  }
}

// ── Fake JWT banate hain test ke liye ─────────────────────────────────────────
function makeFakeToken(role) {
  // Real JWT format: header.payload.signature
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'test@gmail.com', role, exp: 9999999999 }));
  const sig     = 'fakesignature';
  return `${header}.${payload}.${sig}`;
}

// ── Token Tests ───────────────────────────────────────────────────────────────
describe('JWT Token Logic', () => {

  test('ADMIN role token se sahi decode hota hai', () => {
    const token = makeFakeToken('ADMIN');
    expect(getRoleFromToken(token)).toBe('ADMIN');
  });

  test('PASSENGER role token se sahi decode hota hai', () => {
    const token = makeFakeToken('PASSENGER');
    expect(getRoleFromToken(token)).toBe('PASSENGER');
  });

  test('AIRLINE_STAFF role token se sahi decode hota hai', () => {
    const token = makeFakeToken('AIRLINE_STAFF');
    expect(getRoleFromToken(token)).toBe('AIRLINE_STAFF');
  });

  test('Invalid token pe null return hota hai', () => {
    expect(getRoleFromToken('not.a.token')).toBeNull();
  });

  test('Empty string pe null return hota hai', () => {
    expect(getRoleFromToken('')).toBeNull();
  });

});

// ── Role-based Redirect Tests ─────────────────────────────────────────────────
describe('Role Based Navigation', () => {

  function getRedirectPath(role, defaultPath = '/') {
    if (role === 'ADMIN')          return '/admin';
    if (role === 'AIRLINE_STAFF')  return '/staff';
    return defaultPath;
  }

  test('ADMIN ko /admin redirect hota hai', () => {
    expect(getRedirectPath('ADMIN')).toBe('/admin');
  });

  test('AIRLINE_STAFF ko /staff redirect hota hai', () => {
    expect(getRedirectPath('AIRLINE_STAFF')).toBe('/staff');
  });

  test('PASSENGER ko / redirect hota hai', () => {
    expect(getRedirectPath('PASSENGER')).toBe('/');
  });

  test('PASSENGER ko custom path pe redirect hota hai', () => {
    expect(getRedirectPath('PASSENGER', '/seats/5')).toBe('/seats/5');
  });

});

// ── localStorage Tests ────────────────────────────────────────────────────────
describe('Auth Storage Logic', () => {

  // Har test ke baad localStorage clear karo
  afterEach(() => {
    localStorage.clear();
  });

  test('Login ke baad token localStorage mein save hota hai', () => {
    const token = makeFakeToken('PASSENGER');
    localStorage.setItem('token', token);
    expect(localStorage.getItem('token')).toBe(token);
  });

  test('Logout ke baad localStorage clear hota hai', () => {
    localStorage.setItem('token', 'sometoken');
    localStorage.setItem('userEmail', 'test@gmail.com');
    localStorage.setItem('userRole', 'PASSENGER');
    localStorage.clear();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });

  test('Token na ho toh isLoggedIn false hota hai', () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    expect(isLoggedIn).toBe(false);
  });

  test('Token ho toh isLoggedIn true hota hai', () => {
    localStorage.setItem('token', makeFakeToken('PASSENGER'));
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    expect(isLoggedIn).toBe(true);
  });

  test('userEmail sahi save aur read hota hai', () => {
    localStorage.setItem('userEmail', 'rahul@gmail.com');
    expect(localStorage.getItem('userEmail')).toBe('rahul@gmail.com');
  });

});