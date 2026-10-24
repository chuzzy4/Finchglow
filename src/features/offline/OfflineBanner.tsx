/**
 * src/features/offline/OfflineBanner.tsx
 *
 * Shown when navigator.onLine is false.
 * Icon imported directly from @hugeicons/core-free-icons.
 */

import { WifiOff01Icon } from '../../lib/icon'

interface OfflineBannerProps {
  isOffline: boolean
  lastUpdated: string | null
}

export function OfflineBanner({ isOffline, lastUpdated }: OfflineBannerProps) {
  if (!isOffline) return null

  const time = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'recently'

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-warning-bg border-b border-warning-fg/20 px-4 py-2"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-warning-fg text-xs font-medium">
        <WifiOff01Icon size={14} aria-hidden="true" />
        <span>
          You&rsquo;re offline. Showing alerts last updated {time}.
        </span>
      </div>
    </div>
  )
}
