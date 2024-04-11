import {
  ARC0027MethodEnum,
  IEnableParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum, EventTypeEnum } from '@extension/enums';

// features
import { setEnableRequest, setSignTransactionsRequest } from '../slice';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import type { ILogger } from '@common/types';
import type {
  IBaseAsyncThunkConfig,
  IClientRequestEventPayload,
  IEvent,
  TEventPayloads,
} from '@extension/types';

const handleNewEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, string, IBaseAsyncThunkConfig>(
  EventsThunkEnum.HandleNewEventById,
  async (eventId, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    const eventQueueService: EventQueueService = new EventQueueService({
      logger,
    });
    const event: IEvent<TEventPayloads> | null =
      await eventQueueService.getById(eventId);

    if (!event) {
      logger.debug(
        `${EventsThunkEnum.HandleNewEventById}: no event found in queue for event "${eventId}", ignoring`
      );

      return;
    }

    switch (event.type) {
      case EventTypeEnum.ClientRequest:
        if (event.payload.message.method === ARC0027MethodEnum.Enable) {
          dispatch(
            setEnableRequest(
              event as IEvent<IClientRequestEventPayload<IEnableParams>>
            )
          );

          return;
        }

        if (
          event.payload.message.method === ARC0027MethodEnum.SignTransactions
        ) {
          dispatch(
            setSignTransactionsRequest(
              event as IEvent<
                IClientRequestEventPayload<ISignTransactionsParams>
              >
            )
          );

          return;
        }

        break;
      default:
        logger.debug(
          `${EventsThunkEnum.HandleNewEventById}: unknown event "${event.type}", removing`
        );

        await eventQueueService.removeById(eventId);

        break;
    }
  }
);

export default handleNewEventByIdThunk;
