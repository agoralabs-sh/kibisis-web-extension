import BigNumber from 'bignumber.js';
import numbro from 'numbro';

/**
 * @property {number} decimals - [optional] decimals that will be displayed after the whole number. Defaults to 2.
 * @property {boolean} thousandSeparatedOnly - [optional] whether to use a thousand separated only for big numbers.
 * Defaults to false.
 */
interface IOptions {
  decimals?: number;
  thousandSeparatedOnly?: boolean;
}

/**
 * Formats a given unit to display on the frontend.
 * @param {BigNumber} input - the unit as a BigNumber.
 * @param {IOptions} options - [optional] various options that affect the returned format.
 * @returns {string} the formatted unit.
 */
export default function formatCurrencyUnit(
  input: BigNumber,
  options?: IOptions
): string {
  const decimals: number = options?.decimals || 2;
  const thousandSeparatedOnly: boolean =
    options?.thousandSeparatedOnly || false;

  if (input.gte(1)) {
    // numbers >= 1m+
    if (
      input.decimalPlaces(decimals).gte(new BigNumber(1000000)) &&
      !thousandSeparatedOnly
    ) {
      return numbro(input.toString()).format({
        average: true,
        totalLength: 6,
        trimMantissa: true,
      });
    }

    // numbers <= 999,999.99
    return numbro(input.toString()).format({
      mantissa: decimals,
      thousandSeparated: true,
      trimMantissa: true,
    });
  }

  // numbers < 1
  return numbro(input.toString()).format({
    mantissa: decimals,
    trimMantissa: true,
  });
}
