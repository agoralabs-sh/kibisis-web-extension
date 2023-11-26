import browser, { Runtime, Windows } from 'webextension-polyfill';

// constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
} from '@extension/constants';

// enums
import { EventNameEnum } from '@common/enums';

// events
import { BaseEvent, ExtensionBackgroundAppLoadEvent } from '@common/events';

// servcies
import PrivateKeyService from './PrivateKeyService';
import StorageManager from './StorageManager';

// types
import {
  IBaseOptions,
  IAllExtensionEvents,
  IExtensionRequestEvents,
  IExtensionResponseEvents,
  ILogger,
} from '@common/types';

interface IBackgroundEvent {
  message: BaseEvent;
  windowId: number;
}

export default class BackgroundService {
  private backgroundEvents: IBackgroundEvent[];
  private readonly logger: ILogger | null;
  private mainWindow: Windows.Window | null;
  private readonly privateKeyService: PrivateKeyService;
  private registrationWindow: Windows.Window | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.backgroundEvents = [];
    this.logger = logger || null;
    this.mainWindow = null;
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    this.registrationWindow = null;
    this.storageManager = new StorageManager();
  }

  /**
   * Private functions
   */

  /**
   * Convenience function that simply checks if the background event, with the supplied event ID, exists in the event queue.
   * @param {string} eventId - the event ID of the event to check.
   * @returns {boolean} true if the event is in the event queue, false otherwise.
   * @private
   */
  private doesEventExist(eventId: string): boolean {
    return (
      this.backgroundEvents.findIndex(
        (value) => value.message.id === eventId
      ) >= 0
    );
  }

  private async handleBackgroundAppLoad({
    payload,
  }: ExtensionBackgroundAppLoadEvent): Promise<void> {
    const backgroundEvent: IBackgroundEvent | null =
      this.backgroundEvents.find(
        (value) => value.message.id === payload.eventId
      ) || null;

    // if we recognize the event send the message so the background pop-up can pick it up
    if (backgroundEvent) {
      return await browser.runtime.sendMessage(backgroundEvent.message);
    }
  }

  private async handleExtensionRequest(
    message: IExtensionRequestEvents,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const { id, event } = message;
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    let backgroundWindow: Windows.Window;
    let searchParams: URLSearchParams;

    if (
      !isInitialized || // not initialized, ignore it
      !sender.tab?.id || // no origin tab, no way to send a response, ignore
      this.mainWindow // if the main window is open, let it handle the request
    ) {
      return;
    }

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#handleEnableRequest(): extension message "${event}" received from the content script`
      );

    searchParams = new URLSearchParams({
      eventId: encodeURIComponent(id),
      eventType: encodeURIComponent(event),
      originTabId: encodeURIComponent(sender.tab.id),
    });
    backgroundWindow = await browser.windows.create({
      height: DEFAULT_POPUP_HEIGHT,
      type: 'popup',
      url: `background-app.html?${searchParams.toString()}`,
      width: DEFAULT_POPUP_WIDTH,
    });

    if (backgroundWindow.id) {
      this.backgroundEvents.push({
        message,
        windowId: backgroundWindow.id,
      });
    }
  }

  private async handleExtensionResponse({
    requestEventId,
  }: IExtensionResponseEvents): Promise<void> {
    const backgroundEvent: IBackgroundEvent | null =
      this.backgroundEvents.find(
        (value) => value.message.id === requestEventId
      ) || null;

    if (backgroundEvent) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#handleExtensionResponse(): removing background event window for event "${backgroundEvent.message.id}"`
        );

      // remove the window
      await browser.windows.remove(backgroundEvent.windowId);
    }
  }

  private async handleRegistrationCompleted(): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#handleRegistrationCompleted(): extension message "${EventNameEnum.ExtensionRegistrationCompleted}" received from the popup`
      );

    // if there is no main window, create a new one
    if (!this.mainWindow) {
      this.mainWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'main-app.html',
        width: DEFAULT_POPUP_WIDTH,
        ...(this.registrationWindow && {
          left: this.registrationWindow.left,
          top: this.registrationWindow.top,
        }),
      });
    }

    // if the register window exists remove it
    if (this.registrationWindow && this.registrationWindow.id) {
      await browser.windows.remove(this.registrationWindow.id);
    }
  }

  private async handleReset(): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#handleReset(): extension message "${EventNameEnum.ExtensionReset}" received from the popup`
      );

    // remove the main window if it exists
    if (this.mainWindow && this.mainWindow.id) {
      await browser.windows.remove(this.mainWindow.id);
    }

    // remove any background windows
    await Promise.all(
      this.backgroundEvents.map(
        async (value) => await browser.windows.remove(value.windowId)
      )
    );

    // remove all keys from storage
    await this.storageManager.removeAll();
  }

  /**
   * Public functions
   */

  public async onExtensionMessage(
    message: IAllExtensionEvents,
    sender: Runtime.MessageSender
  ): Promise<void> {
    // if the event already exists, ignore it
    if (this.doesEventExist(message.id)) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onExtensionMessage(): extension message "${message.id}" already exists, ignoring`
        );

      return;
    }

    switch (message.event) {
      // requests from the content script
      case EventNameEnum.ExtensionSignTxnsRequest:
      case EventNameEnum.ExtensionSignBytesRequest:
      case EventNameEnum.ExtensionEnableRequest:
        return await this.handleExtensionRequest(
          message as IExtensionRequestEvents,
          sender
        );

      // responses from the background pop-up
      case EventNameEnum.ExtensionEnableResponse:
      case EventNameEnum.ExtensionSignBytesResponse:
      case EventNameEnum.ExtensionSignTxnsResponse:
        return await this.handleExtensionResponse(
          message as IExtensionResponseEvents
        );

      // misc events
      case EventNameEnum.ExtensionBackgroundAppLoad:
        return await this.handleBackgroundAppLoad(
          message as ExtensionBackgroundAppLoadEvent
        );
      case EventNameEnum.ExtensionRegistrationCompleted:
        return await this.handleRegistrationCompleted();
      case EventNameEnum.ExtensionReset:
        return await this.handleReset();
      default:
        break;
    }
  }

  public async onExtensionClick(): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();

    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onExtensionClick(): no account detected, registering new account`
        );

      // remove everything from storage
      await this.storageManager.removeAll();

      this.registrationWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'registration-app.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      return;
    }

    // if there is no main window up, we can open the app
    if (!this.mainWindow) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onExtensionClick(): previous account detected, opening main app`
        );

      this.mainWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'main-app.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      return;
    }
  }

  public onWindowRemove(windowId: number): void {
    const backgroundEvent: IBackgroundEvent | null =
      this.backgroundEvents.find((value) => value.windowId === windowId) ||
      null;

    if (backgroundEvent) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removing background event window for event "${backgroundEvent.message.id}"`
        );

      // clean up - remove the background event window and the event
      this.backgroundEvents = this.backgroundEvents.filter(
        (value) => value.message.id !== backgroundEvent.message.id
      );
    }

    if (this.mainWindow && this.mainWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed main app window`
        );

      this.mainWindow = null;
    }

    if (this.registrationWindow && this.registrationWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed registration app window`
        );

      this.registrationWindow = null;
    }
  }
}
