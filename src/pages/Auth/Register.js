import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]   = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/profile/edit');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-bg-blur b1" /><div className="auth-bg-blur b2" />

      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-dot" />
          Urban<em>Yoga</em>
        </Link>

        <h1 className="auth-title">Create your account 🧘</h1>
        <p className="auth-sub">Start your yoga journey today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Username</label>
            <input
              name="username" type="text" placeholder="yogimaster"
              value={form.username} onChange={handleChange} required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              name="password" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required
            />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              name="confirm" type="password" placeholder="Repeat password"
              value={form.confirm} onChange={handleChange} required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
