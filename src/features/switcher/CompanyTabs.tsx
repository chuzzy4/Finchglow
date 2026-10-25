/**
 * src/features/switcher/CompanyTabs.tsx
 *
 * Company switcher — trigger button → dropdown list of companies.
 *
 * Positioning: the dropdown is `position:fixed`, anchored via useLayoutEffect
 * that reads the trigger button's bounding rect. This is the only reliable
 * way to avoid viewport overflow regardless of where the trigger sits in the
 * layout. On mobile the dropdown stretches edge-to-edge with a small margin.
 *
 * Accessibility:
 * - Trigger: aria-haspopup="listbox", aria-expanded
 * - Dropdown: role="listbox", each option role="option" aria-selected
 * - Escape closes; click-outside closes; focus returns to trigger
 */

import { useRef, useEffect, useLayoutEffect, useCallback, useState } from 'react'
import { companies } from '../../config/companies'
import type { CompanyConfig } from '../../config/companies'
import { Building04Icon } from '../../lib/icon'

interface CompanySwitcherProps {
  activeCompany: CompanyConfig
  onSwitch: (company: CompanyConfig) => void
}

export function CompanyTabs({ activeCompany, onSwitch }: CompanySwitcherProps) {
  const [open, setOpen] = useState(false)
  // Dropdown position in px — calculated from the trigger's bounding rect
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Every time the dropdown opens, measure the trigger and set position
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const dropW = Math.min(220, vw - 16) // 220px max, 8px margin each side
    // Default: left-align with the trigger
    let left = rect.left
    // If it would overflow the right edge, right-align instead
    if (left + dropW > vw - 8) left = vw - dropW - 8
    // Never go off the left edge
    if (left < 8) left = 8
    setDropPos({ top: rect.bottom + 6, left, width: dropW })
  }, [open])

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

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
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
    // shrink-0 keeps the trigger from collapsing inside the header flex row
    <div className="shrink-0">

      {/* ── Trigger button ────────────────────────────────────────────── */}
      <button
        ref={triggerRef}
        id="company-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Active company: ${activeCompany.name}. Click to switch.`}
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium',
          'border border-border bg-surface text-text',
          'hover:border-accent hover:text-accent transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
        ].join(' ')}
      >
        <Building04Icon size={14} aria-hidden="true" className="text-accent shrink-0" />
        {/* Company name — hidden on mobile to keep the header compact */}
        <span className="hidden sm:inline max-w-[140px] truncate">{activeCompany.name}</span>
        {/* Chevron — rotates when open */}
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

      {/* ── Dropdown panel — fixed-positioned, never overflows viewport ── */}
      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Switch company"
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            width: dropPos.width,
          }}
          className={[
            'z-50',
            'bg-surface border border-border rounded-xl shadow-xl',
            'py-2 px-1 focus:outline-none',
            'animate-fade-in-down',
          ].join(' ')}
        >
          <ul className="flex flex-col">
            {companies.map((co) => {
              const isActive = co.id === activeCompany.id
              return (
                <li key={co.id} role="none">
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(co)}
                    className={[
                      'w-full flex items-center justify-between gap-2',
                      'px-3 py-2 rounded-lg text-left text-sm',
                      'transition-colors duration-150',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                      isActive
                        ? 'text-accent font-semibold'
                        : 'text-text font-normal hover:text-accent hover:bg-bg',
                    ].join(' ')}
                  >
                    <span className="truncate">{co.name}</span>
                    {/* Tick for the active company */}
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
