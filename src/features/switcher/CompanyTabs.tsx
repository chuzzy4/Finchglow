/**
 * src/features/switcher/CompanyTabs.tsx
 *
 * The always-visible company tab bar.
 *
 * Accessibility:
 * - role="tablist" on the nav
 * - role="tab", aria-selected on each button
 * - Roving tabindex: only the active tab is in the tab order (tabIndex=0),
 *   others are tabIndex=-1. Arrow keys move between tabs.
 * - Home / End keys jump to first / last tab.
 *
 * Mobile: horizontally scrollable strip with scroll-snap-x.
 * Generated entirely from the companies config — no company-specific JSX.
 */

import { useRef, useCallback } from 'react'
import { companies } from '../../config/companies'
import type { CompanyConfig } from '../../config/companies'

interface CompanyTabsProps {
  activeCompany: CompanyConfig
  onSwitch: (company: CompanyConfig) => void
}

export function CompanyTabs({ activeCompany, onSwitch }: CompanyTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null

      if (e.key === 'ArrowRight') nextIndex = (index + 1) % companies.length
      else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + companies.length) % companies.length
      else if (e.key === 'Home') nextIndex = 0
      else if (e.key === 'End') nextIndex = companies.length - 1

      if (nextIndex !== null) {
        e.preventDefault()
        const next = companies[nextIndex]!
        onSwitch(next)
        tabRefs.current[nextIndex]?.focus()
      }
    },
    [onSwitch],
  )

  return (
    <nav aria-label="Company switcher" className="bg-surface border-b border-border">
      {/* scroll-snap on mobile so tabs snap into view */}
      <div
        role="tablist"
        aria-label="Select company"
        className={[
          'flex overflow-x-auto gap-0',
          'scroll-snap-x mandatory',                  // mobile snap
          'max-w-7xl mx-auto px-4 sm:px-6',
          'scrollbar-none',                            // hide scrollbar visually
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        ].join(' ')}
      >
        {companies.map((co, i) => {
          const isActive = co.id === activeCompany.id
          return (
            <button
              key={co.id}
              id={`tab-${co.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls="main-content"
              tabIndex={isActive ? 0 : -1}
              ref={(el) => { tabRefs.current[i] = el }}
              onClick={() => onSwitch(co)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={[
                'flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium',
                'whitespace-nowrap border-b-2 transition-colors shrink-0',
                'scroll-snap-align-start min-h-11',
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text hover:border-border',
              ].join(' ')}
            >
              {/* Company abbreviation circle */}
              <span
                aria-hidden="true"
                className={[
                  'size-5 rounded-full flex items-center justify-center',
                  'text-[10px] font-bold leading-none',
                  isActive
                    ? 'bg-accent text-on-accent'
                    : 'bg-bg text-text-secondary',
                ].join(' ')}
              >
                {co.abbr}
              </span>
              {co.name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
