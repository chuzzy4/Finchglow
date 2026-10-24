/**
 * src/api/client.ts
 *
 * A tiny fake-fetch wrapper used by all API modules.
 * Reads configuration from environment variables so behaviour can be tuned
 * in .env without touching code.
 *
 * VITE_API_LATENCY_MS  — base latency in milliseconds (default 500)
 * VITE_API_FAILURE_RATE — fraction of requests that fail, 0–1 (default 0.1)
 */

/** How long to wait before resolving, with ±200 ms jitter */
function latencyMs(): number {
  const base = Number(import.meta.env.VITE_API_LATENCY_MS ?? 500)
  const jitter = Math.random() * 400 - 200
  return Math.max(0, base + jitter)
}

/** Fraction of calls that throw a simulated error */
function failureRate(): number {
  return Number(import.meta.env.VITE_API_FAILURE_RATE ?? 0.1)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Simulates a network fetch: artificial latency + configurable random failure.
 * Pass the data you want returned on success.
 */
export async function fakeFetch<T>(data: T): Promise<T> {
  await sleep(latencyMs())
  if (Math.random() < failureRate()) {
    throw new Error('Simulated API failure — please try again.')
  }
  return data
}
