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
import EventQueueService from '@extension/services/EventQueueService';

// types
import { ILogger } from '@common/types';
import {
  IEvent,
  IEnableEventPayload,
  IMainRootState,
  ISignBytesEventPayload,
  ISignTxnsEventPayload,
} from '@extension/types';

const handleNewEventByIdThunk: AsyncThunk<
  void, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<void, string, { state: IMainRootState }>(
  EventsThunkEnum.HandleNewEventById,
  async (eventId, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    const eventQueueService: EventQueueService = new EventQueueService({
      logger,
    });
    const event: IEvent | null = await eventQueueService.getById(eventId);

    if (!event) {
      logger.debug(
        `${EventsThunkEnum.HandleNewEventById}: no event found in queue for event "${eventId}", ignoring`
      );

      return;
    }

    switch (event.type) {
      case EventTypeEnum.Enable:
        dispatch(
          setEnableRequest({
            appName: (event as IEvent<IEnableEventPayload>).payload.appName,
            authorizedAddresses: [], // no addresses have been selected
            description: (event as IEvent<IEnableEventPayload>).payload
              .description,
            host: (event as IEvent<IEnableEventPayload>).payload.host,
            iconUrl: (event as IEvent<IEnableEventPayload>).payload.iconUrl,
            network: (event as IEvent<IEnableEventPayload>).payload.network,
            requestEventId: event.id,
            tabId: event.originTabId,
          })
        );

        break;
      case EventTypeEnum.SignBytes:
        dispatch(
          setSignBytesRequest({
            appName: (event as IEvent<ISignBytesEventPayload>).payload.appName,
            authorizedAddresses: (event as IEvent<ISignBytesEventPayload>)
              .payload.authorizedAddresses,
            encodedData: (event as IEvent<ISignBytesEventPayload>).payload
              .encodedData,
            host: (event as IEvent<ISignBytesEventPayload>).payload.host,
            iconUrl: (event as IEvent<ISignBytesEventPayload>).payload.iconUrl,
            signer: (event as IEvent<ISignBytesEventPayload>).payload.signer,
            requestEventId: event.id,
            tabId: event.originTabId,
          })
        );

        break;
      case EventTypeEnum.SignTxns:
        dispatch(
          setSignTxnsRequest({
            appName: (event as IEvent<ISignTxnsEventPayload>).payload.appName,
            authorizedAddresses: (event as IEvent<ISignTxnsEventPayload>)
              .payload.authorizedAddresses,
            host: (event as IEvent<ISignTxnsEventPayload>).payload.host,
            iconUrl: (event as IEvent<ISignTxnsEventPayload>).payload.iconUrl,
            network: (event as IEvent<ISignTxnsEventPayload>).payload.network,
            requestEventId: event.id,
            tabId: event.originTabId,
            transactions: (event as IEvent<ISignTxnsEventPayload>).payload.txns,
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
