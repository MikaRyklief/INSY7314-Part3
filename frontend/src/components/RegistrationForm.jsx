import { useState } from 'react';
import PropTypes from 'prop-types';
import { validateRegistrationPayload } from '../utils/validators.js';

const initialFormState = {
  fullName: '',
  idNumber: '',
  accountNumber: '',
  password: ''
};

const RegistrationForm = ({ onRegister }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setStatus('');

    const validationErrors = validateRegistrationPayload(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const result = await onRegister(form);
    if (!result.success) {
      setErrors(result.errors || ['Registration failed.']);
    } else {
      setStatus('Registration successful! You are now signed in.');
      setForm(initialFormState);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Customer Registration</h2>
      <p className="helper-text">
        All details are verified against your bank records. Your ID number will act as your username.
      </p>

      <label htmlFor="fullName">Full Name</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        autoComplete="name"
        value={form.fullName}
        onChange={handleChange}
        required
        pattern="^[A-Za-z ,.'-]{2,60}$"
        placeholder="e.g. Nomsa Dlamini"
      />

      <label htmlFor="idNumber">South African ID Number</label>
      <input
        id="idNumber"
        name="idNumber"
        type="text"
        inputMode="numeric"
        value={form.idNumber}
        onChange={handleChange}
        required
        pattern="^\d{13}$"
        placeholder="13 digit ID number"
      />

      <label htmlFor="accountNumber">Account Number</label>
      <input
        id="accountNumber"
        name="accountNumber"
        type="text"
        inputMode="numeric"
        value={form.accountNumber}
        onChange={handleChange}
        required
        pattern="^\d{10,20}$"
        placeholder="10-20 digit account number"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$"
        placeholder="Minimum 12 characters"
      />
      <p className="helper-text">
        Password must include upper and lower case letters, a number, a special character, and be at least 12 characters long.
      </p>

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
        {loading ? 'Registering…' : 'Register'}
      </button>
    </form>
  );
};

RegistrationForm.propTypes = {
  onRegister: PropTypes.func.isRequired
};

export default RegistrationForm;
