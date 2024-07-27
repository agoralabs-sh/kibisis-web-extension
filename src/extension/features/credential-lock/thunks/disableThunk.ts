import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import CredentialLockService from '@extension/services/CredentialLockService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
} from '@extension/types';

/**
 * Removes all decrypted the private keys and clears the credential lock alarm.
 */
const disableThunk: AsyncThunk<
  void, // return
  void, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  void,
  void,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(ThunkEnum.Disable, async (_, { getState, rejectWithValue }) => {
  const logger = getState().system.logger;
  const credentialLockService = new CredentialLockService({
    logger,
  });
  const privateKeyService = new PrivateKeyService({
    logger,
  });
  let privateKeyItems = await privateKeyService.fetchAllFromStorage();

  // remove all the decrypted private keys
  await privateKeyService.saveManyToStorage(
    privateKeyItems.map((value) => ({
      ...value,
      privateKey: null,
    }))
  );

  logger.debug(`${ThunkEnum.Disable}: removed decrypted private keys`);

  await credentialLockService.clearAlarm();

  logger.debug(`${ThunkEnum.Disable}: cleared credential lock alarm`);
});

export default disableThunk;
