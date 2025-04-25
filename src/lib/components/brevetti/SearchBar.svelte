<script lang="ts">
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    
    // Crea store per tutti i campi del form
    const searchQuery = writable('');
    const isAdvancedSearch = writable(false);
    const searchError = writable('');
    const isLoading = writable(false);
    
    // Advanced search fields
    const status = writable('');
    const owner = writable('');
    const dateFrom = writable('');
    const dateTo = writable('');
    
    // Toggle advanced search visibility
    function toggleAdvancedSearch() {
      isAdvancedSearch.update(value => !value);
    }
    
    // Handle form submission with validation
    async function handleSearch(e: SubmitEvent) {
      e.preventDefault();
      
      // Clear previous errors
      searchError.set('');
      
      // Validate search query if advanced search is not active
      if (!$searchQuery.trim() && !$isAdvancedSearch) {
        searchError.set('Inserisci un termine di ricerca');
        return;
      }
      
      // Build search parameters
      const searchParams = {
        query: $searchQuery || '',
        filters: {} as Record<string, string>
      };
      
      // Add advanced search parameters if they exist
      if ($isAdvancedSearch) {
        if ($status) searchParams.filters['stato'] = $status;
        if ($owner) searchParams.filters['titolare'] = $owner;
        if ($dateFrom) searchParams.filters['dataInizio'] = $dateFrom;
        if ($dateTo) searchParams.filters['dataFine'] = $dateTo;
        
        // If no parameters were provided in advanced search, show error
        if (!$searchQuery && !Object.keys(searchParams.filters).length) {
          searchError.set('Inserisci almeno un criterio di ricerca');
          return;
        }
      }
      
      try {
        // Set loading state
        isLoading.set(true);
        
        // Qui in futuro chiamerai il servizio per lo scraping
        // const results = await fetchPatentResults(searchParams);
        
        // Per ora, costruisci l'URL per la ricerca interna
        let url = `/brevetti?search=${encodeURIComponent($searchQuery || '')}`;
        
        if ($isAdvancedSearch) {
          if ($status) url += `&stato=${encodeURIComponent($status)}`;
          if ($owner) url += `&titolare=${encodeURIComponent($owner)}`;
          if ($dateFrom) url += `&dataInizio=${encodeURIComponent($dateFrom)}`;
          if ($dateTo) url += `&dataFine=${encodeURIComponent($dateTo)}`;
        }
        
        // Navigate to search results
        goto(url);
      } catch (error) {
        console.error('Error during search:', error);
        searchError.set('Si è verificato un errore durante la ricerca. Riprova più tardi.');
      } finally {
        isLoading.set(false);
      }
    }
  </script>
  
  <div class="w-full max-w-4xl mx-auto mt-8 px-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Ricerca Brevetti</h1>
      <p class="text-gray-600">Trova brevetti, marchi e design industriali nel database dell'Ufficio Brevetti</p>
    </div>
    
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <form on:submit={handleSearch} class="p-4">
        <div class="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-300">
          <input
            type="text"
            class="flex-grow px-4 py-3 text-lg focus:outline-none"
            placeholder="Cerca per titolo, numero, descrizione..."
            bind:value={$searchQuery}
            aria-label="Termine di ricerca"
          />
          <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 transition-colors focus:outline-none flex items-center"
            aria-label="Cerca brevetti"
            disabled={$isLoading}
          >
            {#if $isLoading}
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Ricerca...</span>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            {/if}
          </button>
        </div>
        
        {#if $searchError}
          <div class="text-red-500 text-sm mt-1" role="alert">{$searchError}</div>
        {/if}
        
        <div class="flex justify-end mt-2">
          <button 
            type="button" 
            class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
            on:click={toggleAdvancedSearch}
            aria-expanded={$isAdvancedSearch}
            aria-controls="advanced-search-panel"
          >
            {$isAdvancedSearch ? 'Ricerca semplice' : 'Ricerca avanzata'}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={$isAdvancedSearch ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
        </div>
        
        {#if $isAdvancedSearch}
          <div id="advanced-search-panel" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Stato brevetto</label>
              <select 
                id="status"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                bind:value={$status}
              >
                <option value="">Tutti gli stati</option>
                <option value="DEPOSITO">Deposito</option>
                <option value="ESAME">Esame</option>
                <option value="CONCESSIONE">Concessione</option>
                <option value="ATTIVO">Attivo</option>
                <option value="SCADUTO">Scaduto</option>
                <option value="DECADUTO">Decaduto</option>
                <option value="RINUNCIATO">Rinunciato</option>
                <option value="ANNULLATO">Annullato</option>
              </select>
            </div>
            
            <div>
              <label for="owner" class="block text-sm font-medium text-gray-700 mb-1">Titolare</label>
              <input 
                id="owner"
                type="text" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                placeholder="Nome del titolare"
                bind:value={$owner}
              />
            </div>
            
            <div>
              <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">Data deposito da</label>
              <input 
                id="dateFrom"
                type="date" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                bind:value={$dateFrom}
              />
            </div>
            
            <div>
              <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-1">Data deposito a</label>
              <input 
                id="dateTo"
                type="date" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                bind:value={$dateTo}
              />
            </div>
          </div>
        {/if}
      </form>
      
      <div class="px-4 py-3 bg-gray-50 border-t">
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-gray-600">Ricerche rapide:</span>
          <a href="/brevetti?stato=ATTIVO" class="text-sm text-blue-500 hover:text-blue-700">Brevetti attivi</a>
          <a href="/scadenze" class="text-sm text-blue-500 hover:text-blue-700">In scadenza (30gg)</a>
          <a href="/brevetti?sortBy=dataDeposito&sortOrder=desc" class="text-sm text-blue-500 hover:text-blue-700">Ultimi depositati</a>
        </div>
      </div>
    </div>
    
    <!-- Risultati recenti o suggerimenti -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white rounded-lg shadow">
        <h3 class="font-medium text-gray-800 mb-2">Statistiche</h3>
        <p class="text-gray-600">Esplora le statistiche dei brevetti nel sistema</p>
        <a href="/dashboard" class="mt-2 inline-block text-sm text-blue-500 hover:text-blue-700">
          Vai alla dashboard →
        </a>
      </div>
      
      <div class="p-4 bg-white rounded-lg shadow">
        <h3 class="font-medium text-gray-800 mb-2">Scadenze</h3>
        <p class="text-gray-600">Monitora i brevetti in scadenza nei prossimi giorni</p>
        <a href="/scadenze" class="mt-2 inline-block text-sm text-blue-500 hover:text-blue-700">
          Visualizza scadenze →
        </a>
      </div>
      
      <div class="p-4 bg-white rounded-lg shadow">
        <h3 class="font-medium text-gray-800 mb-2">Registro</h3>
        <p class="text-gray-600">Accedi al registro completo dei brevetti</p>
        <a href="/brevetti" class="mt-2 inline-block text-sm text-blue-500 hover:text-blue-700">
          Consulta registro →
        </a>
      </div>
    </div>
  </div>