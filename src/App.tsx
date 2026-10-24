/**
 * App.tsx
 *
 * Root component. Owns all top-level state:
 * - Active company (drives data-company attribute + content filtering)
 * - API data for apps and alerts (fetched once, filtered in child components)
 * - Search state
 * - Offline state
 *
 * Layout:
 *   <header> — logo, search bar, user avatar
 *   <CompanyTabs> — always-visible tab bar
 *   <AlertsBanner> — pinned critical alert (if any)
 *   <OfflineBanner> — shown when offline
 *   <main> — two-column: Home + AppGrid (left), AlertsFeed (right)
 *   <footer> — incident count, copyright
 *
 * When search query is active, the main area is replaced by SearchResults.
 */

import { useState, useEffect, useCallback } from 'react'
import logoImg from './Logo.webp'
import { companies } from './config/companies'
import type { CompanyConfig } from './config/companies'
import usersData from './data/users.json'
import type { User } from './types'

import { useApi } from './hooks/useApi'
import { useSearch } from './hooks/useSearch'
import { useOffline } from './hooks/useOffline'
import { getApps } from './api/appsApi'
import { getAlerts } from './api/alertsApi'
import { filterByCompany } from './lib/filterItems'

import { CompanyTabs } from './features/switcher/CompanyTabs'
import { AlertsBanner } from './features/alerts/AlertsBanner'
import { AlertsFeed } from './features/alerts/AlertsFeed'
import { Home } from './features/home/Home'
import { SearchBar } from './features/search/SearchBar'
import { SearchResults } from './features/search/SearchResults'
import { OfflineBanner } from './features/offline/OfflineBanner'

// Mock: first user is the logged-in user. In production, this comes from the
// OIDC id_token (name, company_id, role claims).
const CURRENT_USER = usersData[0] as User

export default function App() {
  // Active company — starts from the current user's company
  const [activeCompany, setActiveCompany] = useState<CompanyConfig>(
    () => companies.find((c) => c.id === CURRENT_USER.companyId) ?? companies[0]!,
  )

  // Set data-company on <html> → triggers CSS variable swap
  useEffect(() => {
    document.documentElement.dataset.company = activeCompany.id
  }, [activeCompany.id])

  // Refetch on reconnect
  const { isOffline, lastUpdated } = useOffline()
  const [refetchKey, setRefetchKey] = useState(0)
  useEffect(() => {
    if (!isOffline) setRefetchKey((k) => k + 1)
  }, [isOffline])

  // API calls — fetchers are stable references
  const appsFetcher = useCallback(() => getApps(), [refetchKey]) // eslint-disable-line react-hooks/exhaustive-deps
  const alertsFetcher = useCallback(() => getAlerts(), [refetchKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    data: apps,
    loading: appsLoading,
    error: appsError,
    retry: appsRetry,
  } = useApi(appsFetcher)

  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
    retry: alertsRetry,
  } = useApi(alertsFetcher)

  // Search
  const { query, debouncedQuery, scope, isSearching, setQuery, setScope, clearSearch } =
    useSearch()

  const switchCompany = useCallback((company: CompanyConfig) => {
    setActiveCompany(company)
  }, [])

  // Count active criticals for the footer
  const activeCriticals = filterByCompany(alerts ?? [], activeCompany.id).filter(
    (a) => a.severity === 'critical',
  )

  return (
    <>
      {/* Skip link — first focusable element on the page (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-dvh flex flex-col bg-bg font-sans text-text">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="bg-surface border-b border-border sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4">
            {/* Logo */}
            <a href="/" aria-label="Finchglow Holdings — Group Staff Portal home" onClick={(e) => e.preventDefault()}>
              <img
                src={logoImg}
                alt="Finchglow Holdings"
                className="h-8 w-auto object-contain"
              />
            </a>

            {/* Search bar — grows to fill available space */}
            <div className="flex-1 max-w-xl mx-auto">
              <SearchBar
                query={query}
                scope={scope}
                onQueryChange={setQuery}
                onScopeChange={setScope}
              />
            </div>

            {/* User avatar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-text leading-tight">{CURRENT_USER.name}</p>
                <p className="text-xs text-text-secondary leading-tight">{CURRENT_USER.role}</p>
              </div>
              <div
                aria-label={`User: ${CURRENT_USER.name}`}
                className="size-9 rounded-full bg-accent text-on-accent flex items-center justify-center text-xs font-bold shrink-0 select-none"
              >
                {CURRENT_USER.avatarInitials}
              </div>
            </div>
          </div>

          {/* 3 px gradient line — decorative, always the same regardless of company */}
          <div className="header-gradient-line" aria-hidden="true" />
        </header>

        {/* ── Company tab bar ─────────────────────────────────────────── */}
        <CompanyTabs activeCompany={activeCompany} onSwitch={switchCompany} />

        {/* ── Critical alert banner ────────────────────────────────────── */}
        <AlertsBanner alerts={alerts} companyId={activeCompany.id} />

        {/* ── Offline banner ───────────────────────────────────────────── */}
        <OfflineBanner isOffline={isOffline} lastUpdated={lastUpdated} />

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">

          {/* Search active → full-width results */}
          {debouncedQuery ? (
            <SearchResults
              query={debouncedQuery}
              scope={scope}
              apps={filterByCompany(apps ?? [], activeCompany.id)}
              alerts={filterByCompany(alerts ?? [], activeCompany.id)}
              loading={isSearching}
              error={appsError ?? alertsError}
              onClear={clearSearch}
              onRetry={() => { appsRetry(); alertsRetry() }}
            />
          ) : (
            /* Normal layout: Home (left) + AlertsFeed (right) */
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: greeting + app grid */}
              <div className="flex-1 min-w-0">
                <Home
                  user={CURRENT_USER}
                  apps={apps}
                  appsLoading={appsLoading}
                  appsError={appsError}
                  companyId={activeCompany.id}
                  companyName={activeCompany.name}
                  onAppsRetry={appsRetry}
                />
              </div>

              {/* Right: alerts & news feed */}
              <aside
                aria-label="Alerts and News"
                className="w-full lg:w-80 xl:w-96 shrink-0"
              >
                <AlertsFeed
                  alerts={alerts}
                  loading={alertsLoading}
                  error={alertsError}
                  companyId={activeCompany.id}
                  onRetry={alertsRetry}
                />
              </aside>
            </div>
          )}
        </main>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="bg-surface border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-text-secondary">
            {activeCriticals.length > 0 ? (
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-critical-bg animate-pulse" aria-hidden="true" />
                <strong className="font-semibold text-critical-bg">
                  {activeCriticals.length} incident{activeCriticals.length > 1 ? 's' : ''} active
                </strong>
                {' — '}
                {activeCriticals[0]!.title}
              </span>
            ) : (
              <span>All systems operational</span>
            )}
            <span>© {new Date().getFullYear()} Finchglow Holdings Group. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  )
}
