/**
 * src/api/alertsApi.ts
 *
 * Fetches alerts/news. Writes critical alerts first (separate IDB key)
 * so they survive partial writes — the most important data is always cached.
 * Falls back to IDB cache on failure.
 */

import { fakeFetch } from './client'
import rawAlerts from '../data/alerts.json'
import { readStore, writeStore } from '../lib/idb'
import type { Alert } from '../types'

const alerts = rawAlerts as Alert[]

export async function getAlerts(): Promise<Alert[]> {
  try {
    const result = await fakeFetch(alerts)

    // Write critical alerts first — highest priority for offline resilience
    const criticals = result.filter((a) => a.severity === 'critical')
    await writeStore('criticalAlerts', criticals)

    // Then write all alerts and update timestamp
    await writeStore('alerts', result)
    await writeStore('cacheTimestamp', new Date().toISOString())

    return result
  } catch (err) {
    // Try full cache first, then critical-only cache
    const cached = await readStore<Alert[]>('alerts')
    if (cached) return cached
    const criticals = await readStore<Alert[]>('criticalAlerts')
    if (criticals) return criticals
    throw err
  }
}
