import { Link } from 'react-router-dom';
import Icon from '../../shared/components/Icon';
import styles from './LandingPage.module.css';

const features = [
  { icon: 'inbox', title: 'Shared inbox', text: 'Capture every request in one calm place, so nothing slips through the cracks.' },
  { icon: 'users', title: 'Clear ownership', text: 'Assign an owner, balance workloads, and make the next action obvious.' },
  { icon: 'activity', title: 'Live status', text: 'Keep customers and teammates informed with a status everyone can trust.' },
  { icon: 'bolt', title: 'Fast resolution', text: 'Give your team the context they need to solve issues without the back-and-forth.' },
];

const previewTickets = [
  { id: '#1248', title: "Can't access my account", requester: 'Ava Johnson', priority: 'High', owner: 'Marcus Lee', status: 'Open' },
  { id: '#1247', title: 'Payment failure on checkout', requester: 'Noah Smith', priority: 'High', owner: 'Priya Shah', status: 'In progress' },
  { id: '#1246', title: 'Feature request: bulk export', requester: 'Liam Brown', priority: 'Medium', owner: 'Taylor Kim', status: 'Open' },
  { id: '#1245', title: 'Slack integration is not working', requester: 'Olivia Davis', priority: 'Medium', owner: 'Marcus Lee', status: 'In progress' },
  { id: '#1244', title: 'How do I change my plan?', requester: 'Ethan Wilson', priority: 'Low', owner: 'Jordan Lee', status: 'Pending' },
];

function Brand({ inverse = false }) {
  return (
    <span className={`${styles.brand} ${inverse ? styles.brandInverse : ''}`}>
      <span className={styles.brandMark}><Icon name="ticket" size={18} strokeWidth={2} /></span>
      <strong>Ticket Flow</strong>
    </span>
  );
}

function ProductPreview() {
  return (
    <div className={styles.preview} aria-label="Ticket Flow product preview">
      <div className={styles.browserBar}>
        <span className={styles.browserDots}><i /><i /><i /></span>
        <span className={styles.browserAddress}>app.ticketflow.dev/tickets</span>
      </div>
      <div className={styles.previewBody}>
        <aside className={styles.previewSidebar}>
          <Brand inverse />
          <div className={styles.previewNav}>
            <span className={styles.previewNavActive}><Icon name="inbox" size={15} />Inbox <b>12</b></span>
            <span><Icon name="ticket" size={15} />My tickets <b>5</b></span>
            <span><Icon name="user" size={15} />Mentions <b>2</b></span>
            <span><Icon name="activity" size={15} />Reports</span>
          </div>
          <div className={styles.previewPerson}><span>JL</span><div><strong>Jordan Lee</strong><small>Support team</small></div></div>
        </aside>
        <section className={styles.previewWorkspace}>
          <div className={styles.previewToolbar}>
            <strong>Inbox</strong>
            <label><Icon name="search" size={14} /><span>Search tickets...</span></label>
            <button type="button">New ticket</button>
          </div>
          <div className={styles.previewTable}>
            <div className={styles.previewHead}><span>Ticket</span><span>Requester</span><span>Priority</span><span>Assignee</span><span>Status</span></div>
            {previewTickets.map((ticket) => (
              <div className={styles.previewRow} key={ticket.id}>
                <span><small>{ticket.id}</small><strong>{ticket.title}</strong></span>
                <span>{ticket.requester}</span>
                <span className={styles[`priority${ticket.priority.replace(' ', '')}`]}>{ticket.priority}</span>
                <span>{ticket.owner}</span>
                <span><em className={styles[`status${ticket.status.replace(' ', '')}`]}>{ticket.status}</em></span>
              </div>
            ))}
          </div>
        </section>
        <aside className={styles.previewDrawer}>
          <div className={styles.drawerTitle}><span><small>#1248</small><strong>Can't access my account</strong></span><Icon name="close" size={16} /></div>
          <span className={styles.drawerStatus}>Open</span>
          <dl><div><dt>Requester</dt><dd>Ava Johnson</dd></div><div><dt>Priority</dt><dd><i /> High</dd></div><div><dt>Assignee</dt><dd>Marcus Lee</dd></div></dl>
          <div className={styles.activityTitle}>Activity</div>
          <div className={styles.message}><b>AJ</b><p><strong>Ava Johnson</strong><small>10:24 AM</small><span>I’m getting a 403 error when I try to log in.</span></p></div>
          <div className={styles.message}><b>ML</b><p><strong>Marcus Lee</strong><small>10:31 AM</small><span>Thanks — I’m looking into this now.</span></p></div>
          <div className={styles.reply}>Write a reply… <Icon name="arrow" size={14} /></div>
        </aside>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <Link to="/" aria-label="Ticket Flow home"><Brand /></Link>
          <nav aria-label="Landing page"><a href="#product">Product</a><a href="#workflow">How it works</a><a href="#security">Security</a></nav>
          <div className={styles.navActions}><Link to="/auth" className={styles.signIn}>Sign in</Link><Link to="/auth" className={styles.primarySmall}>Start free</Link></div>
        </div>
      </header>

      <main>
        <section className={styles.hero} id="product">
          <div className={styles.heroBackdrop} />
          <div className={styles.sceneBrand} aria-hidden="true">
            <Icon name="ticket" size={47} strokeWidth={1.55} />
            <span><strong>Ticket Flow</strong><small>Capture · Assign · Resolve</small></span>
          </div>
          <div className={styles.scenePromise} aria-hidden="true">
            <strong>One clear flow</strong><span>for every request</span><i />
          </div>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadge}><Icon name="bolt" size={17} />The ultimate support workspace</div>
            <h1>Turn support chaos<br />into customer <span>loyalty.</span></h1>
            <p>Empower your team with lightning-fast triage, seamless collaboration, and the clarity needed to resolve tickets instantly.</p>
            <div className={styles.heroActions}>
              <Link to="/auth" className={styles.primary}>Start managing tickets <Icon name="arrow" size={18} /></Link>
              <a href="#workflow" className={styles.secondary}><span><Icon name="arrow" size={14} /></span>View the workflow</a>
            </div>
          </div>
          <div className={styles.previewWrap}><ProductPreview /></div>
        </section>

        <section className={styles.features} id="workflow">
          <div className={styles.sectionInner}>
            <h2>Everything your team needs<br />to stay ahead</h2>
            <div className={styles.featureGrid}>
              {features.map((feature) => <article key={feature.title}><span><Icon name={feature.icon} size={25} /></span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className={styles.mission}>
          <div className={styles.missionInner}>
            <div><h2>Our mission is simple:<br /><span>make support effortless.</span></h2><p>Great support builds trust. Ticket Flow gives teams the clarity, speed, and control to turn every request into a positive experience.</p></div>
            <div className={styles.flowGraphic} aria-hidden="true"><i /><i /><i /><i /><span><Icon name="check" size={27} strokeWidth={2.5} /></span></div>
          </div>
        </section>

        <section className={styles.stats} aria-label="Ticket Flow outcomes">
          <div><strong>98%</strong><span>SLA target met</span></div><div><strong>42%</strong><span>Faster first response</span></div><div><strong>35%</strong><span>More tickets resolved</span></div><div><strong>4.8/5</strong><span>Customer satisfaction</span></div>
        </section>

        <section className={styles.trust} id="security">
          <div className={styles.securityLine}><Icon name="shield" size={21} /><span><strong>Enterprise-ready by design.</strong> Clear permissions, protected data, and dependable audit trails.</span></div>
          <div className={styles.quotes}>
            <blockquote><Icon name="quote" size={24} /><p>“Ticket Flow brought order to our support chaos. We see everything, move faster, and our customers feel the difference.”</p><footer><span>RA</span><div><strong>Rachel Adams</strong><small>Head of Support</small></div></footer></blockquote>
            <blockquote><Icon name="quote" size={24} /><p>“The visibility and ownership are game changers. Our team collaborates better and resolves issues in a fraction of the time.”</p><footer><span>DK</span><div><strong>Daniel Kim</strong><small>Customer Success Manager</small></div></footer></blockquote>
          </div>
        </section>

        <section className={styles.finalCta}><h2>Ready to transform your support?</h2><p>Start with a calmer inbox today.</p><Link to="/auth" className={styles.primary}>Start managing tickets <Icon name="arrow" size={18} /></Link><small>No credit card required.</small></section>
      </main>

      <footer className={styles.footer}><div className={styles.footerInner}><div><Brand inverse /><p>Help desk software that keeps teams in flow and customers happy.</p></div><div className={styles.footerLinks}><div><strong>Product</strong><a href="#product">Features</a><a href="#workflow">Workflow</a></div><div><strong>Company</strong><a href="#security">Security</a><Link to="/auth">Sign in</Link></div></div></div><div className={styles.footerBottom}><span>© 2026 Ticket Flow. All rights reserved.</span><span>Privacy&nbsp;&nbsp;&nbsp; Terms</span></div></footer>
    </div>
  );
}
