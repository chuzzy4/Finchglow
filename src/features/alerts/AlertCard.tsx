/**
 * src/features/alerts/AlertCard.tsx
 *
 * A single item in the Alerts & News feed.
 * Icons come from src/lib/icon.ts (real React components created via
 * createHugeiconComponent).
 *
 * Severity badge uses icon + text — colour is never the only signal (WCAG 1.4.1).
 */

import type { ComponentType } from 'react'
import {
  InformationCircleIcon,
  Alert01Icon,
  AlertDiamondIcon,
} from '../../lib/icon'
import { Badge } from '../../components/ui/Badge'
import { timeAgo } from '../../lib/timeago'
import type { Alert } from '../../types'

type HugeIconProps = { size?: number; className?: string; 'aria-hidden'?: string }

const SEVERITY_ICON: Record<Alert['severity'], ComponentType<HugeIconProps>> = {
  info:     InformationCircleIcon as unknown as ComponentType<HugeIconProps>,
  warning:  Alert01Icon           as unknown as ComponentType<HugeIconProps>,
  critical: AlertDiamondIcon      as unknown as ComponentType<HugeIconProps>,
}

const SEVERITY_ICON_CLASS: Record<Alert['severity'], string> = {
  info:     'text-info-fg',
  warning:  'text-warning-fg',
  critical: 'text-critical-bg',
}

interface AlertCardProps { alert: Alert }

function scopeLabel(scope: Alert['scope']): string {
  if (scope === 'group') return 'Group-wide'
  if ((scope as string[]).length === 1) return scope[0] as string
  return 'Multiple companies'
}

export function AlertCard({ alert }: AlertCardProps) {
  const Icon = SEVERITY_ICON[alert.severity]

  return (
    <article
      className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-2"
      aria-label={`${alert.severity} ${alert.type}: ${alert.title}`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Icon size={14} aria-hidden="true" className={SEVERITY_ICON_CLASS[alert.severity]} />
          <Badge variant="severity" severity={alert.severity} />
        </div>
        <Badge variant="scope" label={scopeLabel(alert.scope)} />
        <span className="ml-auto text-xs text-text-secondary shrink-0">
          {timeAgo(alert.minutesAgo)}
        </span>
      </div>
      <p className="font-semibold text-sm text-text leading-snug">{alert.title}</p>
      <p className="text-xs text-text-secondary leading-relaxed">{alert.body}</p>
    </article>
  )
}
