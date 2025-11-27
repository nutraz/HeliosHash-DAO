// Simple logger wrapper used across the app.
// In production this becomes a no-op to avoid noisy console output and satisfy lint rules.
const isProd = process.env.NODE_ENV === 'production'

export const log = (...args: unknown[]) => {
  if (isProd) return
  // eslint-disable-next-line no-console
  console.log(...args)
}

export const warn = (...args: unknown[]) => {
  if (isProd) return
  // eslint-disable-next-line no-console
  console.warn(...args)
}

export const error = (...args: unknown[]) => {
  if (isProd) return
  // eslint-disable-next-line no-console
  console.error(...args)
}

export const debug = (...args: unknown[]) => {
  if (isProd) return
  // eslint-disable-next-line no-console
  console.debug(...args)
}

export default { log, warn, error, debug }
