import {
  ARC0027MethodEnum,
  IEnableParams,
  ISignMessageParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventsThunkEnum, EventTypeEnum } from '@extension/enums';

// features
import {
  setEnableRequest,
  setSignMessageRequest,
  setSignTransactionsRequest,
} from '../slice';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import type {
  IBaseAsyncThunkConfig,
  IClientRequestEvent,
} from '@extension/types';

const handleNewEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<void, string, IBaseAsyncThunkConfig>(
  EventsThunkEnum.HandleNewEventById,
  async (eventId, { dispatch, getState }) => {
    const logger = getState().system.logger;
    const eventQueueService = new EventQueueService({
      logger,
    });
    const event = await eventQueueService.getById(eventId);

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
            setEnableRequest(event as IClientRequestEvent<IEnableParams>)
          );

          return;
        }

        if (event.payload.message.method === ARC0027MethodEnum.SignMessage) {
          dispatch(
            setSignMessageRequest(
              event as IClientRequestEvent<ISignMessageParams>
            )
          );

          return;
        }

        if (
          event.payload.message.method === ARC0027MethodEnum.SignTransactions
        ) {
          dispatch(
            setSignTransactionsRequest(
              event as IClientRequestEvent<ISignTransactionsParams>
            )
          );

          return;
        }

        break;
      case EventTypeEnum.SendKeyRegistrationTransaction:
        console.log('event:::::::', JSON.stringify(event));

      // break;
      default:
        logger.debug(
          `${
            EventsThunkEnum.HandleNewEventById
          }: unknown event "${JSON.stringify(event)}", removing`
        );

        await eventQueueService.removeById(eventId);

        break;
    }
  }
);

export default handleNewEventByIdThunk;
