/**
 * src/components/ui/EmptyState.tsx
 *
 * Empty search results display with a "Clear search" button.
 * Icon imported directly from @hugeicons/core-free-icons — used as JSX component.
 */

import { SearchMinusIcon } from '../../lib/icon'

interface EmptyStateProps {
  query: string
  onClear: () => void
}

export function EmptyState({ query, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center text-text-secondary">
      <SearchMinusIcon
        size={32}
        aria-hidden="true"
        className="text-border"
      />
      <p className="text-sm">
        No results for <strong className="text-text">"{query}"</strong>
      </p>
      <button
        onClick={onClear}
        className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary min-h-11 hover:bg-bg transition-colors"
      >
        Clear search
      </button>
    </div>
  )
}
