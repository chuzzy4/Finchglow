/**
 * App.tsx
 *
 * Root component. Provides:
 * - Skip-to-content link (WCAG)
 * - Company state (drives data-company on <html> and tab selection)
 * - Layout shell: header, company tabs, main, aside (alerts), footer
 *
 * Features are composed here as milestones are completed.
 */

import { useState, useEffect, useCallback } from 'react'
import { companies } from './config/companies'
import type { CompanyConfig } from './config/companies'

// Milestone 1: minimal shell — replaced in subsequent milestones
export default function App() {
  const [activeCompany, setActiveCompany] = useState<CompanyConfig>(companies[0])

  // Set data-company on <html> whenever the active company changes.
  // All CSS token swaps flow from this single attribute.
  useEffect(() => {
    document.documentElement.dataset.company = activeCompany.id
  }, [activeCompany])

  const switchCompany = useCallback((company: CompanyConfig) => {
    setActiveCompany(company)
  }, [])

  return (
    <>
      {/* Skip link — first focusable element on the page */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-dvh flex flex-col bg-bg font-sans text-text">
        {/* Header placeholder */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
            <span className="font-bold text-lg text-text">Finchglow Holdings</span>
            <span className="text-text-secondary text-sm">Group Staff Portal</span>
          </div>
          <div className="header-gradient-line" aria-hidden="true" />
        </header>

        {/* Company tab bar placeholder */}
        <nav aria-label="Company switcher" role="tablist" className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-0 overflow-x-auto">
            {companies.map((co) => (
              <button
                key={co.id}
                role="tab"
                aria-selected={co.id === activeCompany.id}
                onClick={() => switchCompany(co)}
                className={[
                  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  co.id === activeCompany.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text',
                ].join(' ')}
              >
                {co.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          <p className="text-text-secondary">
            Milestone 1 scaffold complete — active company:{' '}
            <strong className="text-accent">{activeCompany.name}</strong>
          </p>
        </main>

        <footer className="bg-surface border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-text-secondary text-xs">
            © {new Date().getFullYear()} Finchglow Holdings Group. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  )
}
