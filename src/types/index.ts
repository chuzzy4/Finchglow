/**
 * src/types/index.ts
 *
 * Shared TypeScript types. All components import from here.
 */

/** An item that can be scoped to specific companies or the whole group. */
export type Scope = 'group' | string[]

export interface App {
  id: string
  name: string
  description: string
  /** Hugeicons free icon name */
  iconName: string
  scope: Scope
  url: string
}

export interface Alert {
  id: string
  severity: 'info' | 'warning' | 'critical'
  type: 'alert' | 'news'
  title: string
  body: string
  scope: Scope
  /** Minutes in the past from "now" — converted to a Date at runtime */
  minutesAgo: number
  /** Optional incident reference, e.g. "#INC-8942" */
  incidentId?: string
}

export interface User {
  id: string
  name: string
  firstName: string
  role: string
  companyId: string
  avatarInitials: string
}

/** State shape returned by useApi hook */
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
