Svelte Brevetti Frontend
<p align="center">
  <img src="static/logo.png" alt="Svelte Brevetti Logo" width="200"/>
  <br>
  <a href="https://svelte.dev">
    <img src="https://img.shields.io/badge/Svelte-v4.0.0-ff3e00.svg?style=flat-square" alt="Svelte">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-v5.0.0-3178c6.svg?style=flat-square" alt="TypeScript">
  </a>
  <a href="https://kit.svelte.dev/">
    <img src="https://img.shields.io/badge/SvelteKit-v2.0.0-ff3e00.svg?style=flat-square" alt="SvelteKit">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT">
  </a>
</p>
Frontend dell'applicazione UfficioBrevetti, sviluppato con Svelte e TypeScript. L'applicazione si connette al backend NestJS per offrire un'interfaccia utente completa per la gestione di brevetti, marchi e design industriali.
🚀 Caratteristiche

📊 Dashboard interattiva con statistiche e analisi sui brevetti
📋 Gestione brevetti con lista completa, filtri avanzati e paginazione
🔍 Ricerca avanzata su tutti i brevetti nel sistema
📅 Monitoraggio scadenze con notifiche per scadenze imminenti
👥 Gestione titolari con anagrafica completa
📝 Dettaglio brevetto con timeline e possibilità di aggiungere note
🔔 Sistema di notifiche per aggiornamenti importanti
🔒 Autenticazione e gestione profilo utente

🛠️ Tecnologie

Framework: Svelte con SvelteKit
Linguaggio: TypeScript
Styling: TailwindCSS
UI Components: Custom Svelte components
State Management: Svelte stores
API Client: Fetch API con wrapper typesafe
Grafici: D3.js integrato con Svelte

🏗️ Architettura del Progetto
svelte-brevetti/
├── src/
│   ├── lib/
│   │   ├── components/       # Componenti riutilizzabili
│   │   │   ├── brevetti/     # Componenti specifici per brevetti
│   │   │   ├── dashboard/    # Componenti per la dashboard
│   │   │   ├── ui/           # Componenti UI generici
│   │   │   └── notifiche/    # Componenti per le notifiche
│   │   ├── stores/           # Svelte stores
│   │   ├── types/            # Interfaces e types
│   │   ├── api/              # Client API
│   │   └── utils/            # Utility functions
│   ├── routes/               # Definizione delle pagine
│   │   ├── +page.svelte      # Homepage (Dashboard)
│   │   ├── brevetti/         # Pagine relative ai brevetti
│   │   ├── titolari/         # Pagine relative ai titolari
│   │   └── scadenze/         # Pagine per le scadenze
│   └── app.d.ts              # Dichiarazioni di tipo globali
├── static/                   # Asset statici (immagini, fonts, etc.)
├── tests/                    # Test per l'applicazione
├── svelte.config.js          # Configurazione Svelte
├── tailwind.config.js        # Configurazione TailwindCSS
├── tsconfig.json             # Configurazione TypeScript
└── vite.config.js            # Configurazione Vite
🚀 Installazione

Clona il repository:
bashgit clone https://github.com/tuo-username/svelte-brevetti.git
cd svelte-brevetti

Installa le dipendenze:
bashnpm install

Crea un file .env nella root con le seguenti variabili:
PUBLIC_API_URL=http://localhost:3000

Avvia il server di sviluppo:
bashnpm run dev

Apri il browser all'indirizzo http://localhost:5173

🔄 Connessione con il Backend
Questo frontend è progettato per lavorare con il backend nest-brevetti. Assicurati di avere il backend in esecuzione prima di utilizzare questa applicazione.