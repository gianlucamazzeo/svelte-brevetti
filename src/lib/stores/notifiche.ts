import { writable, derived } from 'svelte/store';
import { notificheApi } from '$lib/api/client';
import type { Notifica } from '$lib/types';

function createNotificheStore() {
	const { subscribe, update } = writable<{
		notifiche: Notifica[];
		nonLette: Notifica[];
		loading: boolean;
		error: string | null;
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		} | null;
	}>({
		notifiche: [],
		nonLette: [],
		loading: false,
		error: null,
		meta: null,
	});

	return {
		subscribe,

		// Carica tutte le notifiche
		loadNotifiche: async (page: number = 1, limit: number = 10) => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await notificheApi.getAll({ page, limit });

				const { data, meta } = response.data.data;

				const typedData = data as Notifica[];

				update((state) => ({
					...state,
					notifiche: typedData,
					meta,
					loading: false,
				}));
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : 'Errore nel caricamento delle notifiche';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));
			}
		},

		// Carica solo notifiche non lette
		loadNonLette: async () => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await notificheApi.getAll({ lette: false, page: 1, limit: 100 });
				const typedData = response.data.data.data as Notifica[];

				update((state) => ({
					...state,
					nonLette: typedData,
					loading: false,
				}));
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Errore nel caricamento delle notifiche non lette';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));
			}
		},

		// Marca una notifica come letta
		markAsRead: async (id: string) => {
			try {
				await notificheApi.markAsRead(id);

				update((state) => {
					// Aggiorna lo stato delle notifiche
					const updatedNotifiche = state.notifiche.map((n) =>
						n._id === id
							? { ...n, statoLettura: n.statoLettura.map((s) => ({ ...s, letta: true })) }
							: n
					);

					return {
						...state,
						notifiche: updatedNotifiche,
						nonLette: state.nonLette.filter((n) => n._id !== id),
					};
				});

				return true;
			} catch (error) {
				console.error('Errore nel segnare la notifica come letta', error);
				return false;
			}
		},

		// Marca tutte le notifiche come lette
		markAllAsRead: async () => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				await notificheApi.markAllAsRead();

				update((state) => ({
					...state,
					notifiche: state.notifiche.map((n) => ({
						...n,
						statoLettura: n.statoLettura.map((s) => ({ ...s, letta: true })),
					})),
					nonLette: [],
					loading: false,
				}));

				return true;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Errore nel segnare tutte le notifiche come lette';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));

				return false;
			}
		},

		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},
	};
}

export const notifiche = createNotificheStore();

// Store derivato per conteggio notifiche non lette
export const contaNonLette = derived(notifiche, ($notifiche) => $notifiche.nonLette.length);

// Store derivato per verificare se ci sono notifiche non lette
export const haNotificheNonLette = derived(contaNonLette, ($contaNonLette) => $contaNonLette > 0);
