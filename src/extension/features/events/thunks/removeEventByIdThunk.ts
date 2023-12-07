import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventTypeEnum, EventsThunkEnum } from '@extension/enums';

// features
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '../slice';

// services
import { EventQueueService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import {
  IEvent,
  IEnableEventPayload,
  IMainRootState,
  ISignBytesEventPayload,
  ISignTxnsEventPayload,
} from '@extension/types';

const removeEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<void, string, { state: IMainRootState }>(
  EventsThunkEnum.RemoveEventById,
  async (eventId, { dispatch, getState }) => {
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
