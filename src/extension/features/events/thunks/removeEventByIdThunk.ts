import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum } from '@extension/enums';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

const removeEventByIdThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  string,
  string,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(EventsThunkEnum.RemoveEventById, async (eventId, { getState }) => {
  const logger = getState().system.logger;
  const eventQueueService = new EventQueueService({
    logger,
  });

  logger.debug(
    `${EventsThunkEnum.RemoveEventById}: removing event "${eventId}"`
  );

  await eventQueueService.removeById(eventId);

  return eventId;
});

export default removeEventByIdThunk;
