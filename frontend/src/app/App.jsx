import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import styles from './App.module.css';

const AuthPage = lazy(() => import('../pages/auth/AuthPage'));
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const TicketsPage = lazy(() => import('../pages/tickets/TicketsPage'));

function LoadingScreen() {
  return (
    <div className={styles.loading} role="status">
      <span className={styles.loadingMark} aria-hidden="true" />
      <span>Loading TicketFlow…</span>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={token ? <Navigate to="/tickets" replace /> : <AuthPage />} />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
