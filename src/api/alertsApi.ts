/**
 * src/api/alertsApi.ts
 *
 * Fetches alerts/news. minutesAgo values are converted to Date objects here
 * so all components receive real dates rather than raw numbers.
 *
 * Callers receive all alerts; company filtering happens via filterByCompany().
 */

import { fakeFetch } from './client'
import rawAlerts from '../data/alerts.json'
import type { Alert } from '../types'

// The JSON stores minutesAgo as a number; we keep the Alert type using it too
// so the runtime date is derived when needed (in timeago.ts).
const alerts = rawAlerts as Alert[]

export async function getAlerts(): Promise<Alert[]> {
  return fakeFetch(alerts)
}
