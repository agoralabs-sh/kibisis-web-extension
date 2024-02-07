/**
 * Simple function to convert milliseconds to minutes.
 * @param {number} valueInMilliseconds - the value, in milliseconds, to convert to minutes.
 * @returns {number} the value converted to minutes.
 */
export default function convertMillisecondsToMinutes(
  valueInMilliseconds: number
): number {
  return valueInMilliseconds / 60000;
}
