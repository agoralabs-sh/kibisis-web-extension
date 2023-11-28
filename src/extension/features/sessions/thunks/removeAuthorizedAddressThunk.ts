import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { SESSION_ITEM_KEY_PREFIX } from '@extension/constants';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// services
import { StorageManager } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IMainRootState, ISession } from '@extension/types';
import { IRemoveAuthorizedAddressResult } from '../types';

const removeAuthorizedAddressThunk: AsyncThunk<
  IRemoveAuthorizedAddressResult, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<
  IRemoveAuthorizedAddressResult,
  string,
  { state: IMainRootState }
>(SessionsThunkEnum.RemoveAuthorizedAddress, async (address, { getState }) => {
  const logger: ILogger = getState().system.logger;
  const storageManager: StorageManager = new StorageManager();
  const storageItems: Record<string, unknown> =
    await storageManager.getAllItems();
  const result: IRemoveAuthorizedAddressResult = Object.keys(
    storageItems
  ).reduce<IRemoveAuthorizedAddressResult>(
    (acc, value) => {
      let authorizedAddresses: string[];
      let session: ISession;

      if (value.includes(SESSION_ITEM_KEY_PREFIX)) {
        session = storageItems[value] as ISession;

        if (
          session.authorizedAddresses &&
          session.authorizedAddresses.find((value) => value === address)
        ) {
          authorizedAddresses = session.authorizedAddresses.filter(
            (value) => value !== address
          );

          // if there are no more authorized addresses, we need to remove the session
          if (authorizedAddresses.length <= 0) {
            return {
              ...acc,
              remove: [...acc.remove, session.id],
            };
          }

          // otherwise, we update the session with the removed addresses
          return {
            ...acc,
            update: [
              ...acc.update,
              {
                ...session,
                authorizedAddresses,
              },
            ],
          };
        }
      }

      return acc;
    },
    {
      remove: [],
      update: [],
    }
  );

  // remove any sessions from storage
  if (result.remove.length > 0) {
    logger.debug(
      `${
        removeAuthorizedAddressThunk.name
      }: removing sessions [${result.remove.map(
        (value) => `"${value}"`
      )}] from storage`
    );

    await storageManager.remove(
      result.remove.map((value) => `${SESSION_ITEM_KEY_PREFIX}${value}`)
    );
  }

  // update any sessions from storage
  if (result.update.length > 0) {
    logger.debug(
      `${
        removeAuthorizedAddressThunk.name
      }: updating sessions [${result.update.map(
        (value) => `"${value.id}"`
      )}] with the address "${address}" removed`
    );

    await storageManager.setItems(
      result.update.reduce<Record<string, ISession>>(
        (acc, value) => ({
          ...acc,
          [`${SESSION_ITEM_KEY_PREFIX}${value.id}`]: value,
        }),
        {}
      )
    );
  }

  return result;
});

export default removeAuthorizedAddressThunk;
