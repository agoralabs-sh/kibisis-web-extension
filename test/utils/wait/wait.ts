/**
 * Simple function that delays operation for certain time.
 * @param {number} delayInMilliseconds - the amount of time to wait in milliseconds.
 */
export default async function wait(delayInMilliseconds: number): Promise<void> {
  return await new Promise((resolve) =>
    setTimeout(resolve, delayInMilliseconds)
  );
}
