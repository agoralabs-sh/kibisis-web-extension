import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { EventTypeEnum, EventsThunkEnum } from '@extension/enums';

// features
import {
  setEnableRequest,
  setSignBytesRequest,
  setSignTxnsRequest,
} from '../slice';

// messages
import {
  Arc0013EnableRequestMessage,
  Arc0013SignBytesRequestMessage,
  Arc0013SignTxnsRequestMessage,
} from '@common/messages';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import { ILogger } from '@common/types';
import {
  IClientEventPayload,
  IEvent,
  IMainRootState,
  ISession,
} from '@extension/types';

const handleNewEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<void, string, { state: IMainRootState }>(
  EventsThunkEnum.HandleNewEventById,
  async (eventId, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    const sessions: ISession[] = getState().sessions.items;
    const eventQueueService: EventQueueService = new EventQueueService({
      logger,
    });
    const event: IEvent<IClientEventPayload> | null =
      await eventQueueService.getById(eventId);

    if (!event) {
      logger.debug(
        `${EventsThunkEnum.HandleNewEventById}: no event found in queue for event "${eventId}", ignoring`
      );

      return;
    }

    switch (event.type) {
      case EventTypeEnum.EnableRequest:
        dispatch(
          setEnableRequest({
            clientInfo: event.payload.clientInfo,
            eventId: event.id,
            originMessage: event.payload
              .originMessage as Arc0013EnableRequestMessage,
            originTabId: event.payload.originTabId,
          })
        );

        break;
      case EventTypeEnum.SignBytesRequest:
        dispatch(
          setSignBytesRequest({
            clientInfo: event.payload.clientInfo,
            eventId: event.id,
            originMessage: event.payload
              .originMessage as Arc0013SignBytesRequestMessage,
            originTabId: event.payload.originTabId,
          })
        );

        break;
      case EventTypeEnum.SignTxnsRequest:
        dispatch(
          setSignTxnsRequest({
            clientInfo: event.payload.clientInfo,
            eventId: event.id,
            originMessage: event.payload
              .originMessage as Arc0013SignTxnsRequestMessage,
            originTabId: event.payload.originTabId,
          })
        );

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
