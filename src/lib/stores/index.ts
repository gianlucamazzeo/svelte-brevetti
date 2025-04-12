import { writable } from 'svelte/store';
import type { Brevetto } from '$lib/types';
import { browser } from '$app/environment';

// Store per i brevetti
export const brevetti = writable<Brevetto[]>([]);

// Store per le notifiche
export const notifiche = writable<{
	items: unknown[];
	nonLette: number;
}>({
	items: [],
	nonLette: 0,
});

// Store per impostazioni utente
export const impostazioniUtente = writable({
	theme: 'light',
	preferenzeUI: {
		brevettiPerPagina: 10,
		mostraTimelineBrevetto: true,
	},
});

// Funzione per inizializzare tutti gli store
export const initializeStores = () => {
	// Inizializza solo se siamo nel browser
	if (!browser) return;

	// Carica impostazioni utente da localStorage
	try {
		const savedSettings = localStorage.getItem('impostazioni-utente');
		if (savedSettings) {
			impostazioniUtente.set(JSON.parse(savedSettings));
		}

		// Sottoscriviti alle modifiche e salva in localStorage
		impostazioniUtente.subscribe((value) => {
			localStorage.setItem('impostazioni-utente', JSON.stringify(value));
		});
	} catch (error) {
		console.error('Errore nel caricare le impostazioni utente:', error);
	}

	// Potresti aggiungere altre inizializzazioni per gli altri store
	// Esempio: caricare dati dalla cache locale per i brevetti recenti
};
