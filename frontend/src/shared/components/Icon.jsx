const paths = {
  ticket: <><path d="M4 5.5h16v4a2.5 2.5 0 0 0 0 5v4H4v-4a2.5 2.5 0 0 0 0-5z"/><path d="M9 9v6M15 9v1M15 14v1"/></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  logout: <><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><path d="m15 8 4 4-4 4M9 12h10"/></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  user: <><circle cx="12" cy="8" r="3.25"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  inbox: <><path d="M4 5h16v14H4z"/><path d="M4 14h4l2 2h4l2-2h4"/></>,
  users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7" r="3.5"/><path d="M17 4.5a3.5 3.5 0 0 1 0 6.7M21 20v-1.5a4 4 0 0 0-3-3.75"/></>,
  activity: <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />,
  bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8z" />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.7 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.8 7.5-9.5V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  quote: <><path d="M5 10h5v7H4v-5a6 6 0 0 1 6-6"/><path d="M15 10h5v7h-6v-5a6 6 0 0 1 6-6"/></>,
};

export default function Icon({ name, size = 20, className, strokeWidth = 1.75 }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
