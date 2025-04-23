import { writable, type Writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { AUTH_COOKIE_NAME, API_BASE_URL } from '$lib/config/env';
import { authApiLogger, authLogger } from '$lib/utils/auth-loggers';
import { goto } from '$app/navigation';

interface User {
	id: string;
	email: string;
	nome: string;
	cognome: string;
	ruolo: string;
	[key: string]: unknown;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
}

export interface LoginResponse {
	success: boolean;
	error?: string;
	data?: {
		user?: User;
		token?: string;
		[key: string]: unknown;
	} | null;
}

// Helper per gestire il token nei cookie
const cookieHelper = {
	getToken: (): string | null => {
		if (!browser) return null;
		return (
			document.cookie
				.split('; ')
				.find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`))
				?.split('=')[1] || null
		);
	},

	setToken: (token: string, expiryDays: number = 7): void => {
		if (!browser) return;
		const date = new Date();
		date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
		document.cookie = `${AUTH_COOKIE_NAME}=${token}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
	},

	removeToken: (): void => {
		if (!browser) return;
		document.cookie = `${AUTH_COOKIE_NAME}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Strict`;
	},
};

const createAuthStore = () => {
	const initialState: AuthState = {
		isAuthenticated: false,
		user: null,
		token: browser ? cookieHelper.getToken() : null,
		loading: false,
		error: null,
	};

	const store: Writable<AuthState> = writable(initialState);

	return {
		subscribe: store.subscribe,

		// Metodo per ottenere lo stato attuale senza subscribe
		getState: (): AuthState => get(store),

		checkAuth: async (): Promise<boolean> => {
            if (!browser) return false;
            
            // Implementazione della verifica
            try {
                // La tua logica di checkAuth...
                return true; // o false in base alla verifica
            } catch (error) {
                console.error('Auth check error:', error);
                return false;
            }
        },

		// Inizializza lo store con i dati dell'utente dal server
		initialize: async (serverUser?: User | null): Promise<void> => {
			// Se abbiamo già l'utente dal server, lo usiamo direttamente
			if (serverUser) {
				store.set({
					isAuthenticated: true,
					user: serverUser,
					token: cookieHelper.getToken(),
					loading: false,
					error: null,
				});
				return;
			}

			// Altrimenti controlliamo se c'è un token e proviamo a verificarlo
			const token = cookieHelper.getToken();

			if (!token) {
				store.set({
					...initialState,
					loading: false,
				});
				return;
			}

			// Se c'è un token, verifichiamolo
			store.update((state) => ({ ...state, loading: true }));

			try {
				authApiLogger.debug(`GET ${API_BASE_URL}/auth/verify`);

				const response = await fetch(`${API_BASE_URL}/auth/verify`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error(`Token non valido: ${response.status} ${response.statusText}`);
				}

				const data = await response.json();
				authApiLogger.debug('Risposta verifica token', `Status: ${response.status}`);

				// Verifica la struttura della risposta
				if (!data.success) {
					throw new Error('Risposta del server non valida');
				}

				// Estrai i dati utente
				const userData = data.data;

				if (!userData) {
					throw new Error('Dati utente non presenti nella risposta');
				}

				store.set({
					isAuthenticated: true,
					user: userData,
					token,
					loading: false,
					error: null,
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Errore di autenticazione';
				authLogger.error('Errore durante la verifica del token', errorMessage);
				
				// Reset dello store e rimozione del token
				cookieHelper.removeToken();
				store.set({
				  ...initialState,
				  loading: false,
				  error: errorMessage
				});
			  
			}
		},

		// Login
		login: async (email: string, password: string): Promise<LoginResponse> => {
			// Reset degli errori precedenti e imposta loading
			store.update((state) => ({
				...state,
				loading: true,
				error: null,
			}));

			try {
				// Esegui la richiesta di login
				const response = await fetch(`${API_BASE_URL}/auth/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({ email, password }),
					credentials: 'include', // Include cookies nella richiesta
				});

				// Verifica il tipo di contenuto
				const contentType = response.headers.get('content-type');
				if (!contentType || !contentType.includes('application/json')) {
					const textResponse = await response.text();
					console.error(
						'Risposta non JSON ricevuta:',
						textResponse.length > 150 ? textResponse.substring(0, 150) + '...' : textResponse
					);

					// Determina un messaggio di errore appropriato
					let errorMessage = 'Il server ha risposto con un formato non valido.';
					if (
						textResponse.toLowerCase().includes('<!doctype') ||
						textResponse.toLowerCase().includes('<html')
					) {
						errorMessage =
							'Il server ha risposto con una pagina HTML invece di JSON. ' +
							"Verifica che l'endpoint API sia corretto.";
					}

					store.update((state) => ({
						...state,
						isAuthenticated: false,
						loading: false,
						error: errorMessage,
					}));

					return { success: false, error: errorMessage, data: null };
				}

				// Leggi e processa la risposta JSON
				const data = await response.json();

				// Gestisci gli errori di autenticazione
				if (!response.ok) {
					const errorMessage = data.message || 'Errore durante il login';

					store.update((state) => ({
						...state,
						loading: false,
						error: errorMessage,
					}));

					return {
						success: false,
						error: errorMessage,
						data: null,
					};
				}

				// Estrai i dati utente e token dalla risposta
				// Supporta entrambi i formati: { data: { user, token } } o { user, token }
				const userData = data.data?.utente || data.user || data.data;
				const token = data.data.token || data.token;

				if (!userData || !token) {
					throw new Error('Risposta di login invalida: mancano dati utente o token');
				}

				// Salva il token nei cookie
				cookieHelper.setToken(token);

				// Aggiorna lo store
				store.set({
					isAuthenticated: true,
					user: userData,
					token: token,
					loading: false,
					error: null,
				});
				if (browser) {
					window.location.href = '/';
				}
				// Restituisci la risposta elaborata
				return {
					success: true,
					data: {
						user: userData,
						token: token,
					},
				};
			} catch (error) {
				// Gestisci gli errori di rete o altri errori inaspettati
				const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';

				console.error('Errore di login:', errorMessage);

				store.update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));

				return {
					success: false,
					error: errorMessage,
					data: null,
				};
			}
		},

		// Logout
		logout: async (): Promise<void> => {
			store.update((state) => ({ ...state, loading: true }));

			try {
				// Ottieni il token corrente
				const token = get(store).token;

				if (token) {
					// Notifica il backend del logout
					await fetch(`${API_BASE_URL}/auth/logout`, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
					});
				}
			} catch (error) {
				console.warn('Errore durante la comunicazione di logout al server:', error);
				// Continuiamo comunque con il logout lato client
			} finally {
				// Rimuovi il token e reimposta lo store
				cookieHelper.removeToken();

				store.set({
					isAuthenticated: false,
					user: null,
					token: null,
					loading: false,
					error: null,
				});
				if (browser) {
					goto('/auth/login');
				}
			}
		},

		// Metodo per aggiornare utente
		updateUser: (userData: Partial<User>): void => {
			store.update((state) => ({
				...state,
				user: state.user ? { ...state.user, ...userData } : null,
			}));
		},

		// Metodo per gestire gli errori di autenticazione
		setError: (error: string | null): void => {
			store.update((state) => ({ ...state, error }));
		},

		// Metodo per verificare l'autorizzazione per un ruolo specifico
		hasRole: (role: string): boolean => {
			const state = get(store);
			return state.isAuthenticated && state.user?.ruolo === role;
		},
	};
};

export const auth = createAuthStore();
