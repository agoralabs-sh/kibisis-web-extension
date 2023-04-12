import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { Address, decodeAddress } from 'algosdk';

// Constants
import {
  ACCOUNT_KEY_PREFIX,
  PKS_ACCOUNT_KEY_PREFIX,
} from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Features
import { removeAuthorizedAddressThunk } from '@extension/features/sessions';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState } from '@extension/types';

const removeAccountThunk: AsyncThunk<
  string, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string, string, { state: IMainRootState }>(
  AccountsThunkEnum.RemoveAccount,
  async (address, { dispatch, getState }) => {
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();
    const storageItems: Record<string, unknown> =
      await storageManager.getAllItems();
    const accounts: IAccount[] = Object.keys(storageItems)
      .reduce<IAccount[]>(
        (acc, value) =>
          value.includes(ACCOUNT_KEY_PREFIX)
            ? [...acc, storageItems[value] as IAccount]
            : acc,
        []
      )
      .filter((value) => value.address === address); // filter accounts from storage that match the address
    const decodedAddress: Address = decodeAddress(address);

    logger.debug(
      `${removeAccountThunk.name}: removing private key & account information matching "${address}" from storage`
    );

    await storageManager.remove([
      `${PKS_ACCOUNT_KEY_PREFIX}${encodeHex(decodedAddress.publicKey)}`, // remove the private keys
      ...accounts.map((value) => `${ACCOUNT_KEY_PREFIX}${value.id}`), // remove all the account information
    ]);

    // dispatch an event to update the sessions by removing the authorized address
    dispatch(removeAuthorizedAddressThunk(address));

    return address;
  }
);

export default removeAccountThunk;
