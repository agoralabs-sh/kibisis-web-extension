import browser from 'webextension-polyfill';

// enums
import { AppTypeEnum } from '@extension/enums';

// messages
import { ProviderEventAddedMessage } from '@common/messages';

// services
import AppWindowManagerService from '@extension/services/AppWindowManagerService';
import EventQueueService from '@extension/services/EventQueueService';

// types
import type { IOptions } from './types';

// utils
import isExtensionInitialized from '@extension/utils/isExtensionInitialized';

/**
 * Convenience function that adds an even to the event queue and, if the main app is open, posts a message. However, if
 * there is no main app window open, a background app window is launched with the event ID added to the URL.
 * @param {IOptions} options - the event and the services needed to create the event.
 */
export default async function sendExtensionEvent({
  appWindowManagerService,
  event,
  eventQueueService,
  privateKeyService,
  ...baseOptions
}: IOptions): Promise<void> {
  const _appWindowManagerService =
    appWindowManagerService || new AppWindowManagerService(baseOptions);
  const _eventQueueService =
    eventQueueService || new EventQueueService(baseOptions);
  const _functionName = 'sendExtensionEvent';
  const { logger } = baseOptions;
  const isInitialized = await isExtensionInitialized();
  const mainAppWindows = await _appWindowManagerService.getByType(
    AppTypeEnum.MainApp
  );

  // not initialized, ignore it
  if (!isInitialized) {
    return;
  }

  // remove any closed windows
  await _appWindowManagerService.hydrateAppWindows();

  logger?.debug(
    `${_functionName}: saving event "${event.type}" to event queue`
  );

  // save event to the queue
  await _eventQueueService.save(event);

  // if a main app is open, post that a new event has been added to the queue
  if (mainAppWindows.length > 0) {
    logger?.debug(
      `${_functionName}: main app window open, posting that event "${event.id}" has been added to the queue`
    );

    return await browser.runtime.sendMessage(
      new ProviderEventAddedMessage(event.id)
    );
  }

  logger?.debug(
    `${_functionName}: main app window not open, opening background app window for "${event.type}" event`
  );

  await _appWindowManagerService.createWindow({
    searchParams: new URLSearchParams({
      eventId: encodeURIComponent(event.id), // add the event id to the url search params, so the app knows which event to use
    }),
    type: AppTypeEnum.BackgroundApp,
  });
}
