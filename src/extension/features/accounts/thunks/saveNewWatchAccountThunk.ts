import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidAddress } from 'algosdk';

// errors
import { MalformedDataError } from '@extension/errors';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccount,
  IAccountWithExtendedProps,
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  IPrivateKey,
} from '@extension/types';
import type { ISaveNewWatchAccountPayload } from '../types';

// utils
import convertAVMAddressToPublicKey from '@extension/utils/convertAVMAddressToPublicKey';

const saveNewWatchAccountThunk: AsyncThunk<
  IAccountWithExtendedProps, // return
  ISaveNewWatchAccountPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps,
  ISaveNewWatchAccountPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  ThunkEnum.SaveNewWatchAccount,
  async ({ address, name }, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const accountRepositoryService = new AccountRepositoryService();
    const accounts = await accountRepositoryService.fetchAll();
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

    account = AccountRepositoryService.initializeDefaultAccount({
      publicKey: encodedPublicKey,
      ...(name && {
        name,
      }),
    });

    // save the account to storage
    await accountRepositoryService.save([account]);

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
