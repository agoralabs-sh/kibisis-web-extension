import BigNumber from 'bignumber.js';

// constants
import { MINIMUM_BALANCE_REQUIREMENT } from '@extension/constants';

// service
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';

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
  numOfStandardAssets = 0,
}: IOptions): BigNumber {
  const accountInformation: IAccountInformation | null =
    AccountRepositoryService.extractAccountInformationForNetwork(
      account,
      network
    );
  const roundedNumberOfAssets: number = Math.round(numOfStandardAssets);
  let accountMinimumBalance: BigNumber = new BigNumber(
    MINIMUM_BALANCE_REQUIREMENT
  );
  let minimumBalanceToRemoveInAtomicUnits: BigNumber;

  // if we can't get the account information, return the minimum amount without standard assets
  if (accountInformation) {
    accountMinimumBalance = new BigNumber(accountInformation.minAtomicBalance);
  }

  // if we are removing assets, find out how much we need to remove
  if (numOfStandardAssets < 0) {
    minimumBalanceToRemoveInAtomicUnits = new BigNumber(
      MINIMUM_BALANCE_REQUIREMENT
    ).multipliedBy(Math.abs(roundedNumberOfAssets));
    accountMinimumBalance = accountMinimumBalance.minus(
      minimumBalanceToRemoveInAtomicUnits
    );

    // if the account balance falls below the minimum balance requirement, just return the minimum balance requirement
    return accountMinimumBalance.lt(new BigNumber(MINIMUM_BALANCE_REQUIREMENT))
      ? new BigNumber(MINIMUM_BALANCE_REQUIREMENT)
      : accountMinimumBalance;
  }

  // minimum account balance + (minimum balance requirement * number of standard assets)
  return accountMinimumBalance.plus(
    new BigNumber(MINIMUM_BALANCE_REQUIREMENT).multipliedBy(
      roundedNumberOfAssets
    )
  );
}
