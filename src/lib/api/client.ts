import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { browser } from '$app/environment';
import type {
	Brevetto,
	PaginatedResponse,
	SearchParams,
	AuthResponse,
	LoginCredentials,
	BrevettiStatistiche,
} from '$lib/types';

// Crea un'istanza Axios con configurazione di base
const api: AxiosInstance = axios.create({
	baseURL: browser
		? import.meta.env.VITE_API_URL || 'http://localhost:3000'
		: 'http://localhost:3000',
	headers: {
		'Content-Type': 'application/json',
	},
});

// Interceptor per aggiungere token di autenticazione
api.interceptors.request.use((config) => {
	if (browser) {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Se l'errore è 401 (Unauthorized) e non è già un retry
		if (error.response?.status === 401 && !originalRequest._retry && browser) {
			originalRequest._retry = true;

			try {
				// Prova a rinnovare il token con refreshToken
				const refreshToken = localStorage.getItem('refreshToken');
				if (!refreshToken) {
					throw new Error('No refresh token available');
				}

				const response = await axios.post<AuthResponse>(`${api.defaults.baseURL}/auth/refresh`, {
					refreshToken,
				});

				// Aggiorna i token
				const { accessToken, refreshToken: newRefreshToken } = response.data.data;
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', newRefreshToken);

				// Riprova la richiesta originale con il nuovo token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// Se il refresh fallisce, reindirizza al login
				if (browser) {
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('user');
					window.location.href = '/auth/login';
				}
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

// API per autenticazione
export const authApi = {
	login: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
		api.post('/auth/login', credentials),

	logout: (): Promise<AxiosResponse<unknown>> => api.post('/auth/logout'),

	refreshToken: (refreshToken: string): Promise<AxiosResponse<AuthResponse>> =>
		api.post('/auth/refresh', { refreshToken }),
};

// API per i brevetti
export const brevettiApi = {
	// Ottieni lista brevetti con paginazione e filtri
	getAll: (params: SearchParams): Promise<AxiosResponse<PaginatedResponse<Brevetto>>> =>
		api.get('/brevetti', { params }),

	// Ottieni un singolo brevetto
	getById: (id: string): Promise<AxiosResponse<{ data: Brevetto }>> => api.get(`/brevetti/${id}`),

	// Crea un nuovo brevetto
	create: (brevetto: Partial<Brevetto>): Promise<AxiosResponse<{ data: Brevetto }>> =>
		api.post('/brevetti', brevetto),

	// Aggiorna un brevetto esistente
	update: (id: string, brevetto: Partial<Brevetto>): Promise<AxiosResponse<{ data: Brevetto }>> =>
		api.put(`/brevetti/${id}`, brevetto),

	// Elimina un brevetto
	delete: (id: string): Promise<AxiosResponse<{ deleted: boolean }>> =>
		api.delete(`/brevetti/${id}`),

	// Ottieni brevetti in scadenza
	getScadenze: (
		giorni: number = 30,
		page: number = 1,
		limit: number = 10
	): Promise<AxiosResponse<PaginatedResponse<Brevetto>>> =>
		api.get('/brevetti/scadenze', { params: { giorni, page, limit } }),

	// Aggiungi una nota a un brevetto
	addNota: (
		id: string,
		testo: string,
		autore: string
	): Promise<AxiosResponse<{ data: Brevetto }>> =>
		api.post(`/brevetti/${id}/note`, { nota: { testo, autore } }),

	// Aggiungi elemento timeline
	addTimelineItem: (id: string, descrizione: string): Promise<AxiosResponse<{ data: Brevetto }>> =>
		api.post(`/brevetti/${id}/timeline`, { timelineItem: { descrizione } }),

	// Ottieni statistiche brevetti
	getStatistiche: (): Promise<AxiosResponse<{ data: BrevettiStatistiche }>> =>
		api.get('/brevetti/statistiche'),
};

// API per i titolari
export const titolariApi = {
	getAll: (): Promise<AxiosResponse<{ data: unknown[] }>> => api.get('/titolari'),

	getById: (id: string): Promise<AxiosResponse<{ data: unknown }>> => api.get(`/titolari/${id}`),

	create: (titolare: unknown): Promise<AxiosResponse<{ data: unknown }>> =>
		api.post('/titolari', titolare),

	update: (id: string, titolare: unknown): Promise<AxiosResponse<{ data: unknown }>> =>
		api.put(`/titolari/${id}`, titolare),

	delete: (id: string): Promise<AxiosResponse<{ deleted: boolean }>> =>
		api.delete(`/titolari/${id}`),
};

// API per le notifiche
export const notificheApi = {
	getAll: (params?: {
		lette?: boolean;
		page?: number;
		limit?: number;
	}): Promise<AxiosResponse<PaginatedResponse<unknown>>> => api.get('/notifiche', { params }),

	markAsRead: (id: string): Promise<AxiosResponse<{ data: unknown }>> =>
		api.put(`/notifiche/${id}/read`),

	markAllAsRead: (): Promise<AxiosResponse<{ success: boolean }>> => api.put('/notifiche/read-all'),
};

export default api;
