import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import CredentialLockService from '@extension/services/CredentialLockService';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

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
  const privateKeyRepository = new PrivateKeyRepository();
  let alarm: Alarms.Alarm | null;
  let privateKeyItems = await privateKeyRepository.fetchAll();

  // remove all the decrypted private keys
  await privateKeyRepository.saveMany(
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
