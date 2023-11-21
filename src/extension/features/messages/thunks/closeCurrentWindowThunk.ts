import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser, { Windows } from 'webextension-polyfill';

// enums
import { MessagesThunkEnum } from '@extension/enums';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const closeCurrencyWindow: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  MessagesThunkEnum.CloseCurrencyWindow,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const window: Windows.Window = await browser.windows.getCurrent();

    if (window.id) {
      logger.debug(
        `${closeCurrencyWindow.name}: closing window "${window.id}"`
      );

      await browser.windows.remove(window.id);
    }
  }
);

export default closeCurrencyWindow;
