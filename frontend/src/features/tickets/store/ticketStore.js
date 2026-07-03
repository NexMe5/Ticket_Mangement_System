import { create } from 'zustand';
import * as ticketApi from '../api/ticketApi';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  loading: false,
  saving: false,
  error: null,
  filter: 'all',
  search: '',
  drawer: null,

  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  openCreate: () => set({ drawer: 'create', selectedTicket: null, error: null }),
  closeDrawer: () => set({ drawer: null, selectedTicket: null, error: null }),
  clearError: () => set({ error: null }),

  fetchTickets: async (token) => {
    set({ loading: true, error: null });
    try {
      const tickets = await ticketApi.listTickets(token);
      set({ tickets, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  createTicket: async (token, payload) => {
    set({ saving: true, error: null });
    try {
      const ticket = await ticketApi.createTicket(token, payload);
      set((state) => ({
        tickets: [ticket, ...state.tickets],
        saving: false,
        drawer: 'detail',
        selectedTicket: ticket,
      }));
      return true;
    } catch (error) {
      set({ saving: false, error: error.message });
      return false;
    }
  },

  selectTicket: async (token, id) => {
    const cached = get().tickets.find((ticket) => ticket.id === id);
    set({ drawer: 'detail', selectedTicket: cached || null, error: null });
    try {
      const ticket = await ticketApi.getTicket(token, id);
      set({ selectedTicket: ticket });
    } catch (error) {
      set({ error: error.message });
    }
  },

  advanceStatus: async (token, id, status) => {
    set({ saving: true, error: null });
    try {
      const updated = await ticketApi.updateTicketStatus(token, id, status);
      set((state) => ({
        saving: false,
        selectedTicket: state.selectedTicket?.id === id ? updated : state.selectedTicket,
        tickets: state.tickets.map((ticket) => ticket.id === id ? updated : ticket),
      }));
      return true;
    } catch (error) {
      set({ saving: false, error: error.message });
      return false;
    }
  },
}));

