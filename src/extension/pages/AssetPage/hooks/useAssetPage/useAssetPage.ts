import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

// enums
import { AssetTypeEnum } from '@extension/enums';

// selectors
import {
  useSelectAccounts,
  useSelectArc200AssetsBySelectedNetwork,
  useSelectSelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  IAccountInformation,
  IArc200Asset,
  IArc200AssetHolding,
  IStandardAsset,
  IStandardAssetHolding,
  INetwork,
} from '@extension/types';
import { IUseAssetPageOptions, IUseAssetPageState } from './types';

// utils
import { convertToStandardUnit } from '@common/utils';

export default function useAssetPage({
  address,
  assetId,
  onError,
}: IUseAssetPageOptions): IUseAssetPageState {
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  const arc200Assets: IArc200Asset[] = useSelectArc200AssetsBySelectedNetwork();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsBySelectedNetwork();
  // state
  const [account, setAccount] = useState<IAccount | null>(null);
  const [accountInformation, setAccountInformation] =
    useState<IAccountInformation | null>(null);
  const [asset, setAsset] = useState<IArc200Asset | IStandardAsset | null>(
    null
  );
  const [assetHolding, setAssetHolding] = useState<
    IArc200AssetHolding | IStandardAssetHolding | null
  >(null);
  const [amountInStandardUnits, setAmountInStandardUnits] = useState<BigNumber>(
    new BigNumber('0')
  );

  // 1a. when we have the address and accounts, get the account
  useEffect(() => {
    let selectedAccount: IAccount | null;

    if (address && accounts.length > 0) {
      selectedAccount =
        accounts.find(
          (value) =>
            AccountService.convertPublicKeyToAlgorandAddress(
              value.publicKey
            ) === address
        ) || null;

      // if there is no account, we have an error
      if (!selectedAccount) {
        return onError();
      }

      setAccount(selectedAccount);
    }
  }, [address, accounts]);
  // 1b. when we have the asset id and the assets, get the asset
  useEffect(() => {
    let selectedAsset: IArc200Asset | IStandardAsset | null;

    if (assetId) {
      // first, find amongst the arc200 assets
      selectedAsset =
        arc200Assets.find((value) => value.id === assetId) || null;

      // if there is not an arc200 asset, it maybe a standard asset
      if (!selectedAsset) {
        selectedAsset =
          standardAssets.find((value) => value.id === assetId) || null;
      }

      // if there is no asset, we have an error
      if (!selectedAsset) {
        return onError();
      }

      setAsset(selectedAsset);
    }
  }, [arc200Assets, assetId, standardAssets]);
  // 2. when the account has been found and we have the selected network, get the account information
  useEffect(() => {
    if (account && selectedNetwork) {
      setAccountInformation(
        AccountService.extractAccountInformationForNetwork(
          account,
          selectedNetwork
        ) || null
      );
    }
  }, [account, selectedNetwork]);
  // 3. when we have the account information, get the asset holding
  useEffect(() => {
    let selectedAssetHolding:
      | IArc200AssetHolding
      | IStandardAssetHolding
      | null;

    if (asset && accountInformation) {
      switch (asset.type) {
        case AssetTypeEnum.Arc200:
          selectedAssetHolding =
            accountInformation.arc200AssetHoldings.find(
              (value) => value.id === assetId
            ) || null;
          break;
        case AssetTypeEnum.Standard:
          selectedAssetHolding =
            accountInformation.standardAssetHoldings.find(
              (value) => value.id === assetId
            ) || null;
          break;
        default:
          selectedAssetHolding = null;
          break;
      }

      // if the account does not have the asset holding, we have an error
      if (!selectedAssetHolding) {
        return onError();
      }

      setAssetHolding(selectedAssetHolding);
    }
  }, [asset, accountInformation]);
  // 4. when we have the asset and asset holding, update the standard amount
  useEffect(() => {
    if (asset && assetHolding) {
      setAmountInStandardUnits(
        convertToStandardUnit(
          new BigNumber(assetHolding.amount),
          asset.decimals
        )
      );
    }
  }, [asset, assetHolding]);

  return {
    account,
    accountInformation,
    amountInStandardUnits,
    asset,
    assetHolding,
  };
}
