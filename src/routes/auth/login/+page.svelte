<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Form state
	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let errorMessage = '';

	// Validazione form
	let emailError = '';
	let passwordError = '';

	// Controlla se il form è valido
	$: isValid = email.trim() !== '' && password.trim() !== '' && !emailError && !passwordError;

	// Reindirizza alla dashboard se l'utente è già autenticato
	onMount(() => {
		if ($auth.isAuthenticated) {
			goto('/');
		}
	});

	// Valida l'email
	function validateEmail() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) {
			emailError = 'Email richiesta';
		} else if (!emailRegex.test(email)) {
			emailError = 'Email non valida';
		} else {
			emailError = '';
		}
	}

	// Valida la password
	function validatePassword() {
		if (!password.trim()) {
			passwordError = 'Password richiesta';
		} else if (password.length < 6) {
			passwordError = 'La password deve contenere almeno 6 caratteri';
		} else {
			passwordError = '';
		}
	}

	// Gestisce il submit del form
	async function handleSubmit() {
		// Valida form
		validateEmail();
		validatePassword();

		if (!isValid) return;

		isLoading = true;
		errorMessage = '';

		try {
			const success = await auth.login(email, password);

			if (success) {
				goto('/');
			} else {
				errorMessage = $auth.error || 'Login fallito. Verifica le tue credenziali.';
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'Si è verificato un errore durante il login. Riprova più tardi.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login | UfficioBrevetti</title>
</svelte:head>

<div>
	<h3 class="mb-4 text-xl font-medium text-gray-900">Accedi alla tua area riservata</h3>

	<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<div class="relative mt-1 rounded-md shadow-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						class="h-5 w-5 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
					</svg>
				</div>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					bind:value={email}
					on:blur={validateEmail}
					class="block w-full rounded-md border-gray-300 py-2 pl-10 transition-colors duration-300 focus:border-blue-500 focus:ring-blue-500 {emailError
						? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
						: ''}"
					placeholder="tuonome@azienda.com"
				/>
			</div>
			{#if emailError}
				<p class="mt-1 text-sm text-red-600">{emailError}</p>
			{/if}
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
			<div class="relative mt-1 rounded-md shadow-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						class="h-5 w-5 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					bind:value={password}
					on:blur={validatePassword}
					class="block w-full rounded-md border-gray-300 py-2 pl-10 transition-colors duration-300 focus:border-blue-500 focus:ring-blue-500 {passwordError
						? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
						: ''}"
					placeholder="••••••••••"
				/>
			</div>
			{#if passwordError}
				<p class="mt-1 text-sm text-red-600">{passwordError}</p>
			{/if}
		</div>

		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<input
					id="remember-me"
					name="remember-me"
					type="checkbox"
					bind:checked={rememberMe}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="remember-me" class="ml-2 block text-sm text-gray-700"> Ricordami </label>
			</div>

			<div class="text-sm">
				<a
					href="/auth/forgot-password"
					class="font-medium text-blue-600 transition-colors duration-300 hover:text-blue-500"
				>
					Password dimenticata?
				</a>
			</div>
		</div>

		{#if errorMessage}
			<div class="rounded-md border-l-4 border-red-400 bg-red-50 p-3">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-red-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-700">
							{errorMessage}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<div>
			<button
				type="submit"
				disabled={!isValid || isLoading}
				class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isLoading}
					<svg
						class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Accesso in corso...
				{:else}
					Accedi
				{/if}
			</button>
		</div>
	</form>

	<div class="mt-4 text-center">
		<p class="text-sm text-gray-600">
			Non hai ancora un account?
			<a
				href="/auth/register"
				class="font-medium text-blue-600 transition-colors duration-300 hover:text-blue-500"
			>
				Registrati
			</a>
		</p>
	</div>
</div>
