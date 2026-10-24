/**
 * src/components/ui/Badge.tsx
 *
 * A small label chip used for severity levels and scope indicators.
 * severity prop drives colour via fixed CSS vars (never company-themed).
 * variant="scope" renders a neutral company/group chip.
 */

interface SeverityBadgeProps {
  variant: 'severity'
  severity: 'info' | 'warning' | 'critical'
}

interface ScopeBadgeProps {
  variant: 'scope'
  label: string
}

type BadgeProps = SeverityBadgeProps | ScopeBadgeProps

const SEVERITY_STYLES = {
  info: 'bg-info-bg text-info-fg',
  warning: 'bg-warning-bg text-warning-fg',
  critical: 'bg-critical-bg text-critical-fg',
} as const

const SEVERITY_LABELS = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
} as const

export function Badge(props: BadgeProps) {
  if (props.variant === 'severity') {
    const { severity } = props
    return (
      <span
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${SEVERITY_STYLES[severity]}`}
      >
        {/* Decorative dot — colour is redundant signal, label is primary */}
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current opacity-80" />
        {SEVERITY_LABELS[severity]}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-bg text-text-secondary border border-border">
      {props.label}
    </span>
  )
}
