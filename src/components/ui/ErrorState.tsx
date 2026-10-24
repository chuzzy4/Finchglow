/**
 * src/components/ui/ErrorState.tsx
 *
 * Error display with a retry button.
 * Used whenever an API call fails.
 *
 * Icon is imported directly from @hugeicons/core-free-icons and used as a
 * JSX component — no HugeiconsIcon wrapper needed.
 */

import { AlertCircleIcon } from '../../lib/icon'
import type { ReactNode } from 'react'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
  children?: ReactNode
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 py-10 text-center text-text-secondary"
    >
      <AlertCircleIcon
        size={32}
        aria-hidden="true"
        className="text-warning-fg"
      />
      <p className="text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent min-h-11 hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  )
}
