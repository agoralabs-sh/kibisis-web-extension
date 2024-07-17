import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidAddress } from 'algosdk';

// errors
import { MalformedDataError } from '@extension/errors';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccount,
  IAccountWithExtendedProps,
  IAsyncThunkConfigWithRejectValue,
  IPrivateKey,
} from '@extension/types';
import type { ISaveNewWatchAccountPayload } from '../types';

// utils
import convertAVMAddressToPublicKey from '@extension/utils/convertAVMAddressToPublicKey';

const saveNewWatchAccountThunk: AsyncThunk<
  IAccountWithExtendedProps, // return
  ISaveNewWatchAccountPayload, // args
  IAsyncThunkConfigWithRejectValue
> = createAsyncThunk<
  IAccountWithExtendedProps,
  ISaveNewWatchAccountPayload,
  IAsyncThunkConfigWithRejectValue
>(
  ThunkEnum.SaveNewWatchAccount,
  async ({ address, name }, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const accountService = new AccountService({ logger });
    const accounts = await accountService.getAllAccounts();
    let _error: string;
    let account: IAccount | null;
    let encodedPublicKey: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: validating address "${address}"`
    );

    if (!isValidAddress(address)) {
      _error = `address "${address}" is not valid`;

      logger.debug(`${ThunkEnum.SaveNewWatchAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    encodedPublicKey = PrivateKeyService.encode(
      convertAVMAddressToPublicKey(address)
    );
    account =
      accounts.find((value) => value.publicKey === encodedPublicKey) || null;

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: checking if "${address}" already exists`
    );

    // if the account exists, just return it
    if (account) {
      privateKeyService = new PrivateKeyService({
        logger,
      });
      privateKeyItem = await privateKeyService.fetchFromStorageByPublicKey(
        encodedPublicKey
      );

      // if the private key exists, it is not a watch account
      return {
        ...account,
        watchAccount: !privateKeyItem,
      };
    }

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: saving watch account "${address}" to storage`
    );

    account = AccountService.initializeDefaultAccount({
      publicKey: encodedPublicKey,
      ...(name && {
        name,
      }),
    });

    // save the account to storage
    await accountService.saveAccounts([account]);

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: saved watch account "${address}" to storage`
    );

    return {
      ...account,
      watchAccount: true,
    };
  }
);

export default saveNewWatchAccountThunk;
