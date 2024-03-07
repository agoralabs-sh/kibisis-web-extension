import { useEffect, useState } from 'react';

// selectors
import {
  useSelectActiveAccount,
  useSelectActiveAccountInformation,
  useSelectARC0072AssetsBySelectedNetwork,
} from '@extension/selectors';

// types
import type {
  IAccount,
  IAccountInformation,
  IARC0072Asset,
  IARC0072AssetHolding,
} from '@extension/types';
import type { IUseNFTPageOptions, IUseNFTPageState } from './types';

export default function useNFTPage({
  appId,
  tokenId,
}: IUseNFTPageOptions): IUseNFTPageState {
  // selectors
  const account: IAccount | null = useSelectActiveAccount();
  const accountInformation: IAccountInformation | null =
    useSelectActiveAccountInformation();
  const arc0072Assets: IARC0072Asset[] =
    useSelectARC0072AssetsBySelectedNetwork();
  // state
  const [asset, setAsset] = useState<IARC0072Asset | null>(null);
  const [assetHolding, setAssetHolding] = useState<IARC0072AssetHolding | null>(
    null
  );

  useEffect(() => {
    let selectedAsset: IARC0072Asset | null;

    if (appId) {
      // first, find amongst the arc-0072 assets
      selectedAsset = arc0072Assets.find((value) => value.id === appId) || null;

      setAsset(selectedAsset);
    }
  }, [arc0072Assets, appId]);
  // when we have the asset information and the account information, get the asset holding
  useEffect(() => {
    let selectedAssetHolding: IARC0072AssetHolding | null;

    if (accountInformation && appId && tokenId) {
      selectedAssetHolding =
        accountInformation.arc0072AssetHoldings.find(
          (value) => value.id === appId && value.tokenId === tokenId
        ) || null;

      setAssetHolding(selectedAssetHolding);
    }
  }, [appId, accountInformation, tokenId]);

  return {
    account,
    accountInformation,
    asset,
    assetHolding,
  };
}
