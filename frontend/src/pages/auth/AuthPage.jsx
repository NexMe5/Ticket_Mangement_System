import AuthForm from '../../features/auth/components/AuthForm';
import Icon from '../../shared/components/Icon';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  return (
    <main className={styles.page}>
      <section className={styles.story} aria-label="TicketFlow overview">
        <div className={styles.storyContent}>
          <Icon name="ticket" size={40} strokeWidth={1.5} />
          <h2>A calmer way to move work forward.</h2>
          <p>Create the issue, follow its progress, and close it with confidence. Your workspace stays private by design.</p>
        </div>
        <p className={styles.security}>JWT authentication · Ownership enforced · Focused status flow</p>
      </section>
      <section className={styles.formSide}>
        <AuthForm />
      </section>
    </main>
  );
}

