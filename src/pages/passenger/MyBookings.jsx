import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentApi } from '../../api/api';
import './MyBookings.css';

export default function MyBookings() {
  const { userEmail } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelMsg, setCancelMsg] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  async function fetchMyBookings() {
    try {
      const res = await paymentApi.getByUser(userEmail);
      setPayments(res.data);
    } catch (err) {
      // empty state dikhao
    } finally {
      setLoading(false);
    }
  }

  async function handleRefund(bookingId) {
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    try {
      await paymentApi.refund(bookingId);
      setCancelMsg('Booking cancelled. Refund will be processed in 5-7 working days.');
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking');
    }
  }

  function getStatusBadge(status) {
    const map = {
      PAID:     'badge badge-success',
      REFUNDED: 'badge badge-warning',
      PENDING:  'badge badge-blue',
      FAILED:   'badge badge-danger',
    };
    return map[status] || 'badge badge-blue';
  }

  if (loading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="page-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>{payments.length} booking{payments.length !== 1 ? 's' : ''} found</p>
      </div>

      {cancelMsg && (
        <div className="alert-success" style={{ marginBottom: '20px' }}>{cancelMsg}</div>
      )}

      {payments.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🎫</div>
          <h3>No bookings yet</h3>
          <p>Your flight bookings will appear here</p>
        </div>
      ) : (
        <div className="bookings-list">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="booking-card card">
              <div className="booking-top">
                <div className="booking-id">
                  <span className="id-label">Booking ID</span>
                  <span className="id-value">#{payment.bookingId}</span>
                </div>
                <span className={getStatusBadge(payment.status)}>
                  {payment.status}
                </span>
              </div>

              <div className="booking-info">
                <div className="info-item">
                  <span className="info-label">Amount Paid</span>
                  <span className="info-value">₹{payment.amount?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Mode</span>
                  <span className="info-value">{payment.paymentMode}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value txn-id">{payment.transactionId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Paid On</span>
                  <span className="info-value">
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-IN') : '-'}
                  </span>
                </div>
              </div>

              {payment.status === 'PAID' && (
                <div className="booking-actions">
                  <button
                    className="btn-danger"
                    onClick={() => handleRefund(payment.bookingId)}
                  >
                    Cancel & Refund
                  </button>
                </div>
              )}

              {payment.status === 'REFUNDED' && (
                <div className="refund-info">
                  ✓ Refund of ₹{payment.refundAmount?.toLocaleString()} initiated
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
