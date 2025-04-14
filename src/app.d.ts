// Vedi https://kit.svelte.dev/docs/types#app
// per informazioni sui tipi

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			user?: Record<string, unknown> | null;
			isAuthenticated?: boolean;
		}
		// interface Platform {}
	}

	// Estendi l'interfaccia ImportMetaEnv per le variabili d'ambiente Vite
	interface ImportMetaEnv {
		PUBLIC_API_URL: string;
		PUBLIC_AUTH_ENABLED: string;
		PUBLIC_APP_VERSION: string;
		// Aggiungi altre variabili d'ambiente pubbliche qui
	}

	// Estendi l'interfaccia ImportMeta
	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};