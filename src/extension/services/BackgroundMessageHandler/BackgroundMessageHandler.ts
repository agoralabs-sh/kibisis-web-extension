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
import { HOST, ICON_URI } from '@common/constants';
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
  SETTINGS_GENERAL_KEY,
} from '@extension/constants';

// enums
import {
  Arc0013MessageReferenceEnum,
  Arc0013ProviderMethodEnum,
  InternalMessageReferenceEnum,
} from '@common/enums';
import { AppTypeEnum, EventTypeEnum } from '@extension/enums';

// errors
import {
  SerializableArc0013InvalidGroupIdError,
  SerializableArc0013InvalidInputError,
  SerializableArc0013NetworkNotSupportedError,
  SerializableArc0013UnauthorizedSignerError,
} from '@common/errors';

// messages
import {
  Arc0013EnableRequestMessage,
  Arc0013EnableResponseMessage,
  Arc0013GetProvidersRequestMessage,
  Arc0013GetProvidersResponseMessage,
  Arc0013SignBytesRequestMessage,
  Arc0013SignBytesResponseMessage,
  Arc0013SignTxnsRequestMessage,
  Arc0013SignTxnsResponseMessage,
  BaseArc0013RequestMessage,
  BaseArc0013ResponseMessage,
  BaseInternalMessage,
  InternalEventAddedMessage,
} from '@common/messages';

// services
import AccountService from '../AccountService';
import AppWindowManagerService from '../AppWindowManagerService';
import EventQueueService from '../EventQueueService';
import PrivateKeyService from '../PrivateKeyService';
import SessionService from '../SessionService';
import StorageManager from '../StorageManager';

// types
import type {
  IArc0013ParamTypes,
  IArc0013ResultTypes,
  IBaseOptions,
  IClientInformation,
  ILogger,
} from '@common/types';
import type {
  IAccount,
  IAppWindow,
  IClientEventPayload,
  IEvent,
  IGeneralSettings,
  IInternalRequestMessage,
  INetwork,
  ISession,
  IStorageItemTypes,
} from '@extension/types';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import extractGenesisHashFromAtomicTransactions from '@extension/utils/extractGenesisHashFromAtomicTransactions';
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';
import verifyTransactionGroupId from '@extension/utils/verifyTransactionGroupId';

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
    clientInfo: IClientInformation,
    message: Arc0013EnableRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleEnableRequestMessage';
    let accounts: IAccount[];
    let network: INetwork | null = await this.fetchSelectedNetwork(); // get the selected network from storage
    let session: ISession | null;
    let sessionFilterPredicate: ((value: ISession) => boolean) | undefined;
    let sessionNetwork: INetwork | null;
    let sessions: ISession[];

    // get the network if a genesis hash is present
    if (message.params?.genesisHash) {
      network =
        networks.find(
          (value) => value.genesisHash === message.params?.genesisHash
        ) || null;

      // if there is no network for the genesis hash, it isn't supported
      if (!network) {
        this.logger &&
          this.logger.debug(
            `${BackgroundMessageHandler.name}#${_functionName}(): genesis hash "${message.params.genesisHash}" is not supported`
          );

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new Arc0013EnableResponseMessage(
            message.id,
            new SerializableArc0013NetworkNotSupportedError(
              message.params.genesisHash,
              __PROVIDER_ID__
            ),
            null
          ),
          originTabId
        );
      }

      // filter the sessions by the specified genesis hash
      sessionFilterPredicate = (value) =>
        value.genesisHash === message.params?.genesisHash;
    }

    sessions = await this.fetchSessions(sessionFilterPredicate);
    session = sessions.find((value) => value.host === clientInfo.host) || null;

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
          new Arc0013EnableResponseMessage(message.id, null, {
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
            providerId: __PROVIDER_ID__,
            sessionId: session.id,
          }),
          originTabId
        );
      }

      // if the network is unrecognized, remove the session, it is no longer valid
      await this.sessionService.removeById(session.id);
    }

    return await this.sendExtensionEvent({
      id: uuid(),
      payload: {
        clientInfo,
        originMessage: message,
        originTabId,
      },
      type: EventTypeEnum.EnableRequest,
    });
  }

  private async handleFactoryResetMessage(): Promise<void> {
    const backgroundAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.BackgroundApp);
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

  private async handleGetProvidersMessage(
    message: Arc0013GetProvidersRequestMessage,
    originTabId: number
  ): Promise<void> {
    return await this.sendResponse(
      new Arc0013GetProvidersResponseMessage(message.id, null, {
        host: HOST,
        icon: ICON_URI,
        name: __APP_TITLE__,
        networks: networks.map(({ genesisHash, genesisId }) => ({
          genesisHash,
          genesisId,
          methods: [
            Arc0013ProviderMethodEnum.Enable,
            Arc0013ProviderMethodEnum.SignBytes,
            Arc0013ProviderMethodEnum.SignTxns,
          ],
        })),
        providerId: __PROVIDER_ID__,
      }),
      originTabId
    );
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
    clientInfo: IClientInformation,
    message: Arc0013SignBytesRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignBytesRequestMessage';
    const filteredSessions: ISession[] = await this.fetchSessions(
      (value) => value.host === clientInfo.host
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
        new Arc0013SignBytesResponseMessage(
          message.id,
          new SerializableArc0013UnauthorizedSignerError(
            message.params?.signer || null,
            __PROVIDER_ID__,
            `"${clientInfo.appName}" has not been authorized`
          ),
          null
        ),
        originTabId
      );
    }

    authorizedAddresses = getAuthorizedAddressesForHost(
      clientInfo.host,
      filteredSessions
    );

    // if the requested signer has not been authorized
    if (
      message.params?.signer &&
      !authorizedAddresses.find((value) => value === message.params?.signer)
    ) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): signer "${message.params?.signer}" is not authorized`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0013SignBytesResponseMessage(
          message.id,
          new SerializableArc0013UnauthorizedSignerError(
            message.params?.signer || null,
            __PROVIDER_ID__,
            `"${message.params?.signer}" has not been authorized`
          ),
          null
        ),
        originTabId
      );
    }

    return await this.sendExtensionEvent({
      id: uuid(),
      payload: {
        clientInfo,
        originMessage: message,
        originTabId,
      },
      type: EventTypeEnum.SignBytesRequest,
    });
  }

  private async handleSignTxnsRequestMessage(
    clientInfo: IClientInformation,
    message: Arc0013SignTxnsRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignTxnsRequestMessage';
    let decodedUnsignedTransactions: Transaction[];
    let encodedComputedGroupId: string;
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHash: string | null;
    let network: INetwork | null;

    if (!message.params) {
      return await this.sendResponse(
        new Arc0013SignTxnsResponseMessage(
          message.id,
          new SerializableArc0013InvalidInputError(
            __PROVIDER_ID__,
            `no transactions supplied`
          ),
          null
        ),
        originTabId
      );
    }

    // attempt to decode the transactions
    try {
      decodedUnsignedTransactions = message.params.txns.map((value) =>
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
        new Arc0013SignTxnsResponseMessage(
          message.id,
          new SerializableArc0013InvalidInputError(
            __PROVIDER_ID__,
            errorMessage
          ),
          null
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
        new Arc0013SignTxnsResponseMessage(
          message.id,
          new SerializableArc0013InvalidGroupIdError(
            encodedComputedGroupId,
            __PROVIDER_ID__,
            errorMessage
          ),
          null
        ),
        originTabId
      );
    }

    genesisHash = extractGenesisHashFromAtomicTransactions({
      logger: this.logger || undefined,
      txns: message.params.txns,
    });

    if (!genesisHash) {
      errorMessage = `the transaction group is not atomic, they are bound for multiple networks`;

      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
        );

      // send the response to the web page
      return await this.sendResponse(
        new Arc0013SignTxnsResponseMessage(
          message.id,
          new SerializableArc0013InvalidInputError(
            __PROVIDER_ID__,
            errorMessage
          ),
          null
        ),
        originTabId
      );
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): genesis hash "${genesisHash}" is not supported`
        );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0013SignTxnsResponseMessage(
          message.id,
          new SerializableArc0013NetworkNotSupportedError(
            genesisHash,
            __PROVIDER_ID__
          ),
          null
        ),
        originTabId
      );
    }

    filteredSessions = await this.fetchSessions(
      (value) =>
        value.host === clientInfo.host && value.genesisHash === genesisHash
    );

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): no sessions found for sign txns request`
        );

      // send the response to the web page
      return await this.sendResponse(
        new Arc0013SignTxnsResponseMessage(
          message.id,
          new SerializableArc0013UnauthorizedSignerError(
            null,
            __PROVIDER_ID__,
            `"${clientInfo.appName}" has not been authorized`
          ),
          null
        ),
        originTabId
      );
    }

    return await this.sendExtensionEvent({
      id: uuid(),
      payload: {
        clientInfo,
        originMessage: message,
        originTabId,
      },
      type: EventTypeEnum.SignTxnsRequest,
    });
  }

  private async sendExtensionEvent(
    event: IEvent<IClientEventPayload>
  ): Promise<void> {
    const _functionName: string = 'sendExtensionEvent';
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

      return await browser.runtime.sendMessage(
        new InternalEventAddedMessage(event.id)
      );
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
    message: BaseArc0013ResponseMessage<IArc0013ResultTypes>,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'sendResponse';

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): sending "${message.reference}" to the web page`
      );

    // send the response to the web page, via the content script
    return await browser.tabs.sendMessage(originTabId, message);
  }

  private async onArc0013RequestMessage(
    message: BaseArc0013RequestMessage<IArc0013ParamTypes>,
    clientInfo: IClientInformation,
    originTabId?: number
  ): Promise<void> {
    const _functionName: string = 'onArc0013RequestMessage';

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): message "${message.reference}" received`
      );

    if (!originTabId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): unknown sender for message "${message.reference}", ignoring`
        );

      return;
    }

    switch (message.reference) {
      case Arc0013MessageReferenceEnum.EnableRequest:
        return await this.handleEnableRequestMessage(
          clientInfo,
          message as Arc0013EnableRequestMessage,
          originTabId
        );
      case Arc0013MessageReferenceEnum.GetProvidersRequest:
        return await this.handleGetProvidersMessage(
          message as Arc0013GetProvidersRequestMessage,
          originTabId
        );
      case Arc0013MessageReferenceEnum.SignBytesRequest:
        return await this.handleSignBytesRequestMessage(
          clientInfo,
          message as Arc0013SignBytesRequestMessage,
          originTabId
        );
      case Arc0013MessageReferenceEnum.SignTxnsRequest:
        return await this.handleSignTxnsRequestMessage(
          clientInfo,
          message as Arc0013SignTxnsRequestMessage,
          originTabId
        );
      default:
        break;
    }
  }

  private async onInternalMessage(message: BaseInternalMessage): Promise<void> {
    const _functionName: string = 'onInternalMessage';

    this.logger &&
      this.logger.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): message "${message.reference}" received`
      );

    switch (message.reference) {
      case InternalMessageReferenceEnum.FactoryReset:
        return await this.handleFactoryResetMessage();
      case InternalMessageReferenceEnum.RegistrationCompleted:
        return await this.handleRegistrationCompletedMessage();
      default:
        break;
    }
  }
  /**
   * public functions
   */

  public async onMessage(
    message: IInternalRequestMessage | BaseInternalMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    if ((message as BaseInternalMessage).reference) {
      return await this.onInternalMessage(message as BaseInternalMessage);
    }

    return await this.onArc0013RequestMessage(
      (message as IInternalRequestMessage).data,
      (message as IInternalRequestMessage).clientInfo,
      sender.tab?.id
    );
  }
}
