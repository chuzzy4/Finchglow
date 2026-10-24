/**
 * src/features/alerts/AlertsBanner.tsx
 *
 * Pinned full-width critical alert banner.
 *
 * Icons are imported from @hugeicons/core-free-icons and used directly as JSX
 * components — no HugeiconsIcon wrapper exists in this package.
 *
 * Severity colours are fixed — NEVER use company accent inside this banner.
 */

import { useState } from 'react'
import {
  AlertDiamondIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from '../../lib/icon'
import { filterByCompany } from '../../lib/filterItems'
import { timeAgo } from '../../lib/timeago'
import type { Alert } from '../../types'

interface AlertsBannerProps {
  alerts: Alert[] | null
  companyId: string
}

export function AlertsBanner({ alerts, companyId }: AlertsBannerProps) {
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())

  if (!alerts) return null

  const criticals = filterByCompany(alerts, companyId).filter(
    (a) => a.severity === 'critical',
  )

  if (criticals.length === 0) return null

  const unacknowledged = criticals.filter((a) => !acknowledgedIds.has(a.id))
  const acknowledgedCount = criticals.length - unacknowledged.length

  function acknowledge(id: string) {
    setAcknowledgedIds((prev) => new Set([...prev, id]))
  }

  // ── Slim persistent bar after all criticals are acknowledged ──
  if (unacknowledged.length === 0) {
    return (
      <div
        role="status"
        className="bg-critical-bar-bg text-critical-fg px-4 py-1.5"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <CheckmarkCircle01Icon size={14} aria-hidden="true" />
          <span>
            <strong>
              {acknowledgedCount} incident{acknowledgedCount > 1 ? 's' : ''} active
            </strong>
            {' — '}
            {criticals[0]!.title}
          </span>
        </div>
      </div>
    )
  }

  // ── Full-width banner for the top unacknowledged critical ──
  const top = unacknowledged[0]!

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="bg-critical-bg text-critical-fg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Icon + text block */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <AlertDiamondIcon size={20} aria-hidden="true" className="shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Text label — colour is NOT the only indicator */}
              <span className="inline-flex items-center rounded bg-white/20 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide">
                Critical
              </span>
              <span className="font-semibold text-sm">{top.title}</span>
              <span className="text-xs opacity-75">
                • {timeAgo(top.minutesAgo)}
                {top.incidentId && ` (Group-wide Incident ${top.incidentId})`}
              </span>
            </div>
            <p className="mt-1 text-xs opacity-90 leading-relaxed">{top.body}</p>
          </div>
        </div>

        {/* Acknowledge button */}
        <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
          <button
            onClick={() => acknowledge(top.id)}
            aria-label={`Acknowledge: ${top.title}`}
            className="rounded-md border border-white/40 px-4 py-2 text-sm font-medium min-h-11 hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <Cancel01Icon size={14} aria-hidden="true" />
            Acknowledge
          </button>
        </div>
      </div>

      {/* Additional criticals count */}
      {unacknowledged.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2">
          <p className="text-xs opacity-75">
            + {unacknowledged.length - 1} more critical alert
            {unacknowledged.length - 1 > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
