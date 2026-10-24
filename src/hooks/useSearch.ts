/**
 * src/hooks/useSearch.ts
 *
 * Manages search query, scope, debounced value, and loading state.
 * The loading state is simulated for 300 ms after the debounced value changes
 * to give a realistic skeleton experience.
 */

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from './useDebounce'
import type { SearchScope } from '../features/search/SearchBar'

interface UseSearchResult {
  query: string
  debouncedQuery: string
  scope: SearchScope
  isSearching: boolean
  setQuery: (q: string) => void
  setScope: (s: SearchScope) => void
  clearSearch: () => void
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<SearchScope>('all')
  const [isSearching, setIsSearching] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  // Show "searching" skeleton for 300 ms after debounce settles
  useEffect(() => {
    if (!debouncedQuery) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const timer = setTimeout(() => setIsSearching(false), 300)
    return () => clearTimeout(timer)
  }, [debouncedQuery])

  const clearSearch = useCallback(() => {
    setQuery('')
    setScope('all')
  }, [])

  return { query, debouncedQuery, scope, isSearching, setQuery, setScope, clearSearch }
}
