import { TransactionType } from 'algosdk';
import BigNumber from 'bignumber.js';

// constants
import { MINIMUM_BALANCE_REQUIREMENT } from '@extension/constants';

// services
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';

// types
import type { IAccountInformation } from '@extension/types';
import type { IOptions, IState } from './types';

export default function useMinimumBalanceRequirementsForTransactions({
  account,
  network,
  transactions,
}: IOptions): IState {
  const accountInformation: IAccountInformation | null =
    AccountRepositoryService.extractAccountInformationForNetwork(
      account,
      network
    );
  const payTransactionsCost: BigNumber = transactions.reduce<BigNumber>(
    (acc, currentValue) => {
      // get the amount of native currency for any "pay" transactions
      if (currentValue.type === TransactionType.pay) {
        return acc.plus(new BigNumber(String(currentValue.amount)));
      }

      return acc;
    },
    new BigNumber('0')
  );
  const transactionFees = new BigNumber(network.minFee).multipliedBy(
    transactions.length
  );
  let accountBalanceInAtomicUnits = new BigNumber('0');
  let minimumBalanceRequirementInAtomicUnits: BigNumber = new BigNumber(
    MINIMUM_BALANCE_REQUIREMENT
  );

  if (accountInformation) {
    accountBalanceInAtomicUnits = new BigNumber(
      accountInformation.atomicBalance
    );
    minimumBalanceRequirementInAtomicUnits = new BigNumber(
      accountInformation.minAtomicBalance
    );
  }

  return {
    accountBalanceInAtomicUnits,
    minimumBalanceRequirementInAtomicUnits,
    totalCostInAtomicUnits: payTransactionsCost.plus(transactionFees), // transaction fee per transaction + the amount in any "pay" transactions
  };
}
