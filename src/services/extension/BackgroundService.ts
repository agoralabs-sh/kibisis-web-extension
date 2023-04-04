import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import {
  decode as decodeBase64,
  encodeURLSafe as encodeBase64Url,
} from '@stablelib/base64';
import browser, { Runtime, Windows } from 'webextension-polyfill';

// Config
import { networks } from '../../config';

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
import {
  SerializableNetworkNotSupportedError,
  SerializableUnauthorizedSignerError,
} from '../../errors';

// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionEnableResponseEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignBytesResponseEvent,
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

// Utils
import {
  getAuthorizedAddressesForHost,
  selectDefaultNetwork,
} from '../../utils';

export default class BackgroundService {
  private connectWindow: Windows.Window | null;
  private readonly logger: ILogger | null;
  private mainWindow: Windows.Window | null;
  private readonly privateKeyService: PrivateKeyService;
  private registrationWindow: Windows.Window | null;
  private signBytesWindow: Windows.Window | null;
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
    this.signBytesWindow = null;
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
      (selectDefaultNetwork(networks) as INetwork); // get the network from the settings or get the default one (mainnet)

    if (payload.genesisHash) {
      network =
        networks.find(
          (value: INetwork) => value.genesisHash === payload.genesisHash
        ) || null;

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

  private async handleEnableSignBytesRequest(
    { payload }: ExtensionSignBytesRequestEvent,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    let authorizedAddresses: string[];
    let filteredSessions: ISession[];
    let rawDecodedData: Uint8Array;
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
        `${BackgroundService.name}#handleEnableSignBytesRequest(): extension message "${EventNameEnum.ExtensionSignBytesRequest}" received from the content script`
      );

    storageItems = await this.storageManager.getAllItems();
    filteredSessions = Object.keys(storageItems)
      .reduce<ISession[]>(
        (acc, key) =>
          key.startsWith(SESSION_KEY_PREFIX)
            ? [...acc, storageItems[key] as ISession]
            : acc,
        []
      )
      .filter((value) => value.host === payload.host);

    // if the host has not been enabled in the wallet
    if (filteredSessions.length <= 0) {
      return await browser.tabs.sendMessage(
        sender.tab.id,
        new ExtensionSignBytesResponseEvent(
          null,
          new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
            '',
            'app has not been authorized'
          )
        )
      );
    }

    authorizedAddresses = getAuthorizedAddressesForHost(
      payload.host,
      filteredSessions
    );

    // if the requested signer has not been authorized
    if (
      payload.signer &&
      !authorizedAddresses.find((value) => value === payload.signer)
    ) {
      return await browser.tabs.sendMessage(
        sender.tab.id,
        new ExtensionSignBytesResponseEvent(
          null,
          new SerializableUnauthorizedSignerError(payload.signer)
        )
      );
    }

    if (!this.signBytesWindow) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#handleEnableSignBytesRequest(): launching sign bytes app`
        );

      rawDecodedData = decodeBase64(payload.encodedData); // we need to make the base64 URL safe as we will be passing it as a search param
      url = `sign_bytes.html?appName=${
        payload.appName
      }&encodedData=${encodeBase64Url(rawDecodedData)}&host=${
        payload.host
      }&tabId=${sender.tab.id}${
        payload.iconUrl ? `&iconUrl=${payload.iconUrl}` : ''
      }${payload.signer ? `&signer=${payload.signer}` : ''}`;

      this.signBytesWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url,
        width: DEFAULT_POPUP_WIDTH,
      });

      return;
    }
  }

  private async handleSignBytesResponse(): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#handleSignBytesResponse(): extension message "${EventNameEnum.ExtensionSignBytesResponse}" received from the popup`
      );

    // if this was a response from the sign bytes app, remove the window
    if (this.signBytesWindow && this.signBytesWindow.id) {
      await browser.windows.remove(this.signBytesWindow.id);
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
      case EventNameEnum.ExtensionSignBytesRequest:
        return await this.handleEnableSignBytesRequest(
          message as ExtensionSignBytesRequestEvent,
          sender
        );
      case EventNameEnum.ExtensionSignBytesResponse:
        return await this.handleSignBytesResponse();
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
        url: 'registration.html',
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

    if (this.signBytesWindow && this.signBytesWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed sign bytes app window`
        );

      this.signBytesWindow = null;
    }
  }
}
