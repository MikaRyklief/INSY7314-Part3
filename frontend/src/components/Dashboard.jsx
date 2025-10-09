import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient, { fetchCsrfToken } from '../api/client.js';
import PaymentForm from './PaymentForm.jsx';
import PaymentList from './PaymentList.jsx';

const DEFAULT_PROVIDERS = [{ id: 'SWIFT', name: 'SWIFT' }];

const Dashboard = ({ user, onLogout }) => {
  const [providers, setProviders] = useState(DEFAULT_PROVIDERS);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCsrfToken();
        const [providersResponse, paymentsResponse] = await Promise.all([
          apiClient.get('/payments/providers'),
          apiClient.get('/payments')
        ]);
        setProviders(providersResponse.data?.providers || DEFAULT_PROVIDERS);
        setPayments(paymentsResponse.data?.payments || []);
      } catch (err) {
        setError('We were unable to load your payment data securely.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreatePayment = async (payload) => {
    try {
      await fetchCsrfToken();
      const response = await apiClient.post('/payments', payload);
      if (response.data?.payment) {
        setPayments((prev) => [response.data.payment, ...prev]);
      }
      return { success: true };
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      const message = err.response?.data?.message || 'Unable to capture payment.';
      return { success: false, errors: serverErrors || [message] };
    }
  };

  const handleLogout = async () => {
    await onLogout();
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Loading secure dashboard…</h2>
      </div>
    );
  }

  return (
    <>
      <header className="toolbar">
        <div>
          <h1>International Payments Portal</h1>
          <p>Secure customer view</p>
        </div>
        <div className="identity">
          <p>{user.fullName}</p>
          <p>Account: {user.accountNumber}</p>
          <button type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {error && (
        <div className="error-box" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid">
        <PaymentForm onCreatePayment={handleCreatePayment} providers={providers} />
        <PaymentList payments={payments} />
      </div>
    </>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired
  }).isRequired,
  onLogout: PropTypes.func.isRequired
};

export default Dashboard;
