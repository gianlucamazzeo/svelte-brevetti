# Svelte Brevetti Frontend

<p align="center">
 <img src="https://svelte.dev/svelte-logo.svg" alt="Svelte Brevetti Logo" width="200"/>
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

Frontend dell'applicazione UfficioBrevetti, sviluppato con [Svelte](https://svelte.dev) e TypeScript. L'applicazione si connette al [backend NestJS](https://github.com/gianlucamazzeo/nest-brevetti) per offrire un'interfaccia utente completa per la gestione di brevetti, marchi e design industriali.

## 🚀 Caratteristiche

- 📊 **Dashboard interattiva** con statistiche e analisi sui brevetti
- 📋 **Gestione brevetti** con lista completa, filtri avanzati e paginazione
- 🔍 **Ricerca avanzata** su tutti i brevetti nel sistema
- 📅 **Monitoraggio scadenze** con notifiche per scadenze imminenti
- 👥 **Gestione titolari** con anagrafica completa
- 📝 **Dettaglio brevetto** con timeline e possibilità di aggiungere note
- 🔔 **Sistema di notifiche** per aggiornamenti importanti
- 🔒 **Autenticazione** e gestione profilo utente

## 🛠️ Tecnologie

- **Framework**: [Svelte](https://svelte.dev) con [SvelteKit](https://kit.svelte.dev/)
- **Linguaggio**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: Custom Svelte components
- **State Management**: Svelte stores
- **API Client**: Fetch API con wrapper typesafe
- **Grafici**: [D3.js](https://d3js.org/) integrato con Svelte

## 🏗️ Architettura del Progetto

```
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
```

## 🚀 Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/tuo-username/svelte-brevetti.git
   cd svelte-brevetti
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Crea un file `.env` nella root con le seguenti variabili:
   ```
   PUBLIC_API_URL=http://localhost:3000
   ```

4. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

5. Apri il browser all'indirizzo [http://localhost:5173](http://localhost:5173)

## 🔄 Connessione con il Backend

Questo frontend è progettato per lavorare con il backend [nest-brevetti](https://github.com/tuo-username/nest-brevetti). Assicurati di avere il backend in esecuzione prima di utilizzare questa applicazione.

## 📝  Da completare

### 1: Definizione Tipi e Strutture Dati
- Crea un file `types.ts` con le interfacce necessarie per i brevetti
- Definisci un enum per i possibili stati di un brevetto
- Crea un tipo per le notifiche di scadenza

### 2: Componente Header e Navigazione
- Crea un componente `Header.svelte` con il logo e la navigazione principale
- Implementa un menu di navigazione con link alle sezioni principali
- Aggiungi un indicatore per le notifiche non lette

### 3: Dashboard
- Implementa la pagina dashboard con statistiche di base
- Crea un componente per mostrare i brevetti in scadenza nei prossimi 30 giorni
- Aggiungi un grafico che mostra i brevetti per stato

### 4: Lista Brevetti
- Crea un componente `BrevettoCarta.svelte` per visualizzare i dati essenziali di un brevetto
- Implementa la pagina che mostra tutti i brevetti con paginazione
- Aggiungi filtri per stato, titolare e data di deposito

### 5: Store e Gestione Stato
- Crea uno store Svelte per gestire i dati dei brevetti
- Implementa funzioni per filtrare e ordinare i brevetti
- Aggiungi persistenza locale con localStorage

### 6: Pagina Dettaglio Brevetto
- Crea una pagina dettaglio che mostra tutte le informazioni di un brevetto
- Aggiungi una timeline che mostra la storia del brevetto
- Implementa la funzionalità per aggiungere note a un brevetto

### 7: Sistema di Notifiche
- Crea un componente `Notifiche.svelte` per visualizzare le notifiche
- Implementa uno store per gestire le notifiche
- Aggiungi un sistema per marcare le notifiche come lette

## 🧪 Testing

```bash
npm run test
```

## 🏗️ Build per la produzione

```bash
npm run build
```

Puoi visualizzare l'anteprima della build con:

```bash
npm run preview
```

## 📚 Risorse utili

- [Documentazione Svelte](https://svelte.dev/docs)
- [Documentazione SvelteKit](https://kit.svelte.dev/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.
