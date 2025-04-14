// src/lib/utils/logger.ts
import { browser } from '$app/environment';

// Livelli di log
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

// Configura il livello di log predefinito o prendi da variabili d'ambiente
const DEFAULT_LOG_LEVEL: LogLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info';

// Mappa dei livelli di log e loro priorità
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};

// Colori per console
const LOG_COLORS = {
  debug: 'color: #7f7f7f',
  info: 'color: #0088ff',
  warn: 'color: #ff9800',
  error: 'color: #f44336',
  silent: 'color: #000000'
};

// Stato globale per il logging
const state = {
  level: DEFAULT_LOG_LEVEL,
};

// Funzione per impostare il livello di log
export function setLogLevel(level: LogLevel): void {
  state.level = level;
}

// Funzione di logging principale
function createLog(level: LogLevel, ...args: unknown[]): void {

    if (level === 'silent' || LOG_LEVELS[state.level] > LOG_LEVELS[level]) {
        return;
      }

      const timestamp = new Date().toISOString();
      const prefix = browser ? `[${level.toUpperCase()}]` : `[SERVER][${level.toUpperCase()}]`;

    
    if (browser) {
      // Nel browser, usiamo stili più belli
      console.log(`%c${prefix} ${timestamp}`, LOG_COLORS[level], ...args);
    } else {
      // Sul server, manteniamo semplice
      console.log(`${prefix} ${timestamp}`, ...args);
    }
  
}

// API del logger
export const logger = {
  // Imposta il livello di log
  setLevel: setLogLevel,
  
  // Ottiene il livello di log corrente
  getLevel: (): LogLevel => state.level,
  
  // Metodi di logging
  debug: (...args: unknown[]) => createLog('debug', ...args),
  log: (...args: unknown[]) => createLog('info', ...args),
  info: (...args: unknown[]) => createLog('info', ...args),
  warn: (...args: unknown[]) => createLog('warn', ...args),
  error: (...args: unknown[]) => createLog('error', ...args),
  
  // Genera un logger con prefisso (utile per componenti specifici)
  withPrefix: (prefix: string) => ({
    debug: (...args: unknown[]) => createLog('debug', `[${prefix}]`, ...args),
    log: (...args: unknown[]) => createLog('info', `[${prefix}]`, ...args),
    info: (...args: unknown[]) => createLog('info', `[${prefix}]`, ...args),
    warn: (...args: unknown[]) => createLog('warn', `[${prefix}]`, ...args),
    error: (...args: unknown[]) => createLog('error', `[${prefix}]`, ...args),
  })
};