import { useEffect, useRef } from 'react';
import Icon from '../../../shared/components/Icon';
import { statusMeta } from '../lib/status';
import StatusBadge from './StatusBadge';
import styles from './TicketDrawer.module.css';

export default function TicketDrawer({ mode, ticket, saving, error, onClose, onCreate, onAdvance }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (mode === 'create') titleRef.current?.focus();
  }, [mode]);

  if (!mode) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onCreate({ title: form.get('title'), description: form.get('description') });
  };

  const meta = ticket ? statusMeta[ticket.status] : null;

  return (
    <>
      <button className={styles.backdrop} type="button" aria-label="Close panel" onClick={onClose} />
      <aside className={styles.drawer} aria-label={mode === 'create' ? 'Create a ticket' : 'Ticket details'}>
        <header className={styles.header}>
          <h2>{mode === 'create' ? 'Create a ticket' : 'Ticket details'}</h2>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close panel"><Icon name="close" /></button>
        </header>

        {mode === 'create' ? (
          <form id="create-ticket-form" className={styles.form} onSubmit={handleSubmit}>
            <label>
              Title <span aria-hidden="true">*</span>
              <input ref={titleRef} name="title" type="text" maxLength="160" placeholder="Enter a title" required />
            </label>
            <label>
              Description
              <textarea name="description" rows="8" maxLength="5000" placeholder="Describe the issue or request…" />
            </label>
            {error ? <p className={styles.error} role="alert">{error}</p> : null}
          </form>
        ) : (
          <div className={styles.detail}>
            {ticket ? (
              <>
                <StatusBadge status={ticket.status} />
                <h3>{ticket.title}</h3>
                <section>
                  <h4>Description</h4>
                  <p>{ticket.description || 'No description was provided.'}</p>
                </section>
                <dl>
                  <div><dt>Created</dt><dd>{new Date(ticket.created_at).toLocaleString()}</dd></div>
                  <div><dt>Last updated</dt><dd>{new Date(ticket.updated_at).toLocaleString()}</dd></div>
                </dl>
                {error ? <p className={styles.error} role="alert">{error}</p> : null}
              </>
            ) : <p className={styles.loading}>Loading ticket details…</p>}
          </div>
        )}

        <footer className={styles.footer}>
          <button type="button" className={styles.secondary} onClick={onClose}>Cancel</button>
          {mode === 'create' ? (
            <button type="submit" form="create-ticket-form" className={styles.primary} disabled={saving}>
              {saving ? 'Creating…' : 'Create ticket'}
            </button>
          ) : meta?.next ? (
            <button type="button" className={styles.primary} disabled={saving || !ticket} onClick={() => onAdvance(ticket.id, meta.next)}>
              {saving ? 'Updating…' : meta.action}
            </button>
          ) : (
            <span className={styles.closedNote}><Icon name="check" size={18} /> Ticket closed</span>
          )}
        </footer>
      </aside>
    </>
  );
}

