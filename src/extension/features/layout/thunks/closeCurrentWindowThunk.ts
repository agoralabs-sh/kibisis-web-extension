import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser, { Windows } from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// types
import type { ILogger } from '@common/types';
import type { IBaseAsyncThunkConfig } from '@extension/types';

const closeCurrentWindowThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig>(
  ThunkEnum.CloseCurrentWindow,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const window: Windows.Window = await browser.windows.getCurrent();

    if (window.id) {
      logger.debug(
        `${ThunkEnum.CloseCurrentWindow}: closing window "${window.id}"`
      );

      await browser.windows.remove(window.id);
    }
  }
);

export default closeCurrentWindowThunk;
