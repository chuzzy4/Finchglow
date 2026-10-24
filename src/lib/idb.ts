/**
 * src/lib/idb.ts
 *
 * A tiny IndexedDB helper. No external library — keeps bundle small.
 *
 * Provides two functions:
 *   readStore(key)       → the stored value, or null if absent
 *   writeStore(key, val) → persists the value
 *
 * All portal data is stored in a single object store ("cache").
 * Keys used by the app:
 *   "apps"            — App[]
 *   "alerts"          — Alert[]
 *   "criticalAlerts"  — Alert[] (subset; written first for resilience)
 *   "cacheTimestamp"  — ISO date string of last successful fetch
 */

const DB_NAME = 'finchglow-portal'
const STORE_NAME = 'cache'
const DB_VERSION = 1

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    req.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
    req.onerror = () => reject(req.error)
  })
}

export async function readStore<T>(key: string): Promise<T | null> {
  try {
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(key)
      req.onsuccess = () => resolve((req.result as T) ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    // IndexedDB unavailable (private browsing, etc.) — degrade gracefully
    return null
  }
}

export async function writeStore<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const req = tx.objectStore(STORE_NAME).put(value, key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch {
    // Fail silently — offline cache is best-effort
  }
}
