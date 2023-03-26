import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import browser, { Runtime, Windows } from 'webextension-polyfill';

// Config
import networks from '../../networks.json';

// Constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
  SESSION_KEY_PREFIX,
  SETTINGS_NETWORK_KEY,
} from '../../constants';

// Enums
import { EventNameEnum } from '../../enums';

// Errors
import { SerializableNetworkNotSupportedError } from '../../errors';

// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionEnableResponseEvent,
} from '../../events';

// Services
import PrivateKeyService from './PrivateKeyService';
import StorageManager from './StorageManager';

// Types
import {
  IBaseOptions,
  IExtensionEvents,
  ILogger,
  INetwork,
  IPksAccountStorageItem,
  ISession,
  IStorageItemTypes,
} from '../../types';

export default class BackgroundService {
  private connectWindow: Windows.Window | null;
  private readonly logger: ILogger | null;
  private mainWindow: Windows.Window | null;
  private readonly privateKeyService: PrivateKeyService;
  private registrationWindow: Windows.Window | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.connectWindow = null;
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

  private async handleEnableRequest(
    { payload }: ExtensionEnableRequestEvent,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    let accounts: IPksAccountStorageItem[];
    let network: INetwork | null;
    let session: ISession | null;
    let sessions: ISession[];
    let storageItems: Record<string, IStorageItemTypes | unknown>;
    let url: string;

    // if the app is not initialized, ignore
    if (!isInitialized) {
      return;
    }

    if (!sender.tab?.id) {
      return;
    }

    // if the main window is open, let it handle the request
    if (this.mainWindow) {
      return;
    }

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#handleEnableRequest(): extension message "${EventNameEnum.ExtensionEnableRequest}" received from the content script`
      );

    storageItems = await this.storageManager.getAllItems();
    sessions = Object.keys(storageItems).reduce<ISession[]>(
      (acc, key) =>
        key.startsWith(SESSION_KEY_PREFIX)
          ? [...acc, storageItems[key] as ISession]
          : acc,
      []
    );
    network =
      (storageItems[SETTINGS_NETWORK_KEY] as INetwork | undefined) ||
      (networks[0] as INetwork); // get the network from the settings or get the default one (mainnet)

    if (payload.genesisHash) {
      network =
        networks.find((value) => value.genesisHash === payload.genesisHash) ||
        null;

      // if there is no network for the genesis hash, it isn't supported
      if (!network) {
        this.logger &&
          this.logger.debug(
            `${BackgroundService.name}#handleEnableRequest(): genesis hash "${payload.genesisHash}" not supported`
          );

        return await browser.tabs.sendMessage(
          sender.tab.id,
          new ExtensionEnableResponseEvent(
            null,
            new SerializableNetworkNotSupportedError(payload.genesisHash)
          )
        );
      }

      // filter sessions by requested genesis hash
      sessions = sessions.filter(
        (value) => value.genesisHash === payload.genesisHash
      );
    }

    // get a previous session, if it exists
    session = sessions.find((value) => value.host === payload.host) || null;

    if (session) {
      accounts = await this.privateKeyService.getAccounts();
      session = {
        ...session,
        usedAt: Math.round(new Date().getTime() / 1000),
      };

      // save the updated session
      await this.storageManager.setItems({
        [`${SESSION_KEY_PREFIX}_${session.id}`]: session,
      });

      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#handleEnableRequest(): found previous session "${session.id}" for "${session.host}"`
        );

      return await browser.tabs.sendMessage(
        sender.tab.id,
        new ExtensionEnableResponseEvent(
          {
            accounts: session.authorizedAddresses.map<IWalletAccount>(
              (address) => {
                const account: IPksAccountStorageItem | null =
                  accounts.find((value) => value.publicKey === address) || null;

                return {
                  address,
                  ...(account?.name && {
                    name: account.name,
                  }),
                };
              }
            ),
            genesisHash: session.genesisHash,
            genesisId: session.genesisId,
            sessionId: session.id,
          },
          null
        )
      );
    }

    if (!this.connectWindow) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#handleEnableRequest(): no previous session found for "${payload.host}", launching connect app`
        );

      url = `connect.html?appName=${payload.appName}&genesisHash=${
        network.genesisHash
      }&host=${payload.host}&tabId=${sender.tab.id}${
        payload.iconUrl ? `&iconUrl=${payload.iconUrl}` : ''
      }`;

      this.connectWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url,
        width: DEFAULT_POPUP_WIDTH,
      });

      return;
    }
  }

  private async handleEnableResponse(): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#handleEnableResponse(): extension message "${EventNameEnum.ExtensionEnableResponse}" received from the popup`
      );

    // if this was a response from the connect app, remove the window
    if (this.connectWindow && this.connectWindow.id) {
      await browser.windows.remove(this.connectWindow.id);
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
        url: 'main.html',
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

  /**
   * Public functions
   */

  public async onExtensionMessage(
    message: IExtensionEvents,
    sender: Runtime.MessageSender
  ): Promise<void> {
    switch (message.event) {
      case EventNameEnum.ExtensionEnableRequest:
        return await this.handleEnableRequest(
          message as ExtensionEnableRequestEvent,
          sender
        );
      case EventNameEnum.ExtensionEnableResponse:
        return await this.handleEnableResponse();
      case EventNameEnum.ExtensionRegistrationCompleted:
        return await this.handleRegistrationCompleted();
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

      this.registrationWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'register.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      return;
    }

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#onExtensionClick(): previous account detected, opening main app`
      );

    this.mainWindow = await browser.windows.create({
      height: DEFAULT_POPUP_HEIGHT,
      type: 'popup',
      url: 'main.html',
      width: DEFAULT_POPUP_WIDTH,
    });

    return;
  }

  public onWindowRemove(windowId: number): void {
    if (this.connectWindow && this.connectWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed connect app window`
        );

      this.connectWindow = null;
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
