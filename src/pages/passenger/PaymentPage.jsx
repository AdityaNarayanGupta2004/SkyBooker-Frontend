import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './PaymentPage.css';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  const amount = parseFloat(searchParams.get('amount') || 4500);

  const [paymentMode, setPaymentMode] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const taxes = Math.round(amount * 0.18);
  const total = amount + taxes;

  async function handlePay() {
    setLoading(true);
    setError('');

    try {
      await paymentApi.pay({
        bookingId: parseInt(bookingId),
        userEmail,
        amount: total,
        paymentMode,
      });

      navigate(`/booking-confirm/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const paymentModes = [
    { value: 'UPI',        label: 'UPI',         icon: '📱' },
    { value: 'CARD',       label: 'Credit/Debit Card', icon: '💳' },
    { value: 'NETBANKING', label: 'Net Banking',  icon: '🏦' },
    { value: 'WALLET',     label: 'Wallet',       icon: '👛' },
  ];

  return (
    <div className="page-container">
      <div className="payment-layout">

        {/* Left - Payment Options */}
        <div className="payment-left">
          <div className="card">
            <h2>Choose Payment Method</h2>
            <p className="payment-subtitle">Secure payment powered by SkyBooker</p>

            <div className="payment-modes">
              {paymentModes.map(mode => (
                <div
                  key={mode.value}
                  className={`payment-mode ${paymentMode === mode.value ? 'active' : ''}`}
                  onClick={() => setPaymentMode(mode.value)}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <span className="mode-label">{mode.label}</span>
                  <span className="mode-check">{paymentMode === mode.value ? '✓' : ''}</span>
                </div>
              ))}
            </div>

            {error && <div className="alert-error" style={{ marginTop: '16px' }}>{error}</div>}

            <button
              className="btn-primary pay-btn"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
            </button>

            <p className="secure-note">🔒 Your payment is 100% secure and encrypted</p>
          </div>
        </div>

        {/* Right - Fare Summary */}
        <div className="payment-right">
          <div className="card fare-card">
            <h3>Fare Summary</h3>

            <div className="fare-row">
              <span>Base Fare</span>
              <span>₹{amount.toLocaleString()}</span>
            </div>
            <div className="fare-row">
              <span>GST (18%)</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
            <div className="fare-row">
              <span>Convenience Fee</span>
              <span className="free">FREE</span>
            </div>
            <div className="fare-divider"></div>
            <div className="fare-row total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="booking-ref">
              <span>Booking ID</span>
              <span className="ref-id">#{bookingId}</span>
            </div>
          </div>

          <div className="card info-card">
            <h4>Important Information</h4>
            <ul>
              <li>Cancellation charges may apply</li>
              <li>Refund processed in 5-7 working days</li>
              <li>E-ticket will be sent to your email</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
