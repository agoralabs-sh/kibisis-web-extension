import { useEffect, useState } from 'react';

// hooks
import useAssets from '@extension/hooks/useAssets';

// selectors
import {
  useSelectAccounts,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import { AccountService } from '@extension/services';

// types
import {
  IAccount,
  IAccountInformation,
  IAsset,
  IAssetHolding,
  INetwork,
} from '@extension/types';
import { IUseAssetPageOptions, IUseAssetPageState } from './types';
import BigNumber from 'bignumber.js';
import { convertToStandardUnit } from '@common/utils';

export default function useAssetPage({
  address,
  assetId,
  onError,
}: IUseAssetPageOptions): IUseAssetPageState {
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const selectedNetwork: INetwork | null = useSelectSelectedNetwork();
  // hooks
  const assets: IAsset[] = useAssets();
  // state
  const [account, setAccount] = useState<IAccount | null>(null);
  const [accountInformation, setAccountInformation] =
    useState<IAccountInformation | null>(null);
  const [asset, setAsset] = useState<IAsset | null>(null);
  const [assetHolding, setAssetHolding] = useState<IAssetHolding | null>(null);
  const [standardUnitAmount, setStandardUnitAmount] = useState<BigNumber>(
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
    let selectedAsset: IAsset | null;

    if (assetId && assets.length > 0) {
      selectedAsset = assets.find((value) => value.id === assetId) || null;

      // if there is no asset, we have an error
      if (!selectedAsset) {
        return onError();
      }

      setAsset(selectedAsset);
    }
  }, [assetId, assets]);
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
    let selectedAssetHolding: IAssetHolding | null;

    if (accountInformation) {
      selectedAssetHolding =
        accountInformation.assetHoldings.find(
          (value) => value.id === assetId
        ) || null;

      // if teh account does not have the asset holding, we have an error
      if (!selectedAssetHolding) {
        return onError();
      }

      setAssetHolding(selectedAssetHolding);
    }
  }, [accountInformation]);
  // 4. when we have the asset and asset holding, update the standard amount
  useEffect(() => {
    if (asset && assetHolding) {
      setStandardUnitAmount(
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
    asset,
    assetHolding,
    standardUnitAmount,
  };
}
