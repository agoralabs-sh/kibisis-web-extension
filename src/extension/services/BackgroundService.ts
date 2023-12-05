import browser, { Runtime, Windows } from 'webextension-polyfill';

// constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
} from '@extension/constants';

// enums
import { EventNameEnum } from '@common/enums';
import { AppTypeEnum } from '@extension/enums';

// events
import { BaseEvent, ExtensionBackgroundAppLoadEvent } from '@common/events';

// services
import AppWindowManagerService from './AppWindowManagerService';
import PrivateKeyService from './PrivateKeyService';
import StorageManager from './StorageManager';

// types
import {
  IAllExtensionEvents,
  IBaseOptions,
  IExtensionRequestEvents,
  IExtensionResponseEvents,
  ILogger,
} from '@common/types';
import { IAppWindow } from '@extension/types';

interface IBackgroundEvent {
  message: BaseEvent;
  windowId: number;
}

export default class BackgroundService {
  private readonly appWindowManagerService: AppWindowManagerService;
  private backgroundEvents: IBackgroundEvent[];
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.appWindowManagerService = new AppWindowManagerService({
      logger,
    });
    this.backgroundEvents = [];
    this.logger = logger || null;
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
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
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    let backgroundWindow: Windows.Window;
    let searchParams: URLSearchParams;

    if (
      !isInitialized || // not initialized, ignore it
      !sender.tab?.id || // no origin tab, no way to send a response, ignore
      mainAppWindows.length > 0 // if a main window is open, let it handle the request
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
    const _functionName: string = 'handleRegistrationCompleted';
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    const registrationAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.RegistrationApp);
    let mainWindow: Windows.Window;

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#${_functionName}(): extension message "${EventNameEnum.ExtensionRegistrationCompleted}" received from the popup`
      );

    // if there is no main app windows, create a new one
    if (mainAppWindows.length <= 0) {
      mainWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'main-app.html',
        width: DEFAULT_POPUP_WIDTH,
        ...(registrationAppWindows[0] && {
          left: registrationAppWindows[0].left,
          top: registrationAppWindows[0].top,
        }),
      });

      // save to storage
      await this.appWindowManagerService.saveByBrowserWindowAndType(
        mainWindow,
        AppTypeEnum.MainApp
      );
    }

    // if registration app windows exist remove them
    if (registrationAppWindows.length > 0) {
      await Promise.all(
        registrationAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }
  }

  private async handleReset(): Promise<void> {
    const _functionName: string = 'handleReset';
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#${_functionName}(): extension message "${EventNameEnum.ExtensionReset}" received from the popup`
      );

    // remove the main app windows if they exist
    if (mainAppWindows.length > 0) {
      await Promise.all(
        mainAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
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
    const _functionName: string = 'onExtensionClick';
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    let mainWindow: Windows.Window;
    let registrationWindow: Windows.Window;

    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#${_functionName}(): no account detected, registering new account`
        );

      // remove everything from storage
      await this.storageManager.removeAll();

      registrationWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'registration-app.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      // save the registration window to storage
      return await this.appWindowManagerService.saveByBrowserWindowAndType(
        registrationWindow,
        AppTypeEnum.RegistrationApp
      );
    }

    // if there is no main app window up, we can open the app
    if (mainAppWindows.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#${_functionName}(): previous account detected, opening main app`
        );

      mainWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'main-app.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      // save the main app window to storage
      return await this.appWindowManagerService.saveByBrowserWindowAndType(
        mainWindow,
        AppTypeEnum.MainApp
      );
    }
  }

  public async onWindowRemove(windowId: number): Promise<void> {
    const _functionName: string = 'onWindowRemove';
    const backgroundEvent: IBackgroundEvent | null =
      this.backgroundEvents.find((value) => value.windowId === windowId) ||
      null;
    let appWindow: IAppWindow | null;

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

    appWindow = await this.appWindowManagerService.getById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#${_functionName}(): removed "${appWindow.type}" window`
        );

      await this.appWindowManagerService.removeById(windowId);
    }
  }
}
