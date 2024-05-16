import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum } from '@extension/enums';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import type { IBaseAsyncThunkConfig } from '@extension/types';

const removeEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, string, IBaseAsyncThunkConfig>(
  EventsThunkEnum.RemoveEventById,
  async (eventId, { getState }) => {
    const logger = getState().system.logger;
    const eventQueueService = new EventQueueService({
      logger,
    });

    logger.debug(
      `${EventsThunkEnum.RemoveEventById}: removing event "${eventId}"`
    );

    await eventQueueService.removeById(eventId);
  }
);

export default removeEventByIdThunk;
