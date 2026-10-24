/**
 * src/lib/filterItems.ts
 *
 * Pure function that filters any list of scoped items by company.
 * This is the ONLY place in the codebase where company-scope filtering lives.
 *
 * Rules:
 *  - scope === 'group'  → always visible on every tab
 *  - scope === string[] → visible only when companyId is in the array
 */

import type { Scope } from '../types'

interface Scoped {
  scope: Scope
}

export function filterByCompany<T extends Scoped>(items: T[], companyId: string): T[] {
  return items.filter((item) => {
    if (item.scope === 'group') return true
    return (item.scope as string[]).includes(companyId)
  })
}
