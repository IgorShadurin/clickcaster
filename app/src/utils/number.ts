export function formatNumber(number: number): string {
  return number.toLocaleString('en-US');
}

/**
 * Formats a number to a string with 'k' for thousands and 'm' for millions.
 * @param {number} num - The number to format.
 * @returns {string} The formatted number.
 */
export function formatClicks(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}
