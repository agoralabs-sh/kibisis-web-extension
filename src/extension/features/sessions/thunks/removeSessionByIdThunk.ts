import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// services
import { SessionService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const removeSessionByIdThunk: AsyncThunk<
  string, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string, string, { state: IMainRootState }>(
  SessionsThunkEnum.RemoveSessionById,
  async (id, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const sessionService: SessionService = new SessionService({
      logger,
    });

    logger.debug(
      `${removeSessionByIdThunk.name}: removing session "${id}" from storage`
    );

    await sessionService.removeById(id);

    return id;
  }
);

export default removeSessionByIdThunk;
