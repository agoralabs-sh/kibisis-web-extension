import BigNumber from 'bignumber.js';

// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import {
  IAccount,
  IAccountInformation,
  IStandardAssetHolding,
  INetworkWithTransactionParams,
  IArc200Asset,
  IStandardAsset,
  IArc200AssetHolding,
} from '@extension/types';

// utils
import convertGenesisHashToHex from './convertGenesisHashToHex';

interface IOptions {
  account: IAccount;
  asset: IArc200Asset | IStandardAsset;
  network: INetworkWithTransactionParams;
}

/**
 * Convenience function that calculates the maximum transaction amount.
 * - For ARC-200 and standard assets, when the asset ID is NOT "0", then the transaction amount for that asset is
 * calculated. Zero is returned if the
 * account does not hold any asset holding for the supplied asset.
 * - If the asset is a standard asset with an ID of "0", this will be the native currency and is
 * (the balance - min balance to keep account open - the minimum transaction fee). If the balance is calculated falls
 * below zero, zero is returned.
 * @param {IOptions} options - the account, assetId and network.
 * @returns {BigNumber} the maximum transaction amount for the given asset or the native currency.
 */
export default function calculateMaxTransactionAmount({
  account,
  asset,
  network,
}: IOptions): BigNumber {
  const accountInformation: IAccountInformation | null =
    account.networkInformation[
      convertGenesisHashToHex(network.genesisHash).toUpperCase()
    ] || null;
  let amount: BigNumber;
  let assetHolding: IArc200AssetHolding | IStandardAssetHolding | null;
  let balance: BigNumber;
  let minBalance: BigNumber;
  let minFee: BigNumber;

  if (!accountInformation) {
    return new BigNumber('0');
  }

  switch (asset.type) {
    case AssetTypeEnum.Arc200:
      assetHolding =
        accountInformation.arc200AssetHoldings.find(
          (value) => value.id === asset.id
        ) || null;

      return new BigNumber(assetHolding?.amount || 0);
    case AssetTypeEnum.Standard:
      // if the asset id is not 0 it is an asa, use the balance of the asset
      if (asset.id !== '0') {
        assetHolding =
          accountInformation.standardAssetHoldings.find(
            (value) => value.id === asset.id
          ) || null;

        return new BigNumber(assetHolding?.amount || 0);
      }

      balance = new BigNumber(accountInformation.atomicBalance);
      minBalance = new BigNumber(accountInformation.minAtomicBalance);
      minFee = new BigNumber(network.minFee);
      amount = balance.minus(minBalance).minus(minFee); // balance - min balance to keep account open - the minimum transaction fee = amount

      // if the amount falls below zero, just return zero
      return amount.lt(new BigNumber(0)) ? new BigNumber(0) : amount;
    default:
      return new BigNumber('0');
  }
}
