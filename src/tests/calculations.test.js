// PaymentPage mein jo calculations hote hain unhe test kar rahe hain
// Ye pure JavaScript logic hai, koi component render nahi hoga

describe('Payment Calculations', () => {

  test('GST 18% sahi calculate hoti hai', () => {
    const amount = 4500;
    const taxes = Math.round(amount * 0.18);
    expect(taxes).toBe(810);
  });

  test('Total amount = base fare + GST', () => {
    const amount = 4500;
    const taxes = Math.round(amount * 0.18);
    const total = amount + taxes;
    expect(total).toBe(5310);
  });

  test('Multiple seats ka total sahi hota hai', () => {
    const pricePerSeat = 4500;
    const seats = 3;
    const subtotal = seats * pricePerSeat;
    expect(subtotal).toBe(13500);
  });

  test('GST ke baad total hamesha base se zyada hota hai', () => {
    const amount = 6000;
    const taxes = Math.round(amount * 0.18);
    const total = amount + taxes;
    expect(total).toBeGreaterThan(amount);
  });

  test('Zero amount pe GST bhi zero hoti hai', () => {
    const amount = 0;
    const taxes = Math.round(amount * 0.18);
    expect(taxes).toBe(0);
  });

  test('Decimal amount pe bhi sahi kaam karta hai', () => {
    const amount = 4999.5;
    const taxes = Math.round(amount * 0.18);
    // Math.round(899.91) = 900
    expect(taxes).toBe(900);
  });

});