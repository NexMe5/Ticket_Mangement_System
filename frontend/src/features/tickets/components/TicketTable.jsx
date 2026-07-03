import Icon from '../../../shared/components/Icon';
import { statusMeta } from '../lib/status';
import StatusBadge from './StatusBadge';
import styles from './TicketTable.module.css';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
});

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '—' : dateFormatter.format(date);
}

export default function TicketTable({ tickets, loading, onSelect, onAdvance, saving }) {
  if (loading) {
    return (
      <div className={styles.loading} role="status">
        <span /><span /><span />
        <p>Loading your tickets…</p>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}><Icon name="inbox" size={26} /></span>
        <h2>No tickets found</h2>
        <p>Try another filter or create a ticket to get started.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
            <th><span className="sr-only">Action</span></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const meta = statusMeta[ticket.status];
            return (
              <tr key={ticket.id}>
                <td>
                  <button className={styles.ticketLink} type="button" onClick={() => onSelect(ticket.id)}>
                    <Icon name="ticket" size={19} />
                    <span>
                      <strong>{ticket.title}</strong>
                      <small>{ticket.description || 'No description'}</small>
                    </span>
                  </button>
                </td>
                <td><StatusBadge status={ticket.status} /></td>
                <td><time dateTime={ticket.created_at}>{formatDate(ticket.created_at)}</time></td>
                <td><time dateTime={ticket.updated_at}>{formatDate(ticket.updated_at)}</time></td>
                <td className={styles.actionCell}>
                  {meta?.next ? (
                    <button
                      type="button"
                      className={styles.rowAction}
                      disabled={saving}
                      onClick={() => onAdvance(ticket.id, meta.next)}
                      aria-label={`${meta.action}: ${ticket.title}`}
                    >
                      <Icon name="chevron" size={17} />
                    </button>
                  ) : <Icon name="check" size={17} className={styles.complete} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

