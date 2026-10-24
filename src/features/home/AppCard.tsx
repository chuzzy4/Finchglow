/**
 * src/features/home/AppCard.tsx
 *
 * A single launcher card in the app grid.
 *
 * HOW HUGEICONS WORKS in this codebase:
 * Icons from @hugeicons/core-free-icons are React components themselves.
 * Render them directly: <ArrowRight01Icon size={16} aria-hidden="true" />
 * The `icon` prop here is typed as ComponentType so AppGrid can pass any icon.
 */

import type { ComponentType } from 'react'
import { ArrowRight01Icon } from '../../lib/icon'
import type { App } from '../../types'

// Minimal props that every Hugeicons free icon accepts
export type HugeIconProps = {
  size?: number
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  color?: string
}

interface AppCardProps {
  app: App
  icon: ComponentType<HugeIconProps>
}

export function AppCard({ app, icon: Icon }: AppCardProps) {
  return (
    <a
      href={app.url}
      aria-label={`Open ${app.name}`}
      className={[
        'group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5',
        'transition-shadow hover:shadow-md hover:border-tint',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
        'min-h-11',
      ].join(' ')}
      onClick={(e) => e.preventDefault()}
    >
      {/* Top row: icon in tinted circle + chevron */}
      <div className="flex items-start justify-between">
        <span className="flex size-10 items-center justify-center rounded-lg bg-tint">
          <Icon size={20} aria-hidden="true" className="text-accent" />
        </span>
        <ArrowRight01Icon
          size={16}
          aria-hidden="true"
          className="text-border group-hover:text-accent transition-colors mt-1"
        />
      </div>

      {/* Name + description */}
      <div>
        <p className="font-semibold text-sm text-text">{app.name}</p>
        <p className="mt-0.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
          {app.description}
        </p>
      </div>
    </a>
  )
}
