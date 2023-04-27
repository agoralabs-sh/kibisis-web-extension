import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encodeAddress } from 'algosdk';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// Constants
import { ACCOUNT_KEY_PREFIX } from '@extension/constants';

// Features
import { setError } from '@extension/features/application';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { PrivateKeyService, StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IMainRootState,
  INetwork,
  IPrivateKey,
} from '@extension/types';
import { ISaveNewAccountPayload } from '../types';

// Utils
import {
  initializeDefaultAccount,
  selectDefaultNetwork,
} from '@extension/utils';

const saveNewAccountThunk: AsyncThunk<
  IAccount | null, // return
  ISaveNewAccountPayload, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount | null,
  ISaveNewAccountPayload,
  { state: IMainRootState }
>(
  AccountsThunkEnum.SaveNewAccount,
  async ({ name, password, privateKey }, { dispatch, getState }) => {
    const logger: ILogger = getState().application.logger;
    const networks: INetwork[] = getState().networks.items;
    const selectedNetwork: INetwork =
      networks.find(
        (value) =>
          value.genesisHash ===
          getState().settings.general.selectedNetworkGenesisHash
      ) || selectDefaultNetwork(networks);
    let accounts: IAccount[];
    let address: string;
    let pksAccount: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;
    let publicKey: Uint8Array;
    let storageManager: StorageManager;

    try {
      logger.debug(`${saveNewAccountThunk.name}: inferring public key`);

      publicKey = sign.keyPair.fromSecretKey(privateKey).publicKey;
      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });
      address = encodeAddress(publicKey);

      logger.debug(
        `${saveNewAccountThunk.name}: saving private/public key pair for "${address}" to storage`
      );

      // add the new account
      pksAccount = await privateKeyService.setPrivateKey(privateKey, password);
    } catch (error) {
      logger.error(`${saveNewAccountThunk.name}: ${error.message}`);

      dispatch(setError(error));

      throw error;
    }

    logger.debug(
      `${saveNewAccountThunk.name}: successfully saved account "${address}"`
    );

    storageManager = new StorageManager();
    accounts = networks.map(
      (
        value // save a default account for each genesis hash
      ) =>
        initializeDefaultAccount({
          address,
          genesisHash: value.genesisHash,
          ...(pksAccount && {
            createdAt: pksAccount.createdAt,
          }),
          ...(name && {
            name,
          }),
        })
    );

    // save an account for each genesis hash to storage
    await storageManager.setItems(
      accounts.reduce(
        (acc, value) => ({
          ...acc,
          [`${ACCOUNT_KEY_PREFIX}${value.id}`]: value,
        }),
        {}
      )
    );

    logger.debug(
      `${saveNewAccountThunk.name}: saved accounts for "${address}" to storage`
    );

    return (
      accounts.find(
        (value) => value.genesisHash === selectedNetwork.genesisHash
      ) || null
    );
  }
);

export default saveNewAccountThunk;
