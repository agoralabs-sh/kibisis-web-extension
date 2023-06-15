import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { SessionsThunkEnum } from '@extension/enums';

// Services
import { SessionService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IMainRootState, ISession } from '@extension/types';

const removeSessionByTopicThunk: AsyncThunk<
  string | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string | null, string, { state: IMainRootState }>(
  SessionsThunkEnum.RemoveSessionByTopic,
  async (topic, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const sessionService: SessionService = new SessionService({
      logger,
    });
    const session: ISession | null = await sessionService.getByTopic(topic);

    if (!session) {
      return null;
    }

    logger.debug(
      `${removeSessionByTopicThunk.name}: removing session "${session.id}" from storage`
    );

    await sessionService.removeById(session.id);

    return session.id;
  }
);

export default removeSessionByTopicThunk;
