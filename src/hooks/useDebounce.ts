/**
 * src/hooks/useDebounce.ts
 *
 * Returns a debounced version of the input value.
 * The returned value only updates after the input has been stable
 * for `delayMs` milliseconds.
 */

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
