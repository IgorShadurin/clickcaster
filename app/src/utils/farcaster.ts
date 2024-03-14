/**
 * Extracts the FID from a message.
 * @param message The message to extract the FID from.
 */
export function extractFidFromMessage(message: string): number {
  if (!message && !message.includes('/')) {
    throw new Error('Invalid message for FID extraction.')
  }

  const items = message.split('/')

  return Number(items[items.length - 1])
}
