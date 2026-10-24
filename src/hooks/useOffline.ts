/**
 * src/hooks/useOffline.ts
 *
 * Tracks the browser's online/offline status and the timestamp of the
 * last successful data fetch (read from IndexedDB).
 *
 * Returns:
 *   isOffline      — true when navigator.onLine is false
 *   lastUpdated    — ISO string of last successful cache write, or null
 */

import { useState, useEffect } from 'react'
import { readStore } from '../lib/idb'

interface OfflineState {
  isOffline: boolean
  lastUpdated: string | null
}

export function useOffline(): OfflineState {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    // Read the cached timestamp on mount
    readStore<string>('cacheTimestamp').then((ts) => setLastUpdated(ts))

    const goOffline = () => setIsOffline(true)
    const goOnline = () => setIsOffline(false)

    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  return { isOffline, lastUpdated }
}
