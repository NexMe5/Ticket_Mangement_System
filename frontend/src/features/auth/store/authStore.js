import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authApi from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      notice: null,

      clearFeedback: () => set({ error: null, notice: null }),

      submit: async (mode, credentials) => {
        set({ loading: true, error: null, notice: null });
        try {
          const session = mode === 'register'
            ? await authApi.register(credentials)
            : await authApi.login(credentials);
          const token = session.token || session.access_token || null;
          if (mode === 'register' && !token) {
            set({
              loading: false,
              notice: 'Account created. Confirm your email if required, then sign in.',
            });
            return { needsLogin: true };
          }
          set({ token, user: session.user, loading: false });
          return { authenticated: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { error };
        }
      },

      logout: () => set({ token: null, user: null, error: null, notice: null }),
    }),
    {
      name: 'ticketflow-auth-v1',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

