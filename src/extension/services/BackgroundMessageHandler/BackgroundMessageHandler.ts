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
} from '@extension/constants';

// enums
import {
  Arc0027MessageReferenceEnum,
  Arc0027ProviderMethodEnum,
  InternalMessageReferenceEnum,
} from '@common/enums';
import { AppTypeEnum, EventTypeEnum } from '@extension/enums';

// errors
import {
  SerializableArc0027InvalidGroupIdError,
  SerializableArc0027InvalidInputError,
  SerializableArc0027NetworkNotSupportedError,
  SerializableArc0027UnauthorizedSignerError,
} from '@common/errors';

// messages
import {
  Arc0027EnableRequestMessage,
  Arc0027EnableResponseMessage,
  Arc0027GetProvidersRequestMessage,
  Arc0027GetProvidersResponseMessage,
  Arc0027SignBytesRequestMessage,
  Arc0027SignBytesResponseMessage,
  Arc0027SignTxnsRequestMessage,
  Arc0027SignTxnsResponseMessage,
  BaseArc0027RequestMessage,
  BaseArc0027ResponseMessage,
  BaseInternalMessage,
  InternalEventAddedMessage,
} from '@common/messages';

// services
import AccountService from '../AccountService';
import AppWindowManagerService from '../AppWindowManagerService';
import EventQueueService from '../EventQueueService';
import PrivateKeyService from '../PrivateKeyService';
import SessionService from '../SessionService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';

// types
import type {
  IArc0027ParamTypes,
  IArc0027ResultTypes,
  IBaseOptions,
  IClientInformation,
  ILogger,
} from '@common/types';
import type {
  IAccount,
  IAppWindow,
  IClientEventPayload,
  IEvent,
  IInternalRequestMessage,
  INetwork,
  ISession,
} from '@extension/types';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import extractGenesisHashFromAtomicTransactions from '@extension/utils/extractGenesisHashFromAtomicTransactions';
import fetchSupportedNetworks from '@extension/utils/fetchSupportedNetworks';
import getAuthorizedAddressesForHost from '@extension/utils/getAuthorizedAddressesForHost';
import isNetworkSupported from '@extension/utils/isNetworkSupported';
import verifyTransactionGroupId from '@extension/utils/verifyTransactionGroupId';

export default class BackgroundMessageHandler {
  // private variables
  private readonly accountService: AccountService;
  private readonly appWindowManagerService: AppWindowManagerService;
  private readonly logger: ILogger | null;
  private readonly eventQueueService: EventQueueService;
  private readonly privateKeyService: PrivateKeyService;
  private readonly sessionService: SessionService;
  private readonly settingsService: SettingsService;
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
    this.settingsService = new SettingsService({
      logger,
    });
    this.storageManager = new StorageManager();
  }

  /**
   * private functions
   */

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
    message: Arc0027EnableRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleEnableRequestMessage';
    let accounts: IAccount[];
    let session: ISession | null;
    let sessionFilterPredicate: ((value: ISession) => boolean) | undefined;
    let sessionNetwork: INetwork | null;
    let sessions: ISession[];

    // get the network if a genesis hash is present
    if (message.params?.genesisHash) {
      if (
        !(await isNetworkSupported(
          message.params.genesisHash,
          this.settingsService
        ))
      ) {
        this.logger?.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): genesis hash "${message.params.genesisHash}" is not supported`
        );

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new Arc0027EnableResponseMessage(
            message.id,
            new SerializableArc0027NetworkNotSupportedError(
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

        this.logger?.debug(
          `${BackgroundMessageHandler.name}#${_functionName}(): found session "${session.id}" updating`
        );

        session = await this.sessionService.save(session);

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new Arc0027EnableResponseMessage(message.id, null, {
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
    message: Arc0027GetProvidersRequestMessage,
    originTabId: number
  ): Promise<void> {
    const supportedNetworks: INetwork[] = await fetchSupportedNetworks(
      this.settingsService
    );

    return await this.sendResponse(
      new Arc0027GetProvidersResponseMessage(message.id, null, {
        host: HOST,
        icon: ICON_URI,
        name: __APP_TITLE__,
        networks: supportedNetworks.map(({ genesisHash, genesisId }) => ({
          genesisHash,
          genesisId,
          methods: [
            Arc0027ProviderMethodEnum.Enable,
            Arc0027ProviderMethodEnum.SignBytes,
            Arc0027ProviderMethodEnum.SignTxns,
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
    message: Arc0027SignBytesRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignBytesRequestMessage';
    const filteredSessions: ISession[] = await this.fetchSessions(
      (value) => value.host === clientInfo.host
    );
    let authorizedAddresses: string[];

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): no sessions found for sign bytes request`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0027SignBytesResponseMessage(
          message.id,
          new SerializableArc0027UnauthorizedSignerError(
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
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): signer "${message.params?.signer}" is not authorized`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0027SignBytesResponseMessage(
          message.id,
          new SerializableArc0027UnauthorizedSignerError(
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
    message: Arc0027SignTxnsRequestMessage,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignTxnsRequestMessage';
    let decodedUnsignedTransactions: Transaction[];
    let encodedComputedGroupId: string;
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHash: string | null;
    let network: INetwork | null;
    let supportedNetworks: INetwork[];

    if (!message.params) {
      return await this.sendResponse(
        new Arc0027SignTxnsResponseMessage(
          message.id,
          new SerializableArc0027InvalidInputError(
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

      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0027SignTxnsResponseMessage(
          message.id,
          new SerializableArc0027InvalidInputError(
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

      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0027SignTxnsResponseMessage(
          message.id,
          new SerializableArc0027InvalidGroupIdError(
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

      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): ${errorMessage}`
      );

      // send the response to the web page
      return await this.sendResponse(
        new Arc0027SignTxnsResponseMessage(
          message.id,
          new SerializableArc0027InvalidInputError(
            __PROVIDER_ID__,
            errorMessage
          ),
          null
        ),
        originTabId
      );
    }

    supportedNetworks = await fetchSupportedNetworks(this.settingsService);
    network =
      supportedNetworks.find((value) => value.genesisHash === genesisHash) ||
      null;

    if (!network) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): genesis hash "${genesisHash}" is not supported`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new Arc0027SignTxnsResponseMessage(
          message.id,
          new SerializableArc0027NetworkNotSupportedError(
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
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): no sessions found for sign txns request`
      );

      // send the response to the web page
      return await this.sendResponse(
        new Arc0027SignTxnsResponseMessage(
          message.id,
          new SerializableArc0027UnauthorizedSignerError(
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

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}(): saving event "${event.type}" to event queue`
    );

    // save event to the queue
    await this.eventQueueService.save(event);

    // if a main app is open, post that a new event has been added to the queue
    if (mainAppWindows.length > 0) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): main app window open, posting that event "${event.id}" has been added to the queue`
      );

      return await browser.runtime.sendMessage(
        new InternalEventAddedMessage(event.id)
      );
    }

    this.logger?.debug(
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
    message: BaseArc0027ResponseMessage<IArc0027ResultTypes>,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'sendResponse';

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}(): sending "${message.reference}" to the web page`
    );

    // send the response to the web page, via the content script
    return await browser.tabs.sendMessage(originTabId, message);
  }

  private async onArc0027RequestMessage(
    message: BaseArc0027RequestMessage<IArc0027ParamTypes>,
    clientInfo: IClientInformation,
    originTabId?: number
  ): Promise<void> {
    const _functionName: string = 'onArc0027RequestMessage';

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}(): message "${message.reference}" received`
    );

    if (!originTabId) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}(): unknown sender for message "${message.reference}", ignoring`
      );

      return;
    }

    switch (message.reference) {
      case Arc0027MessageReferenceEnum.EnableRequest:
        return await this.handleEnableRequestMessage(
          clientInfo,
          message as Arc0027EnableRequestMessage,
          originTabId
        );
      case Arc0027MessageReferenceEnum.GetProvidersRequest:
        return await this.handleGetProvidersMessage(
          message as Arc0027GetProvidersRequestMessage,
          originTabId
        );
      case Arc0027MessageReferenceEnum.SignBytesRequest:
        return await this.handleSignBytesRequestMessage(
          clientInfo,
          message as Arc0027SignBytesRequestMessage,
          originTabId
        );
      case Arc0027MessageReferenceEnum.SignTxnsRequest:
        return await this.handleSignTxnsRequestMessage(
          clientInfo,
          message as Arc0027SignTxnsRequestMessage,
          originTabId
        );
      default:
        break;
    }
  }

  private async onInternalMessage(message: BaseInternalMessage): Promise<void> {
    const _functionName: string = 'onInternalMessage';

    this.logger?.debug(
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

    return await this.onArc0027RequestMessage(
      (message as IInternalRequestMessage).data,
      (message as IInternalRequestMessage).clientInfo,
      sender.tab?.id
    );
  }
}
