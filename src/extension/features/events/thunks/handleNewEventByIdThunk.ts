import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ClientEventTypeEnum, EventsThunkEnum } from '@extension/enums';

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
  IClientEvent,
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
    const event: IClientEvent | null = await eventQueueService.getById(eventId);

    if (!event) {
      logger.debug(
        `${EventsThunkEnum.HandleNewEventById}: no event found in queue for event "${eventId}", ignoring`
      );

      return;
    }

    switch (event.type) {
      case ClientEventTypeEnum.Enable:
        dispatch(
          setEnableRequest({
            appName: (event as IClientEvent<IEnableEventPayload>).payload
              .appName,
            authorizedAddresses: [], // no addresses have been selected
            description: (event as IClientEvent<IEnableEventPayload>).payload
              .description,
            host: (event as IClientEvent<IEnableEventPayload>).payload.host,
            iconUrl: (event as IClientEvent<IEnableEventPayload>).payload
              .iconUrl,
            network: (event as IClientEvent<IEnableEventPayload>).payload
              .network,
            requestEventId: event.id,
            tabId: event.originTabId,
          })
        );

        break;
      case ClientEventTypeEnum.SignBytes:
        dispatch(
          setSignBytesRequest({
            appName: (event as IClientEvent<ISignBytesEventPayload>).payload
              .appName,
            authorizedAddresses: (event as IClientEvent<ISignBytesEventPayload>)
              .payload.authorizedAddresses,
            encodedData: (event as IClientEvent<ISignBytesEventPayload>).payload
              .encodedData,
            host: (event as IClientEvent<ISignBytesEventPayload>).payload.host,
            iconUrl: (event as IClientEvent<ISignBytesEventPayload>).payload
              .iconUrl,
            signer: (event as IClientEvent<ISignBytesEventPayload>).payload
              .signer,
            requestEventId: event.id,
            tabId: event.originTabId,
          })
        );

        break;
      case ClientEventTypeEnum.SignTxns:
        dispatch(
          setSignTxnsRequest({
            appName: (event as IClientEvent<ISignTxnsEventPayload>).payload
              .appName,
            authorizedAddresses: (event as IClientEvent<ISignTxnsEventPayload>)
              .payload.authorizedAddresses,
            host: (event as IClientEvent<ISignTxnsEventPayload>).payload.host,
            iconUrl: (event as IClientEvent<ISignTxnsEventPayload>).payload
              .iconUrl,
            network: (event as IClientEvent<ISignTxnsEventPayload>).payload
              .network,
            requestEventId: event.id,
            tabId: event.originTabId,
            transactions: (event as IClientEvent<ISignTxnsEventPayload>).payload
              .txns,
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
