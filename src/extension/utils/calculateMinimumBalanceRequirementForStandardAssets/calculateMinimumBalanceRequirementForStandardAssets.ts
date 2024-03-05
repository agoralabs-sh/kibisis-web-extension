import BigNumber from 'bignumber.js';

// constants
import { MINIMUM_BALANCE_REQUIREMENT } from '@extension/constants';

// service
import AccountService from '@extension/services/AccountService';

// types
import type { IAccountInformation } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that calculates the minimum balance requirement for a number of standard assets.
 * @param {IOptions} options - contains the account, network and the number of standard assets.
 * @returns {BigNumber} the minimum balance requirement for the specified number of standard assets.
 */
export default function calculateMinimumBalanceRequirementForStandardAssets({
  account,
  network,
  numOfStandardAssets = 1,
}: IOptions): BigNumber {
  const accountInformation: IAccountInformation | null =
    AccountService.extractAccountInformationForNetwork(account, network);
  let accountMinimumBalance: BigNumber = new BigNumber(
    MINIMUM_BALANCE_REQUIREMENT
  );

  // if we can't get the account information, return the minimum amount without standard assets
  if (accountInformation) {
    accountMinimumBalance = new BigNumber(accountInformation.minAtomicBalance);
  }

  // minimum account balance + (minimum balance requirement * number of standard assets)
  return accountMinimumBalance.plus(
    new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(numOfStandardAssets)
  );
}
