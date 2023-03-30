import BigNumber from 'bignumber.js';

/**
 * Convenience function to convert an atomic unit to a standard unit.
 * @param {BigNumber} atomicUnit - the atomic unit as a BigNumber.
 * @param {number} decimals - the decimals of the atomic unit.
 * @returns {BigNumber} the supplied atomic unit as a standard unit.
 */
export default function convertToStandardUnit(
  atomicUnit: BigNumber,
  decimals: number
): BigNumber {
  const input: BigNumber = new BigNumber(atomicUnit);
  const power: BigNumber = new BigNumber(10).pow(decimals);

  return input.dividedBy(power);
}
