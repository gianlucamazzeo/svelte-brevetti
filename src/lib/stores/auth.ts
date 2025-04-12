import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { Utente } from '$lib/types';
import { authApi } from '$lib/api/client';
import { goto } from '$app/navigation';

// Recupera l'utente dal localStorage all'avvio
const getUserFromStorage = (): Utente | null => {
	if (browser) {
		const userJson = localStorage.getItem('user');
		if (userJson) {
			try {
				return JSON.parse(userJson);
			} catch (e) {
				console.error('Failed to parse user from localStorage', e);
			}
		}
	}
	return null;
};

// Crea lo store per l'autenticazione
function createAuthStore() {
	const { subscribe, set, update } = writable<{
		user: Utente | null;
		isAuthenticated: boolean;
		isLoading: boolean;
		error: string | null;
	}>({
		user: getUserFromStorage(),
		isAuthenticated: !!getUserFromStorage(),
		isLoading: false,
		error: null,
	});

	return {
		subscribe,

		login: async (email: string, password: string) => {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await authApi.login({ email, password });
				const { accessToken, refreshToken, user } = response.data.data;

				if (browser) {
					localStorage.setItem('accessToken', accessToken);
					localStorage.setItem('refreshToken', refreshToken);
					localStorage.setItem('user', JSON.stringify(user));
				}

				set({
					user,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				});

				return true;
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';

				update((state) => ({
					...state,
					isLoading: false,
					error: errorMessage,
				}));

				return false;
			}
		},

		logout: async () => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				// Anche se la chiamata API fallisce, vogliamo comunque fare il logout lato client
				await authApi.logout().catch(console.error);
			} finally {
				if (browser) {
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('user');
				}

				set({
					user: null,
					isAuthenticated: false,
					isLoading: false,
					error: null,
				});

				goto('/auth/login');
			}
		},

		// Verifica lo stato di autenticazione
		checkAuth: async () => {
			const accessToken = browser ? localStorage.getItem('accessToken') : null;
			const refreshToken = browser ? localStorage.getItem('refreshToken') : null;

			if (!accessToken || !refreshToken) {
				update((state) => ({
					...state,
					user: null,
					isAuthenticated: false,
				}));
				return false;
			}

			return true;
		},

		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},
	};
}

// Esporta lo store autenticazione
export const auth = createAuthStore();

// Store derivato per verificare se l'utente è admin
export const isAdmin = derived(auth, ($auth) => $auth.user?.ruolo === 'ADMIN');
