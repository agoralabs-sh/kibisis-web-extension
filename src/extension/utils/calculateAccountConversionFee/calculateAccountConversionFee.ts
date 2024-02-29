import BigNumber from 'bignumber.js';

// constants
import { MINIMUM_BALANCE } from '@extension/constants';

// types
import type { IOptions } from './types';

/**
 * Convenience function that calculates the total cost of a account conversion, based on the amount of assets in the
 * provided account information. The calculation takes into account:
 * 1. The minimum balance required to open an account (0.1).
 * 2. The minimum balance required for each standard asset (0.1).
 * 3. The opt-in transaction fees for each standard asset.
 * 4. The box storage fees for each ARC-0200 asset for the new account (~0.256).
 * 5. The fees to update each ARC-0200 contract with the new account.
 * @param {IOptions} options -
 * @returns {BigNumber} the total cost in fees to convert an account to a new account including all standard & ARC-0200
 * assets.
 */
export default function calculateAccountConversionFee({
  boxStorageFee,
  numOfARC0200Assets,
  numOfStandardAssets,
  transactionParams,
}: IOptions): BigNumber {
  const minimumBalance: BigNumber = new BigNumber(MINIMUM_BALANCE);
  const transactionFee: BigNumber = new BigNumber(transactionParams.fee);
  const costOfStandardAsset: BigNumber = minimumBalance.plus(
    transactionFee.multipliedBy(2)
  ); // standard asset: minimum balance + (2 * transaction fee)
  const costOfARC0200Asset: BigNumber = boxStorageFee.plus(
    transactionFee.multipliedBy(2)
  ); // arc-0200 asset: box storage fee + (2 * transaction fee)
  const totalFee: BigNumber = minimumBalance.plus(transactionFee); // initial setup: minimum balance + transaction fee to send minimum balance

  // cost of standard assets: number of standard assets * (minimum balance * (2 * transaction fee))
  totalFee.plus(costOfStandardAsset.multipliedBy(numOfStandardAssets));

  // cost of standard assets: number of arc-0200 assets * (box storage fee * (2 * transaction fee))
  totalFee.plus(costOfARC0200Asset.multipliedBy(numOfARC0200Assets));

  return totalFee;
}
