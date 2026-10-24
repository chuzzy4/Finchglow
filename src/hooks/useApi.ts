/**
 * src/hooks/useApi.ts
 *
 * Generic hook that wraps an async API call with loading / error / data state.
 * Re-runs whenever the `fetcher` function reference changes.
 *
 * Usage:
 *   const { data, loading, error, retry } = useApi(() => getApps())
 */

import { useState, useEffect, useCallback } from 'react'
import type { ApiState } from '../types'

interface UseApiResult<T> extends ApiState<T> {
  retry: () => void
}

export function useApi<T>(fetcher: () => Promise<T>): UseApiResult<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Something went wrong.'
          setState((prev) => ({ ...prev, loading: false, error: message }))
        }
      })

    return () => {
      cancelled = true
    }
    // retryCount changes trigger a re-run; fetcher is stable from useCallback at call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, retryCount])

  const retry = useCallback(() => setRetryCount((n) => n + 1), [])

  return { ...state, retry }
}
