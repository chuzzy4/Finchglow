/**
 * src/features/home/Home.tsx
 *
 * The main home panel: personalised greeting, date, app count, and AppGrid.
 * Receives all API state from App.tsx — does not fetch on its own.
 */

import type { App, User } from '../../types'
import { AppGrid } from './AppGrid'

interface HomeProps {
  user: User
  apps: App[] | null
  appsLoading: boolean
  appsError: string | null
  companyId: string
  companyName: string
  onAppsRetry: () => void
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Home({
  user,
  apps,
  appsLoading,
  appsError,
  companyId,
  companyName,
  onAppsRetry,
}: HomeProps) {
  // Count visible apps for the active company
  const visibleCount =
    apps?.filter((a) => a.scope === 'group' || (a.scope as string[]).includes(companyId))
      .length ?? 0

  return (
    <div>
      {/* Breadcrumb: company name + role, separated by a slash */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-xs font-semibold text-accent tracking-wide">
          {companyName}
        </span>
        <span className="text-border text-xs select-none" aria-hidden="true">/</span>
        <span className="text-xs text-text-secondary">{user.role}</span>
      </div>

      {/* Greeting + date */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-6">
        <h1 className="text-3xl font-bold text-text leading-tight">
          {greeting()}, {user.firstName}
        </h1>
        <p className="text-sm text-text-secondary shrink-0">{formatDate()}</p>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Your Apps
        </h2>
        {!appsLoading && !appsError && (
          <span className="text-xs text-text-secondary">
            {visibleCount} application{visibleCount !== 1 ? 's' : ''} active
          </span>
        )}
      </div>

      <AppGrid
        apps={apps}
        loading={appsLoading}
        error={appsError}
        companyId={companyId}
        onRetry={onAppsRetry}
      />
    </div>
  )
}
