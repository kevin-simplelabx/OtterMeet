import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { api } from '../api.js';
import { Button } from '../ds/index.js';

function AuthShell({ title, intro, children, footer }) {
  return (
    <div className="auth-page">
      <header className="wrap site-head">
        <a href="/" className="wordmark">OtterMeet</a>
      </header>
      <main className="auth-main">
        <div className="card auth-card">
          <div className="stack" style={{ gap: 8 }}>
            <span className="eyebrow muted">Host portal</span>
            <h1 className="heading-2 m0">{title}</h1>
            <p className="body m0 muted">{intro}</p>
          </div>
          {children}
          <p className="body-sm m0 muted" style={{ textAlign: 'center' }}>{footer}</p>
        </div>
      </main>
    </div>
  );
}

function useAuthForm(path, fields) {
  const { setHost } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(fields);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const bind = (name) => ({
    name,
    value: values[name],
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { host } = await api(path, { method: 'POST', body: values });
      setHost(host);
      navigate(location.state?.from || '/portal', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return { bind, error, busy, onSubmit };
}

export function Login() {
  const { bind, error, busy, onSubmit } = useAuthForm('/auth/login', { email: '', password: '' });
  return (
    <AuthShell
      title="Welcome back."
      intro="Log in to manage your sessions."
      footer={<>New to OtterMeet? <Link to="/signup">Create a host account</Link></>}
    >
      <form className="stack" style={{ gap: 16 }} onSubmit={onSubmit} noValidate>
        {error && <div role="alert" className="alert body-sm">{error}</div>}
        <label className="field">
          <span className="label">Email</span>
          <input className="input" type="email" autoComplete="email" required {...bind('email')} />
        </label>
        <label className="field">
          <span className="label">Password</span>
          <input className="input" type="password" autoComplete="current-password" required {...bind('password')} />
        </label>
        <Button type="submit" variant="action" block disabled={busy}>{busy ? 'Logging In…' : 'Log In'}</Button>
      </form>
    </AuthShell>
  );
}

export function Signup() {
  const { bind, error, busy, onSubmit } = useAuthForm('/auth/signup', { name: '', email: '', password: '' });
  return (
    <AuthShell
      title="Start hosting."
      intro="Create your host account and plan your first session in minutes."
      footer={<>Already hosting? <Link to="/login">Log in</Link></>}
    >
      <form className="stack" style={{ gap: 16 }} onSubmit={onSubmit} noValidate>
        {error && <div role="alert" className="alert body-sm">{error}</div>}
        <label className="field">
          <span className="label">Your name</span>
          <input className="input" autoComplete="name" required {...bind('name')} />
        </label>
        <label className="field">
          <span className="label">Email</span>
          <input className="input" type="email" autoComplete="email" required {...bind('email')} />
        </label>
        <label className="field">
          <span className="label">Password</span>
          <input className="input" type="password" autoComplete="new-password" minLength={8} required {...bind('password')} />
          <span className="hint body-sm">At least 8 characters.</span>
        </label>
        <Button type="submit" variant="action" block disabled={busy}>{busy ? 'Creating Account…' : 'Create Host Account'}</Button>
      </form>
    </AuthShell>
  );
}
