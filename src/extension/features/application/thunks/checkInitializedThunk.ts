import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// Enums
import { ApplicationThunkEnum } from '@extension/enums';

// Services
import { PrivateKeyService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IBaseRootState } from '@extension/types';

const checkInitializedThunk: AsyncThunk<
  boolean, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<boolean, undefined, { state: IBaseRootState }>(
  ApplicationThunkEnum.CheckInitialized,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const privateKeyService: PrivateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    return privateKeyService.isInitialized();
  }
);

export default checkInitializedThunk;
