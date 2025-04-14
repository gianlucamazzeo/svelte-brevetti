<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { POST_LOGIN_REDIRECT } from '$lib/config/env';
	
	// Importa il logger specifico per il login
	import { loginLogger } from '$lib/utils/auth-loggers';
	
	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let errorMessage = '';
	let isValid = true;
	
	// Stato di validazione
	let emailError = '';
	let passwordError = '';
	
	// Riferimenti a elementi DOM per focus
	let emailInput: HTMLInputElement;
	let passwordInput: HTMLInputElement;
	let submitButton: HTMLButtonElement;
	
	onMount(() => {
	  // Imposta focus sul campo email all'avvio
	  emailInput?.focus();
	  
	  // Se c'è già un utente autenticato, reindirizza
	  const isAuthenticated = $auth.isAuthenticated;
	  if (isAuthenticated) {
		loginLogger.debug('Utente già autenticato, reindirizzamento...');
		goto(POST_LOGIN_REDIRECT);
	  }
	  
	  // Carica email salvata se disponibile
	  const savedEmail = localStorage.getItem('rememberedEmail');
	  if (savedEmail) {
		email = savedEmail;
		rememberMe = true;
		loginLogger.debug('Email memorizzata caricata');
	  }
	});
	
	function validateEmail(): boolean {
	  if (!email.trim()) {
		emailError = 'L\'email è obbligatoria';
		return false;
	  }
	  
	  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	  if (!emailRegex.test(email)) {
		emailError = 'Inserisci un indirizzo email valido';
		return false;
	  }
	  
	  emailError = '';
	  return true;
	}
	
	function validatePassword(): boolean {
	  if (!password.trim()) {
		passwordError = 'La password è obbligatoria';
		return false;
	  }
	  
	  if (password.length < 6) {
		passwordError = 'La password deve contenere almeno 6 caratteri';
		return false;
	  }
	  
	  passwordError = '';
	  return true;
	}
	
	function validateForm(): boolean {
	  const isEmailValid = validateEmail();
	  const isPasswordValid = validatePassword();
	  return isEmailValid && isPasswordValid;
	}
	
	async function handleSubmit() {
	  loginLogger.info('Tentativo di login iniziato');
	  
	  // Previeni invii multipli
	  if (isLoading) return;
	  
	  // Valida form
	  isValid = validateForm();
	  
	  if (!isValid) {
		loginLogger.debug('Validazione fallita');
		// Focus sul primo campo con errore
		if (emailError) emailInput?.focus();
		else if (passwordError) passwordInput?.focus();
		return;
	  }
	  
	  // Imposta stato di caricamento
	  isLoading = true;
	  errorMessage = '';
	  
	  try {
		loginLogger.debug('Invio richiesta login', `email: ${email}`);
		const response = await auth.login(email, password);
		
		loginLogger.debug('Risposta login ricevuta');
		
		if (response.success && response.data) {
		  // Registra successo
		  loginLogger.info('Login effettuato con successo');
		  
		  // Gestisci il "remember me"
		  if (rememberMe) {
			localStorage.setItem('rememberedEmail', email);
			loginLogger.debug('Email salvata per accessi futuri');
		  } else {
			localStorage.removeItem('rememberedEmail');
		  }
		  
		  // Reindirizza
		  loginLogger.debug('Reindirizzamento a', POST_LOGIN_REDIRECT);
		  goto(POST_LOGIN_REDIRECT);
		} else {
		  // Gestisci fallimento
		  errorMessage = response.error || 'Login fallito. Verifica le tue credenziali.';
		  loginLogger.warn('Login fallito', errorMessage);
		  
		  // Focus sul pulsante di invio per accessibilità
		  submitButton?.focus();
		}
	  } catch (error) {
		// Gestisci errori inaspettati
		console.error('Login error:', error);
		const errorMsg = error instanceof Error ? error.message : 'Errore sconosciuto';
		errorMessage = 'Si è verificato un errore durante il login. Riprova più tardi.';
		
		loginLogger.error('Errore durante il login', errorMsg);
		
		// Focus sul pulsante di invio per accessibilità
		submitButton?.focus();
	  } finally {
		isLoading = false;
	  }
	}
	
	// Gestisce l'invio del form con il tasto Enter
	function handleKeydown(event: KeyboardEvent) {
	  if (event.key === 'Enter' && !isLoading) {
		event.preventDefault();
		handleSubmit();
	  }
	}
  </script>
  
  <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
	<!-- Logo o titolo -->
	<div class="text-center mb-8">
	  <h1 class="text-2xl font-bold text-gray-900">Accedi a UfficioBrevetti</h1>
	  <p class="mt-2 text-sm text-gray-600">Inserisci le tue credenziali per accedere al sistema</p>
	</div>
	
	<!-- Mostra messaggio di errore generale se presente -->
	{#if errorMessage}
	  <div class="p-3 rounded-md bg-red-50 text-red-700 text-sm" role="alert">
		<p>{errorMessage}</p>
	  </div>
	{/if}
	
	<!-- Campo Email -->
	<div>
	  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
		Email
	  </label>
	  <input
		id="email"
		type="email"
		on:keydown={handleKeydown}
		bind:value={email}
		bind:this={emailInput}
		class="w-full px-3 py-2 border {emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
		placeholder="esempio@dominio.it"
		on:blur={validateEmail}
		autocomplete="email"
		required
	  />
	  {#if emailError}
		<p class="mt-1 text-sm text-red-600">{emailError}</p>
	  {/if}
	</div>
	
	<!-- Campo Password -->
	<div>
	  <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
		Password
	  </label>
	  <input
		id="password"
		type="password"
		on:keydown={handleKeydown}
		bind:value={password}
		bind:this={passwordInput}
		class="w-full px-3 py-2 border {passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
		placeholder="••••••••"
		on:blur={validatePassword}
		autocomplete="current-password"
		required
	  />
	  {#if passwordError}
		<p class="mt-1 text-sm text-red-600">{passwordError}</p>
	  {/if}
	</div>
	
	<!-- Opzioni aggiuntive -->
	<div class="flex items-center justify-between">
	  <div class="flex items-center">
		<input
		  id="remember-me"
		  type="checkbox"
		  bind:checked={rememberMe}
		  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
		/>
		<label for="remember-me" class="ml-2 block text-sm text-gray-700">
		  Ricordami
		</label>
	  </div>
	  
	  <div>
		<a href="/recupero-password" class="text-sm font-medium text-blue-600 hover:text-blue-500">
		  Password dimenticata?
		</a>
	  </div>
	</div>
	
	<!-- Pulsante Login -->
	<div>
	  <button
		type="submit"
		bind:this={submitButton}
		class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		disabled={isLoading}
	  >
		{#if isLoading}
		  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
		  </svg>
		  Accesso in corso...
		{:else}
		  Accedi
		{/if}
	  </button>
	</div>
	
	<!-- Link registrazione -->
	<div class="text-center text-sm">
	  <p class="text-gray-600">
		Non hai un account?
		<a href="/registrazione" class="font-medium text-blue-600 hover:text-blue-500">
		  Contatta l'amministratore
		</a>
	  </p>
	</div>
  </form>