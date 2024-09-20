import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { isValidAddress } from 'algosdk';

// errors
import { MalformedDataError } from '@extension/errors';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

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
    const accountRepository = new AccountRepository();
    const accounts = await accountRepository.fetchAll();
    let _error: string;
    let account: IAccount | null;
    let privateKeyItem: IPrivateKey | null;
    let publicKey: Uint8Array;

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: validating address "${address}"`
    );

    if (!isValidAddress(address)) {
      _error = `address "${address}" is not valid`;

      logger.debug(`${ThunkEnum.SaveNewWatchAccount}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    publicKey = convertAVMAddressToPublicKey(address);
    account =
      accounts.find(
        (value) => value.publicKey === AccountRepository.encode(publicKey)
      ) || null;

    logger.debug(
      `${ThunkEnum.SaveNewWatchAccount}: checking if "${address}" already exists`
    );

    // if the account exists, just return it
    if (account) {
      privateKeyItem = await new PrivateKeyRepository().fetchByPublicKey(
        PrivateKeyRepository.encode(publicKey)
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

    account = AccountRepository.initializeDefaultAccount({
      publicKey: AccountRepository.encode(publicKey),
      ...(name && {
        name,
      }),
    });

    // save the account to storage
    await accountRepository.save([account]);

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
