import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../features/auth/store/authStore';
import TicketDrawer from '../../features/tickets/components/TicketDrawer';
import TicketTable from '../../features/tickets/components/TicketTable';
import { useTicketStore } from '../../features/tickets/store/ticketStore';
import Icon from '../../shared/components/Icon';
import styles from './TicketsPage.module.css';

const filters = [
  ['all', 'All'],
  ['open', 'Open'],
  ['in_progress', 'In progress'],
  ['closed', 'Closed'],
];

export default function TicketsPage() {
  const [navOpen, setNavOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const tickets = useTicketStore((state) => state.tickets);
  const selectedTicket = useTicketStore((state) => state.selectedTicket);
  const loading = useTicketStore((state) => state.loading);
  const saving = useTicketStore((state) => state.saving);
  const error = useTicketStore((state) => state.error);
  const filter = useTicketStore((state) => state.filter);
  const search = useTicketStore((state) => state.search);
  const drawer = useTicketStore((state) => state.drawer);
  const fetchTickets = useTicketStore((state) => state.fetchTickets);
  const setFilter = useTicketStore((state) => state.setFilter);
  const setSearch = useTicketStore((state) => state.setSearch);
  const openCreate = useTicketStore((state) => state.openCreate);
  const closeDrawer = useTicketStore((state) => state.closeDrawer);
  const createTicket = useTicketStore((state) => state.createTicket);
  const selectTicket = useTicketStore((state) => state.selectTicket);
  const advanceStatus = useTicketStore((state) => state.advanceStatus);

  useEffect(() => {
    fetchTickets(token);
  }, [fetchTickets, token]);

  const visibleTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = filter === 'all' || ticket.status === filter;
      const matchesSearch = !query || `${ticket.title} ${ticket.description}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [tickets, filter, search]);

  const displayName = user?.email?.split('@')[0] || 'Account';

  return (
    <div className={`${styles.shell} ${drawer ? styles.drawerOpen : ''}`}>
      <aside className={`${styles.sidebar} ${navOpen ? styles.navOpen : ''}`}>
        <div className={styles.logo}><span><Icon name="ticket" size={21} /></span><strong>TicketFlow</strong></div>
        <nav aria-label="Primary">
          <a href="#tickets" className={styles.activeNav}><Icon name="ticket" size={19} /><span>My tickets</span></a>
        </nav>
        <button type="button" className={styles.signOut} onClick={logout}><Icon name="logout" size={19} /><span>Sign out</span></button>
      </aside>

      <main className={styles.main} id="tickets">
        <header className={styles.topbar}>
          <button className={styles.menuButton} type="button" onClick={() => setNavOpen((value) => !value)} aria-label="Toggle navigation"><Icon name="menu" /></button>
          <span>My tickets</span>
          <div className={styles.user}><span className={styles.avatar}><Icon name="user" size={18} /></span><span>{displayName}</span></div>
        </header>

        <section className={styles.workspace}>
          <div className={styles.titleRow}>
            <div>
              <h1>My tickets</h1>
              <p>Keep each issue moving through a clear, dependable flow.</p>
            </div>
            <button type="button" className={styles.newButton} onClick={openCreate}><Icon name="plus" size={19} />New ticket</button>
          </div>

          <div className={styles.filters} role="tablist" aria-label="Filter tickets">
            {filters.map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={filter === value}
                className={filter === value ? styles.activeFilter : ''}
                onClick={() => setFilter(value)}
              >
                {label}<span>{value === 'all' ? tickets.length : tickets.filter((ticket) => ticket.status === value).length}</span>
              </button>
            ))}
          </div>

          <div className={styles.toolbar}>
            <label className={styles.search}>
              <span className="sr-only">Search tickets</span>
              <Icon name="search" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tickets" />
            </label>
            <span className={styles.resultCount}>{visibleTickets.length} {visibleTickets.length === 1 ? 'ticket' : 'tickets'}</span>
          </div>

          {error && !drawer ? <div className={styles.error} role="alert">{error}<button type="button" onClick={() => fetchTickets(token)}>Try again</button></div> : null}

          <TicketTable
            tickets={visibleTickets}
            loading={loading}
            saving={saving}
            onSelect={(id) => selectTicket(token, id)}
            onAdvance={(id, status) => advanceStatus(token, id, status)}
          />
        </section>
      </main>

      <TicketDrawer
        mode={drawer}
        ticket={selectedTicket}
        saving={saving}
        error={drawer ? error : null}
        onClose={closeDrawer}
        onCreate={(payload) => createTicket(token, payload)}
        onAdvance={(id, status) => advanceStatus(token, id, status)}
      />
    </div>
  );
}

