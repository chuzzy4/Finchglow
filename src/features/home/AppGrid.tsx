/**
 * src/features/home/AppGrid.tsx
 *
 * Responsive grid of AppCards filtered by the active company.
 *
 * Icon names confirmed against @hugeicons/core-free-icons dist/types/index.d.ts.
 * Each icon is a named import — Vite tree-shakes unused icons from the bundle.
 *
 * To add a new app:
 *  1. Add the entry to data/apps.json with an iconName matching a key in ICON_MAP
 *  2. Import that icon here and add it to ICON_MAP
 */

import type { ComponentType } from 'react'
import {
  AirplaneTakeOff01Icon, // booking-tool
  UserAccountIcon,        // corporate-crm
  Building04Icon,         // supplier-portal
  GraduateMaleIcon,       // learning-platform
  Building03Icon,         // facilities-requests (Office365 not in free pack)
  UserIdVerificationIcon, // hr-self-service
  AirplaneTakeOff02Icon,  // flight-simulator (FlightLand not in free pack)
  BookOpen01Icon,         // crm-academy
  Sun01Icon,              // holidays-booking (PalmTree not in free pack)
  ComputerActivityIcon,   // gds-terminal
  BarChartIcon,           // report-centre
  Settings02Icon,         // facilities-mgmt
} from '../../lib/icon'

import { AppCard } from './AppCard'
import type { HugeIconProps } from './AppCard'
import { SkeletonBlock } from '../../components/ui/SkeletonBlock'
import { ErrorState } from '../../components/ui/ErrorState'
import { filterByCompany } from '../../lib/filterItems'
import type { App } from '../../types'

/** Map: data/apps.json iconName → imported Hugeicons component */
const ICON_MAP: Record<string, ComponentType<HugeIconProps>> = {
  AirplaneTakeOff01Icon: AirplaneTakeOff01Icon as unknown as ComponentType<HugeIconProps>,
  UserAccountIcon:        UserAccountIcon       as unknown as ComponentType<HugeIconProps>,
  Building04Icon:         Building04Icon        as unknown as ComponentType<HugeIconProps>,
  GraduateMaleIcon:       GraduateMaleIcon      as unknown as ComponentType<HugeIconProps>,
  // aliases used in JSON
  GraduateMale02Icon:     GraduateMaleIcon      as unknown as ComponentType<HugeIconProps>,
  Office365Icon:          Building03Icon        as unknown as ComponentType<HugeIconProps>,
  UserIdVerificationIcon: UserIdVerificationIcon as unknown as ComponentType<HugeIconProps>,
  FlightLandIcon:         AirplaneTakeOff02Icon  as unknown as ComponentType<HugeIconProps>,
  BookOpen01Icon:         BookOpen01Icon         as unknown as ComponentType<HugeIconProps>,
  PalmTreeIcon:           Sun01Icon              as unknown as ComponentType<HugeIconProps>,
  ComputerIcon:           ComputerActivityIcon   as unknown as ComponentType<HugeIconProps>,
  ChartLineData02Icon:    BarChartIcon           as unknown as ComponentType<HugeIconProps>,
  BarChartIcon:           BarChartIcon           as unknown as ComponentType<HugeIconProps>,
  Settings02Icon:         Settings02Icon         as unknown as ComponentType<HugeIconProps>,
}

/** Shown when data/apps.json has an iconName not yet added to ICON_MAP */
const FallbackIcon = Building03Icon as unknown as ComponentType<HugeIconProps>

interface AppGridProps {
  apps: App[] | null
  loading: boolean
  error: string | null
  companyId: string
  onRetry: () => void
}

export function AppGrid({ apps, loading, error, companyId, onRetry }: AppGridProps) {
  if (loading) {
    return (
      <div aria-label="Loading apps…" aria-busy="true" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-28" />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  const filtered = filterByCompany(apps ?? [], companyId)

  if (filtered.length === 0) {
    return (
      <p className="py-6 text-sm text-text-secondary">
        No apps available for this company.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {filtered.map((app) => (
        <AppCard
          key={app.id}
          app={app}
          icon={ICON_MAP[app.iconName] ?? FallbackIcon}
        />
      ))}
    </div>
  )
}
