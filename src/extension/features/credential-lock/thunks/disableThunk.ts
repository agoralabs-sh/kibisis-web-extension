import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import CredentialLockService from '@extension/services/CredentialLockService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import { Alarms } from 'webextension-polyfill';

/**
 * Removes all decrypted the private keys and clears the credential lock alarm.
 */
const disableThunk: AsyncThunk<
  void, // return
  void, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  void,
  void,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.Disable, async (_, { getState }) => {
  const logger = getState().system.logger;
  const credentialLockService = new CredentialLockService({
    logger,
  });
  const privateKeyService = new PrivateKeyService({
    logger,
  });
  let alarm: Alarms.Alarm | null;
  let privateKeyItems = await privateKeyService.fetchAllFromStorage();

  // remove all the decrypted private keys
  await privateKeyService.saveManyToStorage(
    privateKeyItems.map((value) => ({
      ...value,
      privateKey: null,
    }))
  );

  logger.debug(`${ThunkEnum.Disable}: removed decrypted private keys`);

  alarm = await credentialLockService.getAlarm();

  if (alarm) {
    await credentialLockService.clearAlarm();
  }
});

export default disableThunk;
