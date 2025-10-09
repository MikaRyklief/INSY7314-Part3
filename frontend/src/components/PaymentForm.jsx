import { useState } from 'react';
import PropTypes from 'prop-types';
import { validatePaymentPayload } from '../utils/validators.js';

const initialState = {
  amount: '',
  currency: 'USD',
  provider: 'SWIFT',
  beneficiaryAccount: '',
  swiftCode: ''
};

const PaymentForm = ({ onCreatePayment, providers }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setStatus('');

    const validationErrors = validatePaymentPayload(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await onCreatePayment({
      ...form,
      currency: form.currency.toUpperCase(),
      provider: form.provider.toUpperCase(),
      beneficiaryAccount: form.beneficiaryAccount.toUpperCase(),
      swiftCode: form.swiftCode.toUpperCase()
    });

    if (!result.success) {
      setErrors(result.errors || ['Payment could not be captured.']);
    } else {
      setStatus('Payment captured securely and awaiting SWIFT processing.');
      setForm(initialState);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Capture International Payment</h2>

      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        name="amount"
        type="number"
        min="0"
        step="0.01"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <label htmlFor="currency">Currency (ISO 4217)</label>
      <input
        id="currency"
        name="currency"
        type="text"
        value={form.currency}
        onChange={handleChange}
        required
        placeholder="e.g. USD"
        pattern="^[A-Z]{3}$"
      />

      <label htmlFor="provider">Provider</label>
      <select
        id="provider"
        name="provider"
        value={form.provider}
        onChange={handleChange}
      >
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>{provider.name}</option>
        ))}
      </select>

      <label htmlFor="beneficiaryAccount">Beneficiary Account</label>
      <input
        id="beneficiaryAccount"
        name="beneficiaryAccount"
        type="text"
        value={form.beneficiaryAccount}
        onChange={handleChange}
        required
        placeholder="Beneficiary account or IBAN"
        pattern="^[A-Z0-9]{8,34}$"
      />

      <label htmlFor="swiftCode">SWIFT Code</label>
      <input
        id="swiftCode"
        name="swiftCode"
        type="text"
        value={form.swiftCode}
        onChange={handleChange}
        required
        placeholder="8 or 11 character SWIFT"
        pattern="^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$"
      />

      {errors.length > 0 && (
        <div className="error-box" role="alert">
          {errors.map((error) => <p key={error}>{error}</p>)}
        </div>
      )}

      {status && (
        <div className="success-box" role="status">
          <p>{status}</p>
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Pay Now'}
      </button>
    </form>
  );
};

PaymentForm.propTypes = {
  onCreatePayment: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
};

export default PaymentForm;
