import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { ThunkEnum } from '../enums';

// types
import type { IBaseAsyncThunkConfig, IBaseRootState } from '@extension/types';

const closeCurrentWindowThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBaseRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IBaseRootState>>(
  ThunkEnum.CloseCurrentWindow,
  async (_, { getState }) => {
    const logger = getState().system.logger;
    const window = await browser.windows.getCurrent();

    if (window.id) {
      logger.debug(
        `${ThunkEnum.CloseCurrentWindow}: closing window "${window.id}"`
      );

      await browser.windows.remove(window.id);
    }
  }
);

export default closeCurrentWindowThunk;
