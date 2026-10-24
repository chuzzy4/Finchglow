/**
 * src/lib/timeago.ts
 *
 * Converts a minutesAgo number to a short human-readable string.
 * No external library — keeps bundle small.
 *
 * Examples:
 *   14   → "14m ago"
 *   90   → "1h 30m ago"
 *   1440 → "1d ago"
 */

export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`
  }
  const hours = Math.floor(minutesAgo / 60)
  const mins = minutesAgo % 60
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m ago` : `${hours}h ago`
  }
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/**
 * Returns the absolute timestamp string for a given minutesAgo value,
 * formatted as e.g. "Sat 24 Oct 2026, 03:36".
 */
export function absoluteTime(minutesAgo: number): string {
  const date = new Date(Date.now() - minutesAgo * 60 * 1000)
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
