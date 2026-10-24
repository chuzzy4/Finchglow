/**
 * src/features/search/SearchResults.tsx
 *
 * Shows results, skeleton, empty state, or error state.
 * Icons used directly as JSX components.
 */

import type { ReactNode } from 'react'
import {
  AirplaneTakeOff01Icon,
  InformationCircleIcon,
} from '../../lib/icon'
import { SkeletonBlock } from '../../components/ui/SkeletonBlock'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { Badge } from '../../components/ui/Badge'
import { timeAgo } from '../../lib/timeago'
import type { App, Alert } from '../../types'
import type { SearchScope } from './SearchBar'

interface SearchResultsProps {
  query: string
  scope: SearchScope
  apps: App[]
  alerts: Alert[]
  loading: boolean
  error: string | null
  onClear: () => void
  onRetry: () => void
}

function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-tint text-accent font-semibold not-italic rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function SearchResults({
  query,
  scope,
  apps,
  alerts,
  loading,
  error,
  onClear,
  onRetry,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div aria-busy="true" aria-label="Searching…" className="flex flex-col gap-2 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-14" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="mt-3"><ErrorState message={error} onRetry={onRetry} /></div>
  }

  const q = query.toLowerCase()
  const matchedApps =
    scope === 'all' || scope === 'apps'
      ? apps.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q),
        )
      : []
  const matchedAlerts =
    scope === 'all' || scope === 'news'
      ? alerts.filter(
          (a) =>
            a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
        )
      : []

  const total = matchedApps.length + matchedAlerts.length

  if (total === 0) {
    return (
      <div className="mt-3">
        <EmptyState query={query} onClear={onClear} />
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label={`Search results for "${query}"`}
      className="mt-3 flex flex-col gap-1"
    >
      <p className="text-xs text-text-secondary mb-2">
        {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>

      {matchedApps.map((app) => (
        <a
          key={app.id}
          href={app.url}
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 hover:shadow-sm transition-shadow"
        >
          <AirplaneTakeOff01Icon size={16} aria-hidden="true" className="text-accent shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text truncate">
              {highlightMatch(app.name, query)}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {highlightMatch(app.description, query)}
            </p>
          </div>
          <span className="ml-auto text-xs text-text-secondary shrink-0">App</span>
        </a>
      ))}

      {matchedAlerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
        >
          <InformationCircleIcon
            size={16}
            aria-hidden="true"
            className="text-info-fg shrink-0 mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text">
              {highlightMatch(alert.title, query)}
            </p>
            <p className="text-xs text-text-secondary line-clamp-1">
              {highlightMatch(alert.body, query)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <Badge variant="severity" severity={alert.severity} />
            <span className="text-xs text-text-secondary">{timeAgo(alert.minutesAgo)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
