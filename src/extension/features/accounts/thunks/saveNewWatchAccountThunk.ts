import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidAddress } from 'algosdk';
import browser from 'webextension-polyfill';

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
    let account: IAccount | null;
    let encodedPublicKey: string;
    let errorMessage: string;
    let privateKeyItem: IPrivateKey | null;
    let privateKeyService: PrivateKeyService;

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: validating address "${address}"`
    );

    if (!isValidAddress(address)) {
      errorMessage = `address "${address}" is not valid`;

      logger.debug(`${ThunkEnum.SaveNewWatchAccount}: ${errorMessage}`);

      return rejectWithValue(new MalformedDataError(errorMessage));
    }

    encodedPublicKey =
      AccountService.convertAlgorandAddressToPublicKey(address);
    account =
      accounts.find((value) => value.publicKey === encodedPublicKey) || null;

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: checking if "${address}" already exists`
    );

    // if the account exists, just return it
    if (account) {
      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });
      privateKeyItem = await privateKeyService.getPrivateKeyByPublicKey(
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
