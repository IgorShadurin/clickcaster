/**
 * Returns the current date in the format YYYY-MM-DD.
 */
export function getDate(): string {
  return new Date().toISOString().split('T')[0]
}
