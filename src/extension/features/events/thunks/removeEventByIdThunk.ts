import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum } from '@extension/enums';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const removeEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<void, string, { state: IMainRootState }>(
  EventsThunkEnum.RemoveEventById,
  async (eventId, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const eventQueueService: EventQueueService = new EventQueueService({
      logger,
    });

    logger.debug(
      `${EventsThunkEnum.RemoveEventById}: removing event "${eventId}"`
    );

    await eventQueueService.removeById(eventId);
  }
);

export default removeEventByIdThunk;
