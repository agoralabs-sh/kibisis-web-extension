import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum, EventTypeEnum } from '@extension/enums';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import type {
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
  TEvents,
} from '@extension/types';

const handleNewEventByIdThunk: AsyncThunk<
  TEvents | null, // return
  string, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  TEvents | null,
  string,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(EventsThunkEnum.HandleNewEventById, async (eventId, { getState }) => {
  const logger = getState().system.logger;
  const eventQueueService = new EventQueueService({
    logger,
  });
  const event = await eventQueueService.getById(eventId);

  if (!event) {
    logger.debug(
      `${EventsThunkEnum.HandleNewEventById}: no event found in queue for event "${eventId}", ignoring`
    );

    return null;
  }

  switch (event.type) {
    case EventTypeEnum.ClientRequest:
    case EventTypeEnum.ARC0300KeyRegistrationTransactionSend:
      return event;
    default:
      logger.debug(
        `${EventsThunkEnum.HandleNewEventById}: unknown event "${JSON.stringify(
          event
        )}", removing`
      );

      await eventQueueService.removeById(eventId);

      return null;
  }
});

export default handleNewEventByIdThunk;
