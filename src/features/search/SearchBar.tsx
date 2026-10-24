/**
 * src/features/search/SearchBar.tsx
 *
 * Search input with "/" keyboard shortcut, scope chips, and clear button.
 * Icons used directly as JSX components (no HugeiconsIcon wrapper).
 */

import { useEffect, useRef } from 'react'
import { Search01Icon, Cancel01Icon } from '../../lib/icon'

export type SearchScope = 'all' | 'apps' | 'news'

interface SearchBarProps {
  query: string
  scope: SearchScope
  onQueryChange: (q: string) => void
  onScopeChange: (s: SearchScope) => void
}

export function SearchBar({ query, scope, onQueryChange, onScopeChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // "/" key focuses the search field globally
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Input */}
      <div className="relative flex items-center">
        <Search01Icon
          size={16}
          aria-hidden="true"
          className="absolute left-3 text-text-secondary pointer-events-none"
        />
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          role="searchbox"
          aria-label="Search apps and news"
          placeholder="Search apps and news"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className={[
            'w-full rounded-lg border bg-surface pl-9 pr-10 py-2 text-sm',
            'text-text placeholder:text-text-secondary',
            'border-border focus:border-search-ring',
            'outline-none transition-colors duration-150',
          ].join(' ')}
        />
        {/* "/" hint badge — hidden while typing */}
        {!query && (
          <span
            aria-hidden="true"
            className="absolute right-3 rounded border border-border px-1 text-[10px] text-text-secondary font-mono"
          >
            /
          </span>
        )}
        {/* Clear button */}
        {query && (
          <button
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-2 p-1 rounded text-text-secondary hover:text-text min-h-8 min-w-8 flex items-center justify-center"
          >
            <Cancel01Icon size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Scope chips — only visible when query exists */}
      {query && (
        <div role="group" aria-label="Search scope" className="flex gap-1.5">
          {(['all', 'apps', 'news'] as const).map((s) => (
            <button
              key={s}
              aria-pressed={scope === s}
              onClick={() => onScopeChange(s)}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium capitalize min-h-8 transition-colors',
                scope === s
                  ? 'bg-accent text-on-accent'
                  : 'bg-bg border border-border text-text-secondary hover:text-text',
              ].join(' ')}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
