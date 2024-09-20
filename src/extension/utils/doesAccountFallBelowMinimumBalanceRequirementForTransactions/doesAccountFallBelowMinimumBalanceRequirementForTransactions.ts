import { TransactionType } from 'algosdk';
import BigNumber from 'bignumber.js';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccountInformation } from '@extension/types';
import type { IOptions } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

/**
 * Convenience function to determine if an account balance will fall below the minimum balance requirement (MBR) with the
 * supplied transactions.
 * @param {IOptions} options - options including the account, the network and the transactions to determine if the
 * account falls below the MBR for a list of the transactions.
 * @returns {boolean} true if the account falls below the MBR for a list of transactions, or if the account information
 * cannot be found, false otherwise.
 */
export default function doesAccountFallBelowMinimumBalanceRequirementForTransactions({
  account,
  logger,
  network,
  transactions,
}: IOptions): boolean {
  const _functionName: string =
    'doesAccountFallBelowMinimumBalanceRequirementForTransactions';
  const accountInformation: IAccountInformation | null =
    AccountRepository.extractAccountInformationForNetwork(account, network);
  let minimumBalanceRequirementForAccount: BigNumber;
  let payTransactionsCost: BigNumber;
  let remainderBalanceAfterCost: BigNumber;
  let transactionFees: BigNumber;

  if (!accountInformation) {
    logger?.debug(
      `${_functionName}: unable to get account information for account "${convertPublicKeyToAVMAddress(
        AccountRepository.decode(account.publicKey)
      )}" on network "${network.genesisId}"`
    );

    return true;
  }

  minimumBalanceRequirementForAccount = new BigNumber(
    accountInformation.minAtomicBalance
  );

  // number of transactions * the minimum transaction fee
  transactionFees = new BigNumber(network.minFee).multipliedBy(
    transactions.length
  );

  // get the amount of native currency for any "pay" transactions
  payTransactionsCost = transactions.reduce<BigNumber>((acc, currentValue) => {
    if (currentValue.type === TransactionType.pay) {
      return acc.plus(new BigNumber(String(currentValue.amount)));
    }

    return acc;
  }, new BigNumber('0'));

  // determine the balance after the transactions costs
  remainderBalanceAfterCost = new BigNumber(
    accountInformation.atomicBalance
  ).minus(transactionFees.plus(payTransactionsCost));

  // if the balance falls below zero, use zero
  if (remainderBalanceAfterCost.lt(0)) {
    remainderBalanceAfterCost = new BigNumber('0');
  }

  // true if the balance after the transaction costs is less than the minimum balance requirement for the account
  return remainderBalanceAfterCost.lt(minimumBalanceRequirementForAccount);
}
