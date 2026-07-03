import { useState } from 'react';
import Icon from '../../../shared/components/Icon';
import { useAuthStore } from '../store/authStore';
import styles from './AuthForm.module.css';

export default function AuthForm() {
  const [mode, setMode] = useState('login');
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const notice = useAuthStore((state) => state.notice);
  const submit = useAuthStore((state) => state.submit);
  const clearFeedback = useAuthStore((state) => state.clearFeedback);

  const changeMode = (nextMode) => {
    setMode(nextMode);
    clearFeedback();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await submit(mode, {
      email: data.get('email'),
      password: data.get('password'),
    });
    if (result?.needsLogin) setMode('login');
  };

  return (
    <div className={styles.panel}>
      <div className={styles.brand} aria-label="TicketFlow">
        <span className={styles.brandMark}><Icon name="ticket" size={22} /></span>
        <span>TicketFlow</span>
      </div>

      <div className={styles.heading}>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p>{mode === 'login' ? 'Sign in to continue to your tickets.' : 'Start a focused workspace for your tickets.'}</p>
      </div>

      <div className={styles.modeSwitch} aria-label="Authentication mode">
        <button type="button" className={mode === 'login' ? styles.activeMode : ''} onClick={() => changeMode('login')}>Sign in</button>
        <button type="button" className={mode === 'register' ? styles.activeMode : ''} onClick={() => changeMode('register')}>Register</button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="At least 6 characters"
            minLength="6"
            required
          />
        </label>

        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {notice ? <p className={styles.notice} role="status">{notice}</p> : null}

        <button className={styles.submit} type="submit" disabled={loading}>
          <span>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</span>
          {!loading ? <Icon name="arrow" size={18} /> : null}
        </button>
      </form>

      <p className={styles.footnote}>Your identity and password are securely managed by Supabase Auth.</p>
    </div>
  );
}

