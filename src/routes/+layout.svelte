<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '../app.css';
	// Importa i componenti UI necessari
	import Header from '$lib/components/layout/Header.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	//  import Sidebar from '$lib/components/Sidebar.svelte';
	import { initializeStores } from '$lib/stores';

	// Funzione per inizializzare funzionalità che richiedono il browser
	const initBrowserFeatures = () => {
		if (browser) {
			// Qui puoi accedere alle API del browser in sicurezza
			// Ad esempio, carica le preferenze utente da localStorage
			const savedTheme = localStorage.getItem('preferenze-theme') || 'light';
			document.documentElement.setAttribute('data-theme', savedTheme);

			// Inizializza gli store
			initializeStores();
		}
	};
	initBrowserFeatures();

	// Inizializza lo stato dell'app
	let isLoading = $state(true);
	let { children } = $props();

	const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
	const isPublicRoute = $derived(publicRoutes.includes($page.url.pathname));
	const isAuthRoute = $derived($page.url.pathname.startsWith('/auth/'));

	onMount(() => {
		// Codice da eseguire solo lato client dopo il mount del componente
		isLoading = false;

		// Esegui la verifica dell'autenticazione
		auth
			.checkAuth()
			.then((isAuthenticated) => {
				if (!isAuthenticated && !isPublicRoute) {
					goto('/auth/login');
				}
			})
			.catch((error) => {
				console.error("Errore durante la verifica dell'autenticazione:", error);
				// Gestisci eventuali errori, assicurandoti che lo spinner si fermi
			});

		// Se è necessario fare altre operazioni con l'oggetto window
		const handleResize = () => {
			// Gestisci il ridimensionamento della finestra
		};

		window.addEventListener('resize', handleResize);

		// Cleanup quando il componente viene distrutto
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

{#if isLoading && browser}
	<!-- Mostra un loader solo lato client durante il caricamento -->
	<div class="loading-overlay">
		<div class="spinner"></div>
	</div>
{/if}

<div class="flex min-h-screen flex-col bg-gray-50">
	{#if !isAuthRoute}
		<Header />
	{/if}
	

	<main class="flex-grow">
		{@render children()}
	</main>
	{#if !isAuthRoute}
	<footer class="border-t bg-white py-4">
		<div class="container mx-auto px-4 text-center text-sm text-gray-500">
			<p>© {new Date().getFullYear()} UfficioBrevetti - Tutti i diritti riservati</p>
		</div>
	</footer>
{/if}
</div>

<style>
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
