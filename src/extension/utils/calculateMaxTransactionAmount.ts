import BigNumber from 'bignumber.js';

// types
import {
  IAccount,
  IAccountInformation,
  IStandardAssetHolding,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import convertGenesisHashToHex from './convertGenesisHashToHex';

interface IOptions {
  account: IAccount;
  assetId: string;
  network: INetworkWithTransactionParams;
}

/**
 * Convenience function that calculates the maximum transaction amount.
 * - If the `assetId` is not zero, then the transaction amount for that asset is calculated. Zero is returned if the
 * account does not hold any asset holding for the supplied asset.
 * - If the `assetId` is '0', this will be the native currency and is the balance - min balance to keep account open -
 * the minimum transaction fee. If the balance is calculated to fall below zero, zero is returned.
 * @param {IOptions} options - the account, assetId and network.
 * @returns {BigNumber} the maximum transaction amount for the given asset or the native currency.
 */
export default function calculateMaxTransactionAmount({
  account,
  assetId,
  network,
}: IOptions): BigNumber {
  const accountInformation: IAccountInformation | null =
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ] || null;
  let amount: BigNumber;
  let assetHolding: IStandardAssetHolding | null;
  let balance: BigNumber;
  let minBalance: BigNumber;
  let minFee: BigNumber;

  if (!accountInformation) {
    return new BigNumber('0');
  }

  // if the asset id is not 0 it is an asa, use the balance of the asset
  if (assetId != '0') {
    assetHolding =
      accountInformation.standardAssetHoldings.find(
        (value) => value.id === assetId
      ) || null;

    return new BigNumber(assetHolding?.amount || 0);
  }

  balance = new BigNumber(accountInformation.atomicBalance);
  minBalance = new BigNumber(accountInformation.minAtomicBalance);
  minFee = new BigNumber(network.minFee);
  amount = balance.minus(minBalance).minus(minFee); // balance - min balance to keep account open - the minimum transaction fee = amount

  // if the amount falls below zero, just return zero
  return amount.lt(new BigNumber(0)) ? new BigNumber(0) : amount;
}
