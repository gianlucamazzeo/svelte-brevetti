<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { notifiche, contaNonLette, haNotificheNonLette } from '$lib/stores/notifiche';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { format } from 'date-fns';
	import { it } from 'date-fns/locale';
	import { browser } from '$app/environment';

	// Stato locale usando $state per Svelte 5
	let notificheDropdown: HTMLDivElement;
	let profileDropdown: HTMLDivElement;
	let notificheAperte = $state(false);
	let profileAperto = $state(false);
	let menuMobileAperto = $state(false);
	
	// Verifica ruolo admin in modo reattivo
	let isAdmin = $state(false);
	
	// Aggiorna isAdmin quando auth cambia
	$effect(() => {
		isAdmin = $auth.user?.ruolo === 'ADMIN';
	});

	// Carica le notifiche non lette all'avvio
	onMount(() => {
		notifiche.loadNonLette();
		
		// Aggiungi event listener solo nel browser
		if (browser) {
			document.addEventListener('click', handleClickOutside);
			
			// Cleanup event listener
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});

	// Gestione click fuori dai dropdown
	function handleClickOutside(event: MouseEvent) {
		if (notificheDropdown && !notificheDropdown.contains(event.target as Node)) {
			notificheAperte = false;
		}
		if (profileDropdown && !profileDropdown.contains(event.target as Node)) {
			profileAperto = false;
		}
	}

	// Funzione per formattare la data delle notifiche
	function formatNotificaData(data: string): string {
		return format(new Date(data), 'dd MMM yyyy HH:mm', { locale: it });
	}

	// Gestisci il click su una notifica
	function handleNotificaClick(id: string) {
		notifiche.markAsRead(id);
		notificheAperte = false;
	}

	// Segna tutte le notifiche come lette
	function markAllAsRead() {
		notifiche.markAllAsRead();
		notificheAperte = false;
	}

	// Gestisci il logout
	function handleLogout() {
		auth.logout();
	}

	// Gestisci l'apertura/chiusura del menu mobile
	function toggleMenuMobile() {
		menuMobileAperto = !menuMobileAperto;
	}
</script>

<header class="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
		<!-- Hamburger menu per mobile -->
		<button
			class="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			onclick={toggleMenuMobile}
			aria-label="Menu principale"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>

		<!-- Logo e nome applicazione -->
		<div class="flex items-center space-x-3">
			<a href="/" class="flex items-center">
				<span class="text-xl font-bold text-blue-600">UfficioBrevetti</span>
			</a>
		</div>

		<!-- Navigazione principale (desktop) -->
		<nav class="hidden space-x-6 md:flex">
			<a href="/" class="rounded px-2 py-1 text-gray-700 transition hover:text-blue-600">
				Dashboard
			</a>
			<a href="/brevetti" class="rounded px-2 py-1 text-gray-700 transition hover:text-blue-600">
				Brevetti
			</a>
			<a href="/scadenze" class="rounded px-2 py-1 text-gray-700 transition hover:text-blue-600">
				Scadenze
			</a>
			{#if isAdmin}
				<a href="/titolari" class="rounded px-2 py-1 text-gray-700 transition hover:text-blue-600">
					Titolari
				</a>
			{/if}
		</nav>

		<!-- Azioni utente -->
		<div class="flex items-center space-x-4">
			<!-- Notifiche -->
			<div class="relative" bind:this={notificheDropdown}>
				<button
					class="relative rounded-full p-1 text-gray-600 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					onclick={() => (notificheAperte = !notificheAperte)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>

					{#if $haNotificheNonLette}
						<span
							class="absolute top-0 right-0 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs leading-none font-bold text-white"
						>
							{$contaNonLette}
						</span>
					{/if}
				</button>

				<!-- Dropdown notifiche -->
				{#if notificheAperte}
					<div
						class="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg"
						transition:fly={{ y: -10, duration: 200 }}
					>
						<div class="flex items-center justify-between border-b border-gray-200 bg-gray-100 p-3">
							<h3 class="text-sm font-semibold text-gray-700">Notifiche</h3>
							{#if $contaNonLette > 0}
								<button class="text-xs text-blue-600 hover:text-blue-800" onclick={markAllAsRead}>
									Segna tutte come lette
								</button>
							{/if}
						</div>

						<div class="max-h-72 overflow-y-auto">
							{#if $notifiche.nonLette.length === 0}
								<div class="p-4 text-center text-gray-500">Nessuna notifica non letta</div>
							{:else}
								{#each $notifiche.nonLette as notifica}
									<div
										class="cursor-pointer border-b border-gray-100 p-3 hover:bg-gray-50"
										onclick={() => handleNotificaClick(notifica._id)}
										onkeydown={(e) => e.key === 'Enter' && handleNotificaClick(notifica._id)}
										role="button"
										tabindex="0"
									>
										<!-- Contenuto notifica -->
									</div>
								{/each}
							{/if}
						</div>

						<div class="bg-gray-50 p-2 text-center">
							<a href="/notifiche" class="text-xs text-blue-600 hover:text-blue-800">
								Vedi tutte le notifiche
							</a>
						</div>
					</div>
				{/if}
			</div>

			<!-- Profilo utente -->
			<div class="relative" bind:this={profileDropdown}>
				<button
					class="flex items-center space-x-2 rounded-full p-1 text-gray-700 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					onclick={(e) => {
						e.stopPropagation();
						profileAperto = !profileAperto;
					  }}
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600"
					>
						{#if $auth.user}
							{$auth.user.nome.charAt(0)}{$auth.user.cognome.charAt(0)}
						{:else}
							?
						{/if}
					</div>
					<span class="hidden text-sm font-medium md:inline">
						{#if $auth.user}
							{$auth.user.nome} {$auth.user.cognome}
						{/if}
					</span>
				</button>

				<!-- Dropdown profilo -->
				{#if profileAperto}
					<div
						class="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg"
						transition:fly={{ y: -10, duration: 200 }}
					>
						{#if $auth.user}
							<div class="border-b border-gray-100 px-4 py-2">
								<p class="text-sm font-medium text-gray-900">
									{$auth.user.nome}
									{$auth.user.cognome}
								</p>
								<p class="truncate text-xs text-gray-500">
									{$auth.user.email}
								</p>
							</div>
						{/if}

						
						<a	href="/profilo"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
						>
							Profilo
						</a>

						{#if isAdmin}
							
								<a href="/amministrazione"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
							>
								Amministrazione
							</a>
						{/if}

						<button
							class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
							onclick={handleLogout}
						>
							Logout
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Drawer menu mobile -->
	{#if menuMobileAperto}
		<!-- Overlay -->
		<div 
			class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50" 
			onclick={toggleMenuMobile}
			onkeydown={(e) => e.key === 'Escape' && toggleMenuMobile()}
			role="button"
			tabindex="0"
			aria-label="Chiudi menu"
		></div>
		
		<!-- Menu laterale -->
		<div
			class="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white z-50 shadow-xl overflow-y-auto"
			transition:fly={{ x: -300, duration: 300 }}
		>
			<div class="p-4 border-b border-gray-200 flex justify-between items-center">
				<span class="text-lg font-bold text-blue-600">Menu</span>
				<button
					class="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					onclick={toggleMenuMobile}
					aria-label="Chiudi menu"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<nav class="p-4">
				<ul class="space-y-4">
					<li>
						<a 
							href="/" 
							class="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
							onclick={toggleMenuMobile}
						>
							Dashboard
						</a>
					</li>
					<li>
						<a 
							href="/brevetti" 
							class="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
							onclick={toggleMenuMobile}
						>
							Brevetti
						</a>
					</li>
					<li>
						<a 
							href="/scadenze" 
							class="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
							onclick={toggleMenuMobile}
						>
							Scadenze
						</a>
					</li>
					{#if isAdmin}
						<li>
							<a 
								href="/titolari" 
								class="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
								onclick={toggleMenuMobile}
							>
								Titolari
							</a>
						</li>
					{/if}
				</ul>
			</nav>
		</div>
	{/if}
</header>