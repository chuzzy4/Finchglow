/**
 * src/features/alerts/AlertsFeed.tsx
 *
 * Right-panel Alerts & News feed.
 * - Tab buttons: All / Alerts / News (not the company tablist — plain buttons)
 * - aria-live="polite" region announces when new items arrive
 * - Filtered by active company; group-scope items always visible
 */

import { useState } from 'react'
import { AlertCard } from './AlertCard'
import { SkeletonBlock } from '../../components/ui/SkeletonBlock'
import { ErrorState } from '../../components/ui/ErrorState'
import { filterByCompany } from '../../lib/filterItems'
import type { Alert } from '../../types'

type FeedTab = 'all' | 'alerts' | 'news'

interface AlertsFeedProps {
  alerts: Alert[] | null
  loading: boolean
  error: string | null
  companyId: string
  onRetry: () => void
}

export function AlertsFeed({
  alerts,
  loading,
  error,
  companyId,
  onRetry,
}: AlertsFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>('all')

  const filtered = filterByCompany(alerts ?? [], companyId).filter((a) => {
    if (activeTab === 'alerts') return a.type === 'alert'
    if (activeTab === 'news') return a.type === 'news'
    return true
  })

  // Sort: critical first, then by recency
  const sorted = [...filtered].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    const diff = severityOrder[a.severity] - severityOrder[b.severity]
    if (diff !== 0) return diff
    return a.minutesAgo - b.minutesAgo
  })

  return (
    /*
     * The section owns its own scroll container.
     * max-h is: viewport minus sticky header (~52px) minus main padding (48px).
     * On mobile the section grows to content height (no cap) so the page
     * scrolls normally. On lg+ it caps and scrolls internally.
     */
    <section
      aria-label="Alerts and News"
      className="flex flex-col lg:max-h-[calc(100vh-116px)] lg:overflow-y-auto"
    >
      {/* Panel header — sticky so it never scrolls away.
       *  Mobile: sticks below the app header (top-[52px]).
       *  lg+: sticks at top-0 inside the section's own overflow-y-auto. */}
      <div className="sticky top-[52px] lg:top-0 z-10 bg-bg pt-0.5 pb-2 flex items-center justify-between">
        <h2 className="font-semibold text-sm text-text">Alerts &amp; News</h2>

        {/* Feed scope tabs — these are NOT the company tablist */}
        <div role="group" aria-label="Filter alerts and news" className="flex gap-0.5">
          {(['all', 'alerts', 'news'] as const).map((tab) => (
            <button
              key={tab}
              aria-pressed={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize min-h-8 transition-colors',
                activeTab === tab
                  ? 'bg-bg text-text border border-border shadow-sm'
                  : 'text-text-secondary hover:text-text',
              ].join(' ')}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed body — no overflow here; the section scrolls as a whole */}
      <div
        aria-live="polite"
        aria-label="Alerts and news list"
        className="flex flex-col gap-2 pb-4"
      >
        {loading && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-24" />
            ))}
          </>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={onRetry} />
        )}

        {!loading && !error && sorted.length === 0 && (
          <p className="py-6 text-center text-sm text-text-secondary">
            No {activeTab === 'all' ? 'alerts or news' : activeTab} for this company.
          </p>
        )}

        {!loading && !error && sorted.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  )
}
