/**
 * Convenience function that simply waits an amount of time determined by the milliseconds argument.
 * @param {number} milliseconds - the amount of milliseconds to wait.
 */
export default async function waitInMilliseconds(
  milliseconds: number
): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
