import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum } from '@extension/enums';

// repositories
import EventQueueRepository from '@extension/repositories/EventQueueRepository';

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

  await new EventQueueRepository().removeById(eventId);

  logger.debug(
    `${EventsThunkEnum.RemoveEventById}: removed event "${eventId}"`
  );

  return eventId;
});

export default removeEventByIdThunk;
