import BigNumber from 'bignumber.js';

/**
 * Convenience function to calculate the new minimum balance requirement (MBR), in microalgos, for an app's account for
 * a given box. This is calculated using the formula: 2500 + 400 * (key size + value size).
 * @param {number} keyByteSize - the byte size of the box's key.
 * @param {number} valueByteSize - the byte size of the box's value.
 * @returns {number} the increased MBR for an app's account for a given box.
 * @see {@link https://developer.algorand.org/articles/smart-contract-storage-boxes/}
 */
export default function calculateAppMbrForBox(
  keyByteSize: BigNumber,
  valueByteSize: BigNumber
): BigNumber {
  const size: BigNumber = keyByteSize.plus(valueByteSize);

  return new BigNumber(2500).plus(new BigNumber(400).multipliedBy(size));
}
