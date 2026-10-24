/**
 * src/api/appsApi.ts
 *
 * Fetches apps. On success, writes to IndexedDB.
 * On failure (or when offline), falls back to IndexedDB cache.
 */

import { fakeFetch } from './client'
import rawApps from '../data/apps.json'
import { readStore, writeStore } from '../lib/idb'
import type { App } from '../types'

const apps = rawApps as App[]

export async function getApps(): Promise<App[]> {
  try {
    const result = await fakeFetch(apps)
    // Cache on success
    await writeStore('apps', result)
    await writeStore('cacheTimestamp', new Date().toISOString())
    return result
  } catch (err) {
    // Fall back to cached data if available
    const cached = await readStore<App[]>('apps')
    if (cached) return cached
    throw err
  }
}
