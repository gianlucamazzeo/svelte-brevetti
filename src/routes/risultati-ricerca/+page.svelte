<script lang="ts">
    import { onMount } from 'svelte';
  
    interface PatentResult {
      title: string;
      number: string;
      applicant: string;
      inventors: string[];
      filingDate: string;
      abstract: string;
      thumbnailUrl?: string;
      patentUrl: string;
    }
  
    let results: PatentResult[] = [];
    let isLoading = true;
    let error = '';
  
    onMount(() => {
      try {
        const storedResults = localStorage.getItem('patentSearchResults');
        if (storedResults) {
          results = JSON.parse(storedResults);
        } else {
          error = 'Nessun risultato di ricerca disponibile. Effettua una nuova ricerca.';
        }
      } catch (e) {
        console.error('Error loading search results:', e);
        error = 'Errore nel caricamento dei risultati';
      } finally {
        isLoading = false;
      }
    });
  </script>
  
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Risultati della ricerca</h1>
  
    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <p>{error}</p>
      </div>
    {:else if results.length === 0}
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Nessun risultato trovato. Prova con altri termini di ricerca.</p>
      </div>
    {:else}
      <p class="mb-4">Trovati {results.length} risultati</p>
      
      <div class="grid grid-cols-1 gap-6">
        {#each results as patent}
          <div class="bg-white shadow-md rounded-lg overflow-hidden flex">
            {#if patent.thumbnailUrl}
              <div class="w-32 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                <img src={patent.thumbnailUrl} alt="Patent thumbnail" class="max-w-full max-h-32 object-contain" />
              </div>
            {/if}
            
            <div class="p-4 flex-grow">
              <h2 class="text-xl font-semibold text-blue-600 hover:text-blue-800">
                <a href={patent.patentUrl} target="_blank" rel="noopener noreferrer">{patent.title}</a>
              </h2>
              
              <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div><span class="font-medium">Numero:</span> {patent.number}</div>
                <div><span class="font-medium">Data:</span> {patent.filingDate}</div>
                <div><span class="font-medium">Richiedente:</span> {patent.applicant}</div>
                <div>
                  <span class="font-medium">Inventori:</span> {patent.inventors.join(', ')}
                </div>
              </div>
              
              <p class="mt-3 text-gray-600 line-clamp-3">{patent.abstract}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>