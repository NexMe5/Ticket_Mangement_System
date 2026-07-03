import { statusMeta } from '../lib/status';
import styles from './StatusBadge.module.css';

export default function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[status] || ''}`}>
      <span className={styles.dot} aria-hidden="true" />
      {statusMeta[status]?.label || status}
    </span>
  );
}

