/**
 * src/features/switcher/CompanyTabs.tsx
 *
 * Company switcher — a trigger button in the header that opens an inline
 * dropdown panel beneath it. Clicking a card switches the active company
 * and closes the dropdown.
 *
 * Accessibility:
 * - Trigger has aria-haspopup="listbox" and aria-expanded
 * - Dropdown is role="listbox" with aria-label
 * - Escape key closes it
 * - Click outside (via a transparent overlay) closes it
 * - Returns focus to the trigger on close
 *
 * Design: a clean dropdown with rectangular company cards, no dots or circles.
 * The wrapper div is position:relative so the dropdown anchors naturally.
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { companies } from '../../config/companies'
import type { CompanyConfig } from '../../config/companies'
import { Building04Icon } from '../../lib/icon'

interface CompanySwitcherProps {
  activeCompany: CompanyConfig
  onSwitch: (company: CompanyConfig) => void
}

export function CompanyTabs({ activeCompany, onSwitch }: CompanySwitcherProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // Close when clicking outside the wrapper
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        triggerRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    // Use capture so it fires before the event reaches other handlers
    document.addEventListener('mousedown', handleClick, true)
    return () => document.removeEventListener('mousedown', handleClick, true)
  }, [open])

  const handleSelect = useCallback(
    (co: CompanyConfig) => {
      onSwitch(co)
      setOpen(false)
      triggerRef.current?.focus()
    },
    [onSwitch],
  )

  return (
    // position:relative anchors the dropdown to this wrapper
    <div className="relative shrink-0">

      {/* ── Trigger button ────────────────────────────────────────────── */}
      <button
        ref={triggerRef}
        id="company-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Active company: ${activeCompany.name}. Click to switch.`}
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
          'border border-border bg-surface text-text',
          'hover:border-accent hover:text-accent transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
        ].join(' ')}
      >
        <Building04Icon size={14} aria-hidden="true" className="text-accent" />
        <span className="max-w-[100px] sm:max-w-[140px] truncate">{activeCompany.name}</span>
        {/* Chevron rotates when open */}
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`shrink-0 text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Dropdown panel ────────────────────────────────────────────── */}
      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Switch company"
          className={[
            'absolute left-0 top-[calc(100%+6px)] z-50',
            'w-[min(360px,calc(100vw-2rem))]',
            'bg-surface border border-border rounded-xl shadow-xl',
            'p-4 focus:outline-none',
            'animate-fade-in-down',
          ].join(' ')}
        >
          {/* Label */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2">
            Switch Company
          </p>

          {/* Plain vertical list — just company names, no boxes or abbr tags */}
          <ul role="listbox" className="flex flex-col">
            {companies.map((co) => {
              const isActive = co.id === activeCompany.id
              return (
                <li key={co.id} role="none">
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(co)}
                    className={[
                      'w-full flex items-center justify-between gap-3',
                      'px-2 py-2 rounded-lg text-left text-sm',
                      'transition-colors duration-150',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                      isActive
                        ? 'text-accent font-semibold'
                        : 'text-text font-normal hover:text-accent hover:bg-bg',
                    ].join(' ')}
                  >
                    {co.name}
                    {/* Tick mark for the active company */}
                    {isActive && (
                      <svg
                        aria-hidden="true"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="shrink-0 text-accent"
                      >
                        <path
                          d="M2 6L4.5 8.5L10 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
