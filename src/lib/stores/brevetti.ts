import { writable, derived } from 'svelte/store';
import type { Brevetto, SearchParams, BrevettiStatistiche } from '$lib/types';
import { brevettiApi } from '$lib/api/client';

// Store per i parametri di ricerca e filtri
const defaultParams: SearchParams = {
	page: 1,
	limit: 10,
	sortBy: 'dataDeposito',
	sortOrder: 'desc',
	search: '',
};

function createBrevettiStore() {
	const { subscribe, update } = writable<{
		brevetti: Brevetto[];
		currentBrevetto: Brevetto | null;
		params: SearchParams;
		loading: boolean;
		error: string | null;
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		} | null;
		statistiche: BrevettiStatistiche | null;
		brevettiInScadenza: Brevetto[];
	}>({
		brevetti: [],
		currentBrevetto: null,
		params: defaultParams,
		loading: false,
		error: null,
		meta: null,
		statistiche: null,
		brevettiInScadenza: [],
	});

	return {
		subscribe,

		// Carica lista brevetti con filtri opzionali
		loadBrevetti: async (newParams?: Partial<SearchParams>) => {
			update((state) => ({
				...state,
				loading: true,
				error: null,
				params: newParams ? { ...state.params, ...newParams } : state.params,
			}));

			try {
				const response = await brevettiApi.getAll(
					newParams ? { ...defaultParams, ...newParams } : defaultParams
				);

				const { data, meta } = response.data.data;

				update((state) => ({
					...state,
					brevetti: data,
					meta,
					loading: false,
				}));
			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));
			}
		},

		// Carica un singolo brevetto per ID
		loadBrevetto: async (id: string) => {
			if (!id) return;

			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await brevettiApi.getById(id);

				update((state) => ({
					...state,
					currentBrevetto: response.data.data,
					loading: false,
				}));
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : 'Errore nel caricamento del brevetto';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));
			}
		},

		// Crea un nuovo brevetto
		createBrevetto: async (brevetto: Partial<Brevetto>) => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await brevettiApi.create(brevetto);

				update((state) => ({
					...state,
					currentBrevetto: response.data.data,
					loading: false,
				}));

				return response.data.data;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : 'Errore nella creazione del brevetto';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));

				return null;
			}
		},

		// Aggiorna un brevetto esistente
		updateBrevetto: async (id: string, brevetto: Partial<Brevetto>) => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await brevettiApi.update(id, brevetto);

				update((state) => ({
					...state,
					currentBrevetto: response.data.data,
					loading: false,
					// Aggiorna anche nella lista se presente
					brevetti: state.brevetti.map((b) => (b._id === id ? response.data.data : b)),
				}));

				return response.data.data;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : "Errore nell'aggiornamento del brevetto";

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));

				return null;
			}
		},

		// Elimina un brevetto
		deleteBrevetto: async (id: string) => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				await brevettiApi.delete(id);

				update((state) => ({
					...state,
					brevetti: state.brevetti.filter((b) => b._id !== id),
					currentBrevetto: state.currentBrevetto?._id === id ? null : state.currentBrevetto,
					loading: false,
				}));

				return true;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : "Errore nell'eliminazione del brevetto";

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));

				return false;
			}
		},

		// Aggiungi una nota a un brevetto
		addNota: async (id: string, testo: string, autore: string) => {
			if (!id) return null;

			try {
				const response = await brevettiApi.addNota(id, testo, autore);

				update((state) => ({
					...state,
					currentBrevetto: response.data.data,
					// Aggiorna anche nella lista se presente
					brevetti: state.brevetti.map((b) => (b._id === id ? response.data.data : b)),
				}));

				return response.data.data;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : "Errore nell'aggiunta della nota";

				update((state) => ({
					...state,
					error: errorMessage,
				}));

				return null;
			}
		},

		// Carica brevetti in scadenza
		loadBrevettiInScadenza: async (giorni: number = 30) => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await brevettiApi.getScadenze(giorni);

				update((state) => ({
					...state,
					brevettiInScadenza: response.data.data.data,
					loading: false,
				}));
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : 'Errore nel caricamento delle scadenze';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));
			}
		},

		// Carica statistiche
		loadStatistiche: async () => {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const response = await brevettiApi.getStatistiche();

				update((state) => ({
					...state,
					statistiche: response.data.data,
					loading: false,
				}));
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error ? error.message : 'Errore nel caricamento delle statistiche';

				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
				}));
			}
		},

		// Aggiorna parametri di ricerca
		updateParams: (newParams: Partial<SearchParams>) => {
			update((state) => ({
				...state,
				params: { ...state.params, ...newParams },
			}));
		},

		// Reset dei filtri
		resetFiltri: () => {
			update((state) => ({
				...state,
				params: { ...defaultParams, page: state.params.page },
			}));
		},

		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},

		resetCurrentBrevetto: () => {
			update((state) => ({ ...state, currentBrevetto: null }));
		},
	};
}

export const brevetti = createBrevettiStore();

// Store derivato per controllare se ci sono risultati
export const hasResults = derived(brevetti, ($brevetti) => $brevetti.brevetti.length > 0);

// Store derivato per il numero di pagine totali
export const totalPages = derived(brevetti, ($brevetti) => $brevetti.meta?.totalPages || 1);

// Store derivato per i brevetti in scadenza nei prossimi 30 giorni
export const brevettiInScadenza30Giorni = derived(
	brevetti,
	($brevetti) => $brevetti.brevettiInScadenza
);
