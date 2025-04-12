// Enum per gli stati del brevetto
export enum StatoBrevetto {
	DEPOSITO = 'DEPOSITO',
	ESAME = 'ESAME',
	CONCESSIONE = 'CONCESSIONE',
	ATTIVO = 'ATTIVO',
	SCADUTO = 'SCADUTO',
	DECADUTO = 'DECADUTO',
	RINUNCIATO = 'RINUNCIATO',
	ANNULLATO = 'ANNULLATO',
}

// Mapping per traduzione degli stati e colori associati
export const StatoBrevettoLabels: Record<StatoBrevetto, string> = {
	[StatoBrevetto.DEPOSITO]: 'Deposito',
	[StatoBrevetto.ESAME]: 'In Esame',
	[StatoBrevetto.CONCESSIONE]: 'In Concessione',
	[StatoBrevetto.ATTIVO]: 'Attivo',
	[StatoBrevetto.SCADUTO]: 'Scaduto',
	[StatoBrevetto.DECADUTO]: 'Decaduto',
	[StatoBrevetto.RINUNCIATO]: 'Rinunciato',
	[StatoBrevetto.ANNULLATO]: 'Annullato',
};

export const StatoBrevettoColors: Record<StatoBrevetto, string> = {
	[StatoBrevetto.DEPOSITO]: 'bg-blue-100 text-blue-800',
	[StatoBrevetto.ESAME]: 'bg-amber-100 text-amber-800',
	[StatoBrevetto.CONCESSIONE]: 'bg-purple-100 text-purple-800',
	[StatoBrevetto.ATTIVO]: 'bg-green-100 text-green-800',
	[StatoBrevetto.SCADUTO]: 'bg-red-100 text-red-800',
	[StatoBrevetto.DECADUTO]: 'bg-gray-100 text-gray-800',
	[StatoBrevetto.RINUNCIATO]: 'bg-gray-100 text-gray-800',
	[StatoBrevetto.ANNULLATO]: 'bg-red-100 text-red-800',
};

// Interfaccia per i titolari
export interface Titolare {
	_id: string;
	nome: string;
	tipologia: 'PERSONA_FISICA' | 'AZIENDA' | 'ENTE_PUBBLICO';
	codiceFiscale?: string;
	partitaIva?: string;
	indirizzo?: string;
	citta?: string;
	provincia?: string;
	cap?: string;
	paese?: string;
	email?: string;
	telefono?: string;
	attivo: boolean;
	metadata?: Record<string, unknown>;
	createdAt?: string;
	updatedAt?: string;
}

// Interfaccia per le note del brevetto
export interface NotaBrevetto {
	testo: string;
	autore: string;
	data: string;
}

// Interfaccia per elementi della timeline
export interface TimelineItem {
	data: string;
	descrizione: string;
}

// Interfaccia per i brevetti
export interface Brevetto {
	_id: string;
	numero: string;
	titolo: string;
	descrizione: string;
	stato: StatoBrevetto;
	dataDeposito: string;
	dataConcessione?: string;
	dataScadenza: string;
	titolari: Titolare[] | string[];
	inventori: string[];
	classificazioneIPC?: string[];
	metadata?: Record<string, unknown>;
	timeline?: TimelineItem[];
	note?: NotaBrevetto[];
	createdAt?: string;
	updatedAt?: string;
}

// Interfaccia per la risposta paginata
export interface PaginatedResponse<T> {
	success: boolean;
	data: {
		data: T[];
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	};
	message: string;
	timestamp: string;
	statusCode: number;
}

// Interfaccia per le statistiche
export interface BrevettiStatistiche {
	totale: number;
	perStato: { _id: StatoBrevetto; count: number }[];
	perAnno: { _id: number; count: number }[];
	perTitolare: { _id: string; count: number; titolareNome: string }[];
	inScadenza: number;
}

// Interfaccia per utenti
export interface Utente {
	_id: string;
	email: string;
	nome: string;
	cognome: string;
	ruolo: 'ADMIN' | 'UTENTE_STANDARD';
	attivo: boolean;
	ultimoAccesso?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Interfaccia per le credenziali di login
export interface LoginCredentials {
	email: string;
	password: string;
}

// Interfaccia per la risposta di autenticazione
export interface AuthResponse {
	success: boolean;
	data: {
		accessToken: string;
		refreshToken: string;
		user: Utente;
	};
	message: string;
	timestamp: string;
	statusCode: number;
}

// Enum per tipi di notifica
export enum TipoNotifica {
	SCADENZA_IMMINENTE = 'SCADENZA_IMMINENTE',
	CAMBIO_STATO = 'CAMBIO_STATO',
	NUOVA_NOTA = 'NUOVA_NOTA',
	SISTEMA = 'SISTEMA',
}

// Interfaccia per le notifiche
export interface Notifica {
	_id: string;
	titolo: string;
	messaggio: string;
	tipo: TipoNotifica;
	brevetto?: string | Brevetto;
	destinatari: string[] | Utente[];
	statoLettura: { utente: string | Utente; letta: boolean; dataLettura?: string }[];
	inviaEmail: boolean;
	emailInviata: boolean;
	dataInvioEmail?: string;
	urgente: boolean;
	dataScadenza?: string;
	attiva: boolean;
	createdAt: string;
	updatedAt: string;
}

// Interfaccia per filtri dei brevetti
export interface BrevettoFiltri {
	stato?: StatoBrevetto;
	titolare?: string;
	dataDepositoDa?: string;
	dataDepositoA?: string;
	search?: string;
}

// Interfaccia per i parametri di ricerca/filtro
export interface SearchParams extends BrevettoFiltri {
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: 'asc' | 'desc';
}
