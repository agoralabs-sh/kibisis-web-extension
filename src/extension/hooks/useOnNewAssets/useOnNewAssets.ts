import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { updateARC0072AssetInformationThunk } from '@extension/features/arc0072-assets';
import { updateARC0200AssetInformationThunk } from '@extension/features/arc0200-assets';
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// selectors
import {
  useSelectAccounts,
  useSelectARC0072AssetsBySelectedNetwork,
  useSelectARC0200AssetsBySelectedNetwork,
  useSelectSelectedNetwork,
  useSelectStandardAssetsBySelectedNetwork,
} from '@extension/selectors';

// types
import type {
  IAppThunkDispatch,
  IARC0072AssetHolding,
  IARC0200AssetHolding,
  IMainRootState,
  IStandardAssetHolding,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

/**
 * Checks for changes in the accounts and gets new asset information if any new assets.
 */
export default function useOnNewAssets(): void {
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const accounts = useSelectAccounts();
  const arc0072Assets = useSelectARC0072AssetsBySelectedNetwork();
  const arc0200Assets = useSelectARC0200AssetsBySelectedNetwork();
  const standardAssets = useSelectStandardAssetsBySelectedNetwork();
  const selectedNetwork = useSelectSelectedNetwork();

  // check for any new arc-0072 assets
  useEffect(() => {
    if (accounts.length > 0 && arc0072Assets && selectedNetwork) {
      accounts.forEach((account) => {
        const encodedGenesisHash = convertGenesisHashToHex(
          selectedNetwork.genesisHash
        ).toUpperCase();
        const accountInformation =
          account.networkInformation[encodedGenesisHash] || null;
        let newARC0072AssetHoldings: IARC0072AssetHolding[];

        if (accountInformation) {
          // filter out any new arc-0072 assets
          newARC0072AssetHoldings =
            accountInformation.arc0072AssetHoldings.filter(
              (assetHolding) =>
                !arc0072Assets.some((value) => value.id === assetHolding.id)
            );

          // if we have any new arc-0072 assets, update the information
          if (newARC0072AssetHoldings.length > 0) {
            dispatch(
              updateARC0072AssetInformationThunk({
                ids: newARC0072AssetHoldings.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);

  // check for any new arc-0200 assets
  useEffect(() => {
    if (accounts.length > 0 && arc0200Assets && selectedNetwork) {
      accounts.forEach((account) => {
        const encodedGenesisHash = convertGenesisHashToHex(
          selectedNetwork.genesisHash
        ).toUpperCase();
        const accountInformation =
          account.networkInformation[encodedGenesisHash] || null;
        let newARC0200AssetHoldings: IARC0200AssetHolding[];

        if (accountInformation) {
          // filter out any new arc-0200 assets
          newARC0200AssetHoldings =
            accountInformation.arc200AssetHoldings.filter(
              (assetHolding) =>
                !arc0200Assets.some((value) => value.id === assetHolding.id)
            );

          // if we have any new arc-0200 assets, update the information
          if (newARC0200AssetHoldings.length > 0) {
            dispatch(
              updateARC0200AssetInformationThunk({
                ids: newARC0200AssetHoldings.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);

  // check for any new standard assets
  useEffect(() => {
    if (accounts.length > 0 && standardAssets && selectedNetwork) {
      accounts.forEach((account) => {
        const encodedGenesisHash = convertGenesisHashToHex(
          selectedNetwork.genesisHash
        ).toUpperCase();
        const accountInformation =
          account.networkInformation[encodedGenesisHash] || null;
        let newStandardAssetHoldings: IStandardAssetHolding[];

        if (accountInformation) {
          // filter out any new standard assets
          newStandardAssetHoldings =
            accountInformation.standardAssetHoldings.filter(
              (assetHolding) =>
                !standardAssets.some((value) => value.id === assetHolding.id)
            );

          // if we have any new standard assets, update the information
          if (newStandardAssetHoldings.length > 0) {
            dispatch(
              updateStandardAssetInformationThunk({
                ids: newStandardAssetHoldings.map((value) => value.id),
                network: selectedNetwork,
              })
            );
          }
        }
      });
    }
  }, [accounts]);
}
