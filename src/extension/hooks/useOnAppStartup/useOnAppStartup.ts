import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import {
  fetchAccountsFromStorageThunk,
  updateAccountsThunk,
} from '@extension/features/accounts';
import { fetchActiveThunk as fetchCredentialLockActiveThunk } from '@extension/features/credential-lock';
import {
  fetchFromStorageThunk as fetchNetworksFromStorageThunk,
  updateTransactionParamsForSelectedNetworkThunk,
} from '@extension/features/networks';
import { fetchFromStorageThunk as fetchPasskeyCredentialFromStorageThunk } from '@extension/features/passkeys';
import { fetchFromStorageThunk as fetchSessionsFromStorageThunk } from '@extension/features/sessions';
import { fetchFromStorageThunk as fetchSettingsFromStorageThunk } from '@extension/features/settings';
import { fetchStandardAssetsFromStorageThunk } from '@extension/features/standard-assets';
import {
  fetchFromStorageThunk as fetchSystemInfoFromStorageThunk,
  savePolisAccountIDThunk,
} from '@extension/features/system';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type {
  IBackgroundRootState,
  IAppThunkDispatch,
  IMainRootState,
} from '@extension/types';

export default function useOnAppStartup(): void {
  const _hookName = 'useOnAppStartup';
  const dispatch =
    useDispatch<IAppThunkDispatch<IBackgroundRootState | IMainRootState>>();
  // selectors
  const logger = useSelectLogger();

  useEffect(() => {
    // fetch required data
    dispatch(fetchCredentialLockActiveThunk());
    dispatch(fetchPasskeyCredentialFromStorageThunk());
    dispatch(fetchSessionsFromStorageThunk());
    dispatch(fetchStandardAssetsFromStorageThunk());

    // fetch the settings, networks and accounts and update accordingly
    (async () => {
      const { accounts, activeAccountDetails } = await dispatch(
        fetchAccountsFromStorageThunk()
      ).unwrap();
      const networks = await dispatch(fetchNetworksFromStorageThunk()).unwrap();
      const settings = await dispatch(fetchSettingsFromStorageThunk()).unwrap();
      const systemInfo = await dispatch(
        fetchSystemInfoFromStorageThunk()
      ).unwrap();
      const network =
        networks.find(
          (value) =>
            value.genesisHash === settings.general.selectedNetworkGenesisHash
        ) || null;

      if (activeAccountDetails && network) {
        dispatch(
          updateAccountsThunk({
            accountIDs: [activeAccountDetails.accountId],
          })
        );
        dispatch(updateTransactionParamsForSelectedNetworkThunk());
      }

      // if there is no polis account specified, use the first in the accounts
      if (!systemInfo.polisAccountID && accounts.length > 0) {
        logger.debug(
          `${_hookName}: no polis account set, setting default account "${accounts[0].id}"`
        );

        dispatch(savePolisAccountIDThunk(accounts[0].id));
      }
    })();
  }, []);
}
