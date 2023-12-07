import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser, { Windows } from 'webextension-polyfill';

// enums
import { SystemThunkEnum } from '@extension/enums';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const closeCurrentWindowThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  SystemThunkEnum.CloseCurrentWindow,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const window: Windows.Window = await browser.windows.getCurrent();

    if (window.id) {
      logger.debug(
        `${SystemThunkEnum.CloseCurrentWindow}: closing window "${window.id}"`
      );

      await browser.windows.remove(window.id);
    }
  }
);

export default closeCurrentWindowThunk;
