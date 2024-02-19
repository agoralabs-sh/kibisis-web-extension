/**
 * Convenience function that just checks if an address is a zero address, i.e. the address is:
 * "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
 * @param {string} address - the address to check.
 * @returns {boolean} true if the address is a zero address, false otherwise.
 */
export default function isZeroAddress(address: string): boolean {
  return (
    address === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'
  );
}
