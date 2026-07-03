import { httpClient } from '../../../shared/api/httpClient';

export function listTickets(token) {
  return httpClient('/tickets', { token });
}

export function getTicket(token, id) {
  return httpClient(`/tickets/${encodeURIComponent(id)}`, { token });
}

export function createTicket(token, payload) {
  return httpClient('/tickets', {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTicketStatus(token, id, status) {
  return httpClient(`/tickets/${encodeURIComponent(id)}/status`, {
    token,
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

