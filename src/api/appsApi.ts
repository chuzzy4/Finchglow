/**
 * src/api/appsApi.ts
 *
 * Fetches the list of apps. Callers receive all apps; filtering by company
 * happens in components via filterByCompany() so the cache holds full data.
 */

import { fakeFetch } from './client'
import rawApps from '../data/apps.json'
import type { App } from '../types'

// Cast the JSON import — scope can be "group" or string[]
const apps = rawApps as App[]

export async function getApps(): Promise<App[]> {
  return fakeFetch(apps)
}
