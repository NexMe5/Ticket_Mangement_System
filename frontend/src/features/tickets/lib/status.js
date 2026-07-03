export const statusMeta = {
  open: { label: 'Open', next: 'in_progress', action: 'Start progress' },
  in_progress: { label: 'In progress', next: 'closed', action: 'Close ticket' },
  closed: { label: 'Closed', next: null, action: null },
};

export function nextStatus(status) {
  return statusMeta[status]?.next ?? null;
}

