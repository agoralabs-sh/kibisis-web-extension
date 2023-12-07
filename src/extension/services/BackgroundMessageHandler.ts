import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { decodeUnsignedTransaction, Transaction } from 'algosdk';
import { v4 as uuid } from 'uuid';
import browser, { Runtime, Windows } from 'webextension-polyfill';

// config
import { networks } from '@extension/config';

// constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
  SETTINGS_GENERAL_KEY,
} from '@extension/constants';

// enums
import { MessageTypeEnum } from '@common/enums';
import { AppTypeEnum, EventTypeEnum } from '@extension/enums';

// errors
import {
  SerializableInvalidGroupIdError,
  SerializableInvalidInputError,
  SerializableNetworkNotSupportedError,
  SerializableUnauthorizedSignerError,
} from '@common/errors';

// messages
import {
  BaseMessage,
  EnableRequestMessage,
  EnableResponseMessage,
  EventAddedMessage,
  SignBytesRequestMessage,
  SignBytesResponseMessage,
  SignTxnsRequestMessage,
  SignTxnsResponseMessage,
} from '@common/messages';

// services
import AccountService from './AccountService';
import AppWindowManagerService from './AppWindowManagerService';
import EventQueueService from './EventQueueService';
import PrivateKeyService from './PrivateKeyService';
import SessionService from './SessionService';
import StorageManager from './StorageManager';

// types
import { IBaseOptions, ILogger, IResponseMessages } from '@common/types';
import {
  IAccount,
  IAppWindow,
  IEvent,
  IGeneralSettings,
  INetwork,
  ISession,
  IStorageItemTypes,
} from '@extension/types';

// utils
import { computeGroupId } from '@common/utils';
import {
  getAuthorizedAddressesForHost,
  selectDefaultNetwork,
  verifyTransactionGroupId,
} from '@extension/utils';

export default class BackgroundMessageHandler {
  // private variables
  private readonly accountService: AccountService;
  private readonly appWindowManagerService: AppWindowManagerService;
  private readonly logger: ILogger | null;
  private readonly eventQueueService: EventQueueService;
  private readonly privateKeyService: PrivateKeyService;
  private readonly sessionService: SessionService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.accountService = new AccountService({
      logger,
    });
    this.appWindowManagerService = new AppWindowManagerService({
      logger,
    });
    this.eventQueueService = new EventQueueService({
      logger,
    });
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    this.sessionService = new SessionService({
      logger,
    });
    this.storageManager = new StorageManager();
  }

  /**
   * private functions
   */

  /**
   * Convenience function that gets the selected network from storage.
   * @returns {Promise<INetwork | null>} the network or null if no network has been stored.
   * @private
   */
  private async fetchSelectedNetwork(): Promise<INetwork | null> {
    const storageItems: Record<string, IStorageItemTypes | unknown> =
      await this.storageManager.getAllItems();
    const generalSettings: IGeneralSettings =
      (storageItems[SETTINGS_GENERAL_KEY] as IGeneralSettings) || null;

    return (
      networks.find(
        (value) =>
          value.genesisHash === generalSettings?.selectedNetworkGenesisHash
      ) || null
    );
  }

  /**
   * Convenience function that fetches all the sessions from storage and filters them based on a predicate, if it is
   * supplied.
   * @param {(value: ISession, index: number, array: ISession[]) => boolean} filterPredicate - [optional] a filter
   * predicate that will return only sessions that fulfill the predicate.
   * @returns {ISession[]} the filtered sessions, if a predicate was supplied, otherwise all sessions are returned.
   * @private
   */
  private async fetchSessions(
    filterPredicate?: (
      value: ISession,
      index: number,
      array: ISession[]
    ) => boolean
  ): Promise<ISession[]> {
    const sessions: ISession[] = await this.sessionService.getAll();

    // if there is no filter predicate, return all sessions
    if (!filterPredicate) {
      return sessions;
    }

    return sessions.filter(filterPredicate);
  }

  private async handleEnableRequestMessage(
    { payload }: EnableRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleEnableRequestMessage';
    const { genesisHash, ...baseRequestPayload } = payload;
    let accounts: IAccount[];
    let network: INetwork | null = await this.fetchSelectedNetwork(); // get the selected network from storage
    let session: ISession | null;
    let sessionFilterPredicate: ((value: ISession) => boolean) | undefined;
    let sessionNetwork: INetwork | null;
    let sessions: ISession[];

    // get the network if a genesis hash is present
    if (genesisHash) {
      network =
        networks.find((value) => value.genesisHash === genesisHash) || null;

      // if there is no network for the genesis hash, it isn't supported
      if (!network) {
        this.logger &&
          this.logger.debug(
            `${BackgroundMessageHandler.name}#${_functionName}(): genesis hash "${genesisHash}" is not supported`
          );

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new EnableResponseMessage(
            null,
            new SerializableNetworkNotSupportedError(genesisHash)
          ),
          originTabId
        );
      }

      // filter the sessions by the specified genesis hash
      sessionFilterPredicate = (value) => value.genesisHash === genesisHash;
    }

    sessions = await this.fetchSessions(sessionFilterPredicate);
    session =
      sessions.find((value) => value.host === baseRequestPayload.host) || null;

    // if we have a session, update its use and return it
    if (session) {
      sessionNetwork =
        networks.find((value) => value.genesisHash === session?.genesisHash) ||
        null;

      // if the session network is supported, return update and return the session
      if (sessionNetwork) {
        accounts = await this.accountService.getAllAccounts();
        session = {
          ...session,
          usedAt: new Date().getTime(),
        };

        this.logger &&
          this.logger.debug(
            `${BackgroundMessageHandler.name}#${_functionName}(): found session "${session.id}" updating`
          );

        session = await this.sessionService.save(session);

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new EnableResponseMessage(
            {
              accounts: session.authorizedAddresses.map<IWalletAccount>(
                (address) => {
                  const account: IAccount | null =
                    accounts.find(
                      (value) =>
                        AccountService.convertPublicKeyToAlgorandAddress(
                          value.publicKey
                        ) === address
                    ) || null;

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
          ),
          originTabId
        );
      }

      // if the network is unrecognized, remove the session, it is no longer valid
      await this.sessionService.removeById(session.id);
    }

    return await this.sendExtensionEvent({
      id: uuid(),
      originTabId,
      payload: {
        ...baseRequestPayload,
        network: network || selectDefaultNetwork(networks),
      },
      type: EventTypeEnum.Enable,
    });
  }

  private async handleFactoryResetMessage(): Promise<void> {
    const backgroundAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);

    // remove the main app if it exists
    if (mainAppWindows.length > 0) {
      await Promise.all(
        mainAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // remove the background apps if they exist
    if (backgroundAppWindows.length > 0) {
      await Promise.all(
        backgroundAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // remove everything from storage
    await this.storageManager.removeAll();
  }

  private async handleRegistrationCompletedMessage(): Promise<void> {
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    const registrationAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.RegistrationApp);
    let mainWindow: Windows.Window;

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

  private async handleSignBytesRequestMessage(
    { payload }: SignBytesRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignBytesRequestMessage';
    const filteredSessions: ISession[] = await this.fetchSessions(
      (value) => value.host === payload.host
    );
    let authorizedAddresses: string[];

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): no sessions found for sign bytes request`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new SignBytesResponseMessage(
          null,
          new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
            '',
            'app has not been authorized'
          )
        ),
        originTabId
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
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): signer "${payload.signer}" is not authorized`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new SignBytesResponseMessage(
          null,
          new SerializableUnauthorizedSignerError(payload.signer)
        ),
        originTabId
      );
    }

    return await this.sendExtensionEvent({
      id: uuid(),
      originTabId,
      payload: {
        ...payload,
        authorizedAddresses,
      },
      type: EventTypeEnum.SignBytes,
    });
  }

  private async handleSignTxnsRequestMessage(
    { payload }: SignTxnsRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignTxnsRequestMessage';
    let authorizedAddresses: string[];
    let decodedUnsignedTransactions: Transaction[];
    let encodedComputedGroupId: string;
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHashes: string[];
    let genesisHash: string;
    let network: INetwork | null;

    // attempt to decode the transactions
    try {
      decodedUnsignedTransactions = payload.txns.map((value) =>
        decodeUnsignedTransaction(decodeBase64(value.txn))
      );
    } catch (error) {
      errorMessage = `failed to decode transactions: ${error.message}`;

      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new SignTxnsResponseMessage(
          null,
          new SerializableInvalidInputError(errorMessage)
        ),
        originTabId
      );
    }

    // validate the transaction group ids
    if (!verifyTransactionGroupId(decodedUnsignedTransactions)) {
      encodedComputedGroupId = encodeBase64(
        computeGroupId(decodedUnsignedTransactions)
      );
      errorMessage = `the computed group id "${encodedComputedGroupId}" does not match the assigned transaction group ids [${decodedUnsignedTransactions.map(
        (value) => `"${value.group ? encodeBase64(value.group) : 'undefined'}"`
      )}]`;

      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new SignTxnsResponseMessage(
          null,
          new SerializableInvalidGroupIdError(
            encodedComputedGroupId,
            errorMessage
          )
        ),
        originTabId
      );
    }

    genesisHashes = decodedUnsignedTransactions.reduce<string[]>(
      (acc, transaction) => {
        const genesisHash: string = encodeBase64(transaction.genesisHash);

        return acc.some((value) => value === genesisHash)
          ? acc
          : [...acc, genesisHash];
      },
      []
    );

    // there should only be one genesis hash
    if (genesisHashes.length > 1) {
      errorMessage = `the transaction group is not atomic, they are bound for multiple networks: [${genesisHashes.join(
        ','
      )}]`;

      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
        );

      // send the response to the web page
      return await this.sendResponse(
        new SignTxnsResponseMessage(
          null,
          new SerializableInvalidInputError(errorMessage)
        ),
        originTabId
      );
    }

    genesisHash = genesisHashes[0];
    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): genesis hash "${genesisHash}" is not supported`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new SignTxnsResponseMessage(
          null,
          new SerializableNetworkNotSupportedError(genesisHash)
        ),
        originTabId
      );
    }

    filteredSessions = await this.fetchSessions(
      (value) =>
        value.host === payload.host && value.genesisHash === genesisHashes[0]
    );

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): no sessions found for sign txns request`
        );

      // send the response to the web page
      return await this.sendResponse(
        new SignTxnsResponseMessage(
          null,
          new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
            '',
            'app has not been authorized'
          )
        ),
        originTabId
      );
    }

    authorizedAddresses = filteredSessions.reduce<string[]>(
      (acc, session) => [
        ...acc,
        ...session.authorizedAddresses.filter(
          (address) => !acc.some((value) => address === value)
        ), // get only unique addresses
      ],
      []
    );

    return await this.sendExtensionEvent({
      id: uuid(),
      originTabId,
      payload: {
        ...payload,
        authorizedAddresses,
        network,
      },
      type: EventTypeEnum.SignTxns,
    });
  }

  private async sendExtensionEvent(event: IEvent): Promise<void> {
    const _functionName: string = 'sendExtensionMessage';
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    let backgroundWindow: Windows.Window;
    let searchParams: URLSearchParams;

    // not initialized, ignore it
    if (!isInitialized) {
      return;
    }

    // remove any closed windows
    await this.appWindowManagerService.hydrateAppWindows();

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): saving event "${event.type}" to event queue`
      );

    // save event to the queue
    await this.eventQueueService.save(event);

    // if a main app is open, post that a new event has been added to the queue
    if (mainAppWindows.length > 0) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): main app window open, posting that event "${event.id}" has been added to the queue`
        );

      return await browser.runtime.sendMessage(new EventAddedMessage(event.id));
    }

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): main app window not open, opening background app window for "${event.type}" event`
      );

    searchParams = new URLSearchParams({
      eventId: encodeURIComponent(event.id), // add the event id to the url search params, so the app knows which event to use
    });
    backgroundWindow = await browser.windows.create({
      height: DEFAULT_POPUP_HEIGHT,
      type: 'popup',
      url: `background-app.html?${searchParams.toString()}`,
      width: DEFAULT_POPUP_WIDTH,
    });

    // save to app window storage
    await this.appWindowManagerService.saveByBrowserWindowAndType(
      backgroundWindow,
      AppTypeEnum.BackgroundApp
    );
  }

  private async sendResponse(
    message: IResponseMessages,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'sendResponse';

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): sending "${message.type}" to the web page`
      );

    // send the response to the web page, via the content script
    return await browser.tabs.sendMessage(originTabId, message);
  }

  /**
   * public functions
   */

  public async onMessage(
    message: BaseMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _functionName: string = 'onMessage';

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): message "${message.type}" received from the content scripts`
      );

    switch (message.type) {
      case MessageTypeEnum.EnableRequest:
      case MessageTypeEnum.SignBytesRequest:
      case MessageTypeEnum.SignTxnsRequest:
        // handle only if there is an origin tab from the sender
        if (sender.tab?.id) {
          if (message.type === MessageTypeEnum.EnableRequest) {
            return await this.handleEnableRequestMessage(
              message as EnableRequestMessage,
              sender.tab.id
            );
          }

          if (message.type === MessageTypeEnum.SignBytesRequest) {
            return await this.handleSignBytesRequestMessage(
              message as SignBytesRequestMessage,
              sender.tab.id
            );
          }

          if (message.type === MessageTypeEnum.SignTxnsRequest) {
            return await this.handleSignTxnsRequestMessage(
              message as SignTxnsRequestMessage,
              sender.tab.id
            );
          }
        }

        this.logger &&
          this.logger.debug(
            `${BackgroundMessageHandler.name}#${_functionName}(): unknown sender for message "${message.type}", ignoring`
          );

        break;
      case MessageTypeEnum.FactoryReset:
        return await this.handleFactoryResetMessage();
      case MessageTypeEnum.RegistrationCompleted:
        return await this.handleRegistrationCompletedMessage();
      default:
        break;
    }
  }
}
