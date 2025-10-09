import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

const App = () => {
  const { user, loading, registerCustomer, loginCustomer, logoutCustomer } = useAuth();
  const [mode, setMode] = useState('login');

  if (loading) {
    return (
      <main className="container">
        <div className="card">
          <h1>Secure International Payments Portal</h1>
          <p>Loading…</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="container">
        <Dashboard user={user} onLogout={logoutCustomer} />
      </main>
    );
  }

  return (
    <main className="container">
      <section className="card header-card">
        <h1>Secure International Payments Portal</h1>
        <p>Register to capture international payments or sign in with your verified details.</p>
        <div className="toggle">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
      </section>

      {mode === 'register'
        ? <RegistrationForm onRegister={registerCustomer} />
        : <LoginForm onLogin={loginCustomer} />}
    </main>
  );
};

export default App;
