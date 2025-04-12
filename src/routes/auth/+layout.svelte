<script lang="ts">
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
</script>

<div class="h-screen flex items-center justify-center bg-gray-100" in:fade={{ duration: 300, delay: 150 }}>
  <div class="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-6 text-center">
      <div class="flex justify-center mb-2">
        <svg
          class="h-12 w-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold">UfficioBrevetti</h1>
      <p class="mt-1 text-sm opacity-90">Gestione Brevetti e Marchi</p>
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <slot />
    </div>
    
    <!-- Footer -->
    <div class="p-3 text-center text-xs text-gray-500 border-t border-gray-100">
      <p>© {new Date().getFullYear()} UfficioBrevetti - Tutti i diritti riservati</p>
    </div>
  </div>
</div>