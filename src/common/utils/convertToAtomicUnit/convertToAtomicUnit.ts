import BigNumber from 'bignumber.js';

/**
 * Convenience function to convert a standard unit to an atomic unit.
 * @param {BigNumber} standardUnit - the standard unit as a BigNumber
 * @param {number} decimals - the decimals of the atomic unit.
 * @returns {BigNumber} the supplied standard unit as an atomic unit.
 */
export default function convertToAtomicUnit(
  standardUnit: BigNumber,
  decimals: number
): BigNumber {
  const input: BigNumber = new BigNumber(standardUnit);
  const power: BigNumber = new BigNumber(10).pow(decimals);

  return input.multipliedBy(power);
}
