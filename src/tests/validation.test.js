// LoginPage mein VALIDATORS object hai — same regex yahan test kar rahe hain
// StaffDashboard mein date aur time validation logic test kar rahe hain

// ── LoginPage ke VALIDATORS se liya gaya ─────────────────────────────────────
const VALIDATORS = {
  fullName:       { regex: /^[A-Za-z ]{2,60}$/,    message: 'Full name: 2-60 letters and spaces only' },
  email:          { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
  password:       { regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, message: 'Password requirements not met' },
  phone:          { regex: /^[6-9]\d{9}$/,          message: 'Enter a valid 10-digit Indian mobile number' },
  passportNumber: { regex: /^[A-Z]{1,2}[0-9]{7}$/, message: 'Passport: A1234567 or AB1234567' },
};

function validate(field, value) {
  if (!value || !value.trim()) return null;
  const v = VALIDATORS[field];
  return v && !v.regex.test(value.trim()) ? v.message : null;
}

// ── StaffDashboard ki date/time logic ────────────────────────────────────────
function isPastDate(dateStr, todayStr) {
  return dateStr < todayStr;
}

function isPastTime(timeStr, currentTime) {
  return timeStr <= currentTime;
}

function isArrivalBeforeDeparture(arrDate, depDate) {
  return arrDate < depDate;
}

function isSameDayArrivalBeforeDeparture(arrDate, depDate, arrTime, depTime) {
  return arrDate === depDate && arrTime <= depTime;
}

// ── Email Tests ───────────────────────────────────────────────────────────────
describe('Email Validation', () => {

  test('Valid email pass hoti hai', () => {
    expect(validate('email', 'rahul@gmail.com')).toBeNull();
  });

  test('Email without @ fail hoti hai', () => {
    expect(validate('email', 'rahulgmail.com')).toBeTruthy();
  });

  test('Email without domain fail hoti hai', () => {
    expect(validate('email', 'rahul@')).toBeTruthy();
  });

  test('Empty email null return karta hai', () => {
    expect(validate('email', '')).toBeNull();
  });

  test('Email with spaces fail hoti hai', () => {
    expect(validate('email', 'rahul @gmail.com')).toBeTruthy();
  });

});

// ── Password Tests ────────────────────────────────────────────────────────────
describe('Password Validation', () => {

  test('Strong password pass hota hai', () => {
    expect(validate('password', 'Rahul@123')).toBeNull();
  });

  test('Password without uppercase fail hota hai', () => {
    expect(validate('password', 'rahul@123')).toBeTruthy();
  });

  test('Password without special char fail hota hai', () => {
    expect(validate('password', 'Rahul1234')).toBeTruthy();
  });

  test('Password under 8 chars fail hota hai', () => {
    expect(validate('password', 'Ra@1')).toBeTruthy();
  });

  test('Password without number fail hota hai', () => {
    expect(validate('password', 'Rahul@abc')).toBeTruthy();
  });

  test('Empty password null return karta hai', () => {
    expect(validate('password', '')).toBeNull();
  });

});

// ── Phone Tests ───────────────────────────────────────────────────────────────
describe('Phone Validation', () => {

  test('Valid Indian mobile number pass hota hai', () => {
    expect(validate('phone', '9876543210')).toBeNull();
  });

  test('Number starting with 5 fail hota hai', () => {
    expect(validate('phone', '5876543210')).toBeTruthy();
  });

  test('11 digit number fail hota hai', () => {
    expect(validate('phone', '98765432101')).toBeTruthy();
  });

  test('Number starting with 6 pass hota hai', () => {
    expect(validate('phone', '6543219870')).toBeNull();
  });

  test('Empty phone null return karta hai', () => {
    expect(validate('phone', '')).toBeNull();
  });

});

// ── Passport Tests ────────────────────────────────────────────────────────────
describe('Passport Number Validation', () => {

  test('Valid passport A1234567 pass hota hai', () => {
    expect(validate('passportNumber', 'A1234567')).toBeNull();
  });

  test('Valid passport AB1234567 pass hota hai', () => {
    expect(validate('passportNumber', 'AB1234567')).toBeNull();
  });

  test('Lowercase passport fail hota hai', () => {
    expect(validate('passportNumber', 'a1234567')).toBeTruthy();
  });

  test('Only numbers fail hota hai', () => {
    expect(validate('passportNumber', '12345678')).toBeTruthy();
  });

  test('Empty passport null return karta hai', () => {
    expect(validate('passportNumber', '')).toBeNull();
  });

});

// ── Full Name Tests ───────────────────────────────────────────────────────────
describe('Full Name Validation', () => {

  test('Valid name pass hota hai', () => {
    expect(validate('fullName', 'Rahul Sharma')).toBeNull();
  });

  test('Single character name fail hota hai', () => {
    expect(validate('fullName', 'R')).toBeTruthy();
  });

  test('Name with numbers fail hota hai', () => {
    expect(validate('fullName', 'Rahul123')).toBeTruthy();
  });

  test('Empty name null return karta hai', () => {
    expect(validate('fullName', '')).toBeNull();
  });

});

// ── StaffDashboard Date/Time Tests ────────────────────────────────────────────
describe('Flight Date and Time Validation', () => {

  test('Past date reject hoti hai', () => {
    expect(isPastDate('2023-01-01', '2025-05-01')).toBe(true);
  });

  test('Future date accept hoti hai', () => {
    expect(isPastDate('2026-12-31', '2025-05-01')).toBe(false);
  });

  test('Aaj ki date accept hoti hai', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(isPastDate(today, today)).toBe(false);
  });

  test('Past time reject hota hai for today', () => {
    expect(isPastTime('08:00', '10:00')).toBe(true);
  });

  test('Future time accept hota hai for today', () => {
    expect(isPastTime('18:00', '10:00')).toBe(false);
  });

  test('Arrival date departure date se pehle reject hoti hai', () => {
    expect(isArrivalBeforeDeparture('2025-05-01', '2025-05-10')).toBe(true);
  });

  test('Arrival date departure ke baad accept hoti hai', () => {
    expect(isArrivalBeforeDeparture('2025-05-15', '2025-05-10')).toBe(false);
  });

  test('Same day mein arrival time departure se pehle reject hota hai', () => {
    expect(isSameDayArrivalBeforeDeparture('2025-05-10', '2025-05-10', '08:00', '10:00')).toBe(true);
  });

  test('Same day mein arrival time departure ke baad accept hota hai', () => {
    expect(isSameDayArrivalBeforeDeparture('2025-05-10', '2025-05-10', '14:00', '10:00')).toBe(false);
  });

  test('Different day flights same time ke sath accept hote hain', () => {
    expect(isSameDayArrivalBeforeDeparture('2025-05-11', '2025-05-10', '08:00', '22:00')).toBe(false);
  });

});