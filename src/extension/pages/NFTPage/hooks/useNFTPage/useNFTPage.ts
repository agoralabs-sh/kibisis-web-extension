import { useEffect, useState } from 'react';

// selectors
import {
  useSelectActiveAccount,
  useSelectActiveAccountInformation,
} from '@extension/selectors';

// types
import type {
  IAccount,
  IAccountInformation,
  IARC0072AssetHolding,
} from '@extension/types';
import type { IUseNFTPageOptions, IUseNFTPageState } from './types';

export default function useNFTPage({
  appId,
  onError,
  tokenId,
}: IUseNFTPageOptions): IUseNFTPageState {
  // selectors
  const account: IAccount | null = useSelectActiveAccount();
  const accountInformation: IAccountInformation | null =
    useSelectActiveAccountInformation();
  // state
  const [assetHolding, setAssetHolding] = useState<IARC0072AssetHolding | null>(
    null
  );

  // when we have the asset information and the account information, get the asset holding
  useEffect(() => {
    let selectedAssetHolding: IARC0072AssetHolding | null;

    if (accountInformation && appId && tokenId) {
      selectedAssetHolding =
        accountInformation.arc0072AssetHoldings.find(
          (value) => value.id === appId && value.tokenId === tokenId
        ) || null;

      // if the account does not have the asset holding, we have an error
      if (!selectedAssetHolding) {
        return onError();
      }

      setAssetHolding(selectedAssetHolding);
    }
  }, [appId, accountInformation, tokenId]);

  return {
    account,
    accountInformation,
    assetHolding,
  };
}
