import {
  ARC0027InvalidGroupIdError,
  ARC0027InvalidInputError,
  ARC0027MethodEnum,
  ARC0027NetworkNotSupportedError,
  ARC0027UnauthorizedSignerError,
  IAccount as IAVMProviderAccount,
  IDisableParams,
  IDisableResult,
  IDiscoverParams,
  IDiscoverResult,
  IEnableParams,
  IEnableResult,
  ISignTransactionsParams,
  ISignTransactionsResult,
  TRequestParams,
  TResponseResults,
} from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { Transaction } from 'algosdk';
import { v4 as uuid } from 'uuid';
import browser, { Runtime } from 'webextension-polyfill';

// config
import { networks } from '@extension/config';

// constants
import { HOST, ICON_URI } from '@common/constants';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';
import { AppTypeEnum, EventTypeEnum } from '@extension/enums';

// events
import { Event } from '@extension/events';

// messages
import {
  BaseProviderMessage,
  ClientRequestMessage,
  ClientResponseMessage,
  ProviderEventAddedMessage,
} from '@common/messages';

// services
import AccountService from '../AccountService';
import AppWindowManagerService from '../AppWindowManagerService';
import EventQueueService from '../EventQueueService';
import PasswordLockService from '../PasswordLockService';
import PrivateKeyService from '../PrivateKeyService';
import SessionService from '../SessionService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type {
  IAccount,
  IAppWindow,
  IClientRequestEventPayload,
  IEvent,
  INetwork,
  ISession,
} from '@extension/types';

// utils
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import fetchSupportedNetworks from '@extension/utils/fetchSupportedNetworks';
import isNetworkSupported from '@extension/utils/isNetworkSupported';
import verifyTransactionGroups from '@extension/utils/verifyTransactionGroups';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

export default class BackgroundMessageHandler {
  // private variables
  private readonly accountService: AccountService;
  private readonly appWindowManagerService: AppWindowManagerService;
  private readonly logger: ILogger | null;
  private readonly eventQueueService: EventQueueService;
  private readonly passwordLockService: PasswordLockService;
  private readonly privateKeyService: PrivateKeyService;
  private readonly sessionService: SessionService;
  private readonly settingsService: SettingsService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this.accountService = new AccountService({
      logger,
    });
    this.appWindowManagerService = new AppWindowManagerService({
      logger,
      storageManager,
    });
    this.eventQueueService = new EventQueueService({
      logger,
    });
    this.logger = logger || null;
    this.passwordLockService = new PasswordLockService({
      logger,
    });
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
      storageManager,
    });
    this.sessionService = new SessionService({
      logger,
    });
    this.settingsService = new SettingsService({
      logger,
      storageManager,
    });
    this.storageManager = storageManager;
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

  private async handleDisableRequestMessage(
    message: ClientRequestMessage<IDisableParams>,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleDisableRequestMessage';
    let network: INetwork | null;
    let sessionIds: string[];
    let sessions: ISession[];

    if (!message.params) {
      return await this.sendResponse(
        new ClientResponseMessage<IDisableResult>({
          error: new ARC0027InvalidInputError({
            message: `no parameters supplied`,
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    network = selectDefaultNetwork(networks);

    if (message.params.genesisHash) {
      network =
        networks.find(
          (value) => value.genesisHash === message.params?.genesisHash
        ) || network;
    }

    // get the network if a genesis hash is present
    if (!network) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}: network not found`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<IDisableResult>({
          error: new ARC0027NetworkNotSupportedError({
            genesisHashes: message.params?.genesisHash
              ? [message.params.genesisHash]
              : [],
            message: `no parameters supplied`,
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    sessions = await this.fetchSessions(
      (value) =>
        value.host === message.clientInfo.host &&
        value.genesisHash === network?.genesisHash
    );

    // if session ids has been specified, filter the sessions
    if (message.params.sessionIds && message.params.sessionIds.length > 0) {
      sessions = sessions.filter((value) =>
        message.params?.sessionIds?.includes(value.id)
      );
    }

    sessionIds = sessions.map((value) => value.id);

    this.logger?.debug(
      `${
        BackgroundMessageHandler.name
      }#${_functionName}: removing sessions [${sessionIds
        .map((value) => `"${value}"`)
        .join(',')}] on host "${message.clientInfo.host}" for network "${
        network.genesisId
      }"`
    );

    // remove the sessions
    await this.sessionService.removeByIds(sessionIds);

    // send the response to the web page (via the content script)
    return await this.sendResponse(
      new ClientResponseMessage<IDisableResult>({
        method: message.method,
        requestId: message.id,
        result: {
          genesisHash: network.genesisHash,
          genesisId: network.genesisId,
          providerId: __PROVIDER_ID__,
          sessionIds,
        },
      }),
      originTabId
    );
  }

  private async handleDiscoverRequestMessage(
    message: ClientRequestMessage<IDiscoverParams>,
    originTabId: number
  ): Promise<void> {
    const supportedNetworks: INetwork[] = await fetchSupportedNetworks(
      this.settingsService
    );

    return await this.sendResponse(
      new ClientResponseMessage<IDiscoverResult>({
        method: message.method,
        requestId: message.id,
        result: {
          host: HOST,
          icon: ICON_URI,
          name: __APP_TITLE__,
          networks: supportedNetworks.map(({ genesisHash, genesisId }) => ({
            genesisHash,
            genesisId,
            methods: [
              ARC0027MethodEnum.Enable,
              ARC0027MethodEnum.Disable,
              ARC0027MethodEnum.SignTransactions,
            ],
          })),
          providerId: __PROVIDER_ID__,
        },
      }),
      originTabId
    );
  }

  private async handleEnableRequestMessage(
    message: ClientRequestMessage<IEnableParams>,
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
          `${BackgroundMessageHandler.name}#${_functionName}: genesis hash "${message.params.genesisHash}" is not supported`
        );

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new ClientResponseMessage<IEnableResult>({
            error: new ARC0027NetworkNotSupportedError({
              genesisHashes: [message.params.genesisHash],
              message: `no parameters supplied`,
              providerId: __PROVIDER_ID__,
            }),
            method: message.method,
            requestId: message.id,
          }),
          originTabId
        );
      }

      // filter the sessions by the specified genesis hash
      sessionFilterPredicate = (value) =>
        value.genesisHash === message.params?.genesisHash;
    }

    sessions = await this.fetchSessions(sessionFilterPredicate);
    session =
      sessions.find((value) => value.host === message.clientInfo.host) || null;

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
          new ClientResponseMessage<IEnableResult>({
            method: message.method,
            requestId: message.id,
            result: {
              accounts: session.authorizedAddresses.map<IAVMProviderAccount>(
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
            },
          }),
          originTabId
        );
      }

      // if the network is unrecognized, remove the session, it is no longer valid
      await this.sessionService.removeByIds([session.id]);
    }

    return await this.sendExtensionEvent(
      new Event({
        id: uuid(),
        payload: {
          message,
          originTabId,
        },
        type: EventTypeEnum.ClientRequest,
      })
    );
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

  private async handlePasswordLockClearMessage(): Promise<void> {
    const _functionName: string = 'handlePasswordLockClearMessage';

    await this.passwordLockService.clearAlarm();

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}: password lock cleared`
    );
  }

  private async handleRegistrationCompletedMessage(): Promise<void> {
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    const registrationAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.RegistrationApp);

    // if there is no main app windows, create a new one
    if (mainAppWindows.length <= 0) {
      await this.appWindowManagerService.createWindow({
        type: AppTypeEnum.MainApp,
        ...(registrationAppWindows[0] && {
          left: registrationAppWindows[0].left,
          top: registrationAppWindows[0].top,
        }),
      });
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

  // private async handleSignBytesRequestMessage(
  //   clientInfo: IClientInformation,
  //   message: ARC0027SignBytesRequestMessage,
  //   originTabId: number
  // ): Promise<void> {
  //   const _functionName: string = 'handleSignBytesRequestMessage';
  //   const filteredSessions: ISession[] = await this.fetchSessions(
  //     (value) => value.host === clientInfo.host
  //   );
  //   let authorizedAddresses: string[];
  //
  //   // if the app has not been enabled
  //   if (filteredSessions.length <= 0) {
  //     this.logger?.debug(
  //       `${BackgroundMessageHandler.name}#${_functionName}(): no sessions found for sign bytes request`
  //     );
  //
  //     // send the response to the web page (via the content script)
  //     return await this.sendResponse(
  //       new ARC0027SignBytesResponseMessage(
  //         message.id,
  //         new SerializableARC0027UnauthorizedSignerError(
  //           message.params?.signer || null,
  //           __PROVIDER_ID__,
  //           `"${clientInfo.appName}" has not been authorized`
  //         ),
  //         null
  //       ),
  //       originTabId
  //     );
  //   }
  //
  //   authorizedAddresses = getAuthorizedAddressesForHost(
  //     clientInfo.host,
  //     filteredSessions
  //   );
  //
  //   // if the requested signer has not been authorized
  //   if (
  //     message.params?.signer &&
  //     !authorizedAddresses.find((value) => value === message.params?.signer)
  //   ) {
  //     this.logger?.debug(
  //       `${BackgroundMessageHandler.name}#${_functionName}(): signer "${message.params?.signer}" is not authorized`
  //     );
  //
  //     // send the response to the web page (via the content script)
  //     return await this.sendResponse(
  //       new ARC0027SignBytesResponseMessage(
  //         message.id,
  //         new SerializableARC0027UnauthorizedSignerError(
  //           message.params?.signer || null,
  //           __PROVIDER_ID__,
  //           `"${message.params?.signer}" has not been authorized`
  //         ),
  //         null
  //       ),
  //       originTabId
  //     );
  //   }
  //
  //   return await this.sendExtensionEvent({
  //     id: uuid(),
  //     payload: {
  //       clientInfo,
  //       originMessage: message,
  //       originTabId,
  //     },
  //     type: EventTypeEnum.SignBytesRequest,
  //   });
  // }

  private async handleSignTransactionsRequestMessage(
    message: ClientRequestMessage<ISignTransactionsParams>,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'handleSignTransactionsRequestMessage';
    let decodedUnsignedTransactions: Transaction[];
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHashes: string[];
    let supportedNetworks: INetwork[];
    let unsupportedTransactionsByNetwork: Transaction[];

    if (!message.params) {
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidInputError({
            message: `no transactions supplied`,
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
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
        `${BackgroundMessageHandler.name}#${_functionName}: ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidInputError({
            message: errorMessage,
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    // verify the transaction groups
    if (!verifyTransactionGroups(decodedUnsignedTransactions)) {
      errorMessage = `the supplied transactions are invalid and do not conform to the arc-0001 group validation, please https://arc.algorand.foundation/ARCs/arc-0001#group-validation on how to correctly build transactions`;

      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}: ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidGroupIdError({
            message: errorMessage,
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    supportedNetworks = await fetchSupportedNetworks(this.settingsService);
    unsupportedTransactionsByNetwork = decodedUnsignedTransactions.filter(
      (transaction) =>
        supportedNetworks.every(
          (value) => value.genesisHash !== encodeBase64(transaction.genesisHash)
        )
    ); // get any transaction that whose genesis hash is not supported

    // check if any transactions contain unsupported networks
    if (unsupportedTransactionsByNetwork.length > 0) {
      this.logger?.debug(
        `${
          BackgroundMessageHandler.name
        }#${_functionName}: transactions [${unsupportedTransactionsByNetwork
          .map((value) => `"${value.txID()}"`)
          .join(',')}] contain genesis hashes that are not supported`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027NetworkNotSupportedError({
            genesisHashes: uniqueGenesisHashesFromTransactions(
              unsupportedTransactionsByNetwork
            ),
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    genesisHashes = uniqueGenesisHashesFromTransactions(
      decodedUnsignedTransactions
    );
    filteredSessions = await this.fetchSessions(
      (session) =>
        session.host === message.clientInfo.host &&
        genesisHashes.some((value) => value === session.genesisHash)
    );

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}: no sessions found for sign txns request`
      );

      // send the response to the web page
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027UnauthorizedSignerError({
            message: `client "${message.clientInfo.appName}" has not been authorized`,
            providerId: __PROVIDER_ID__,
          }),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    return await this.sendExtensionEvent(
      new Event({
        id: uuid(),
        payload: {
          message,
          originTabId,
        },
        type: EventTypeEnum.ClientRequest,
      })
    );
  }

  private async sendExtensionEvent(
    event: IEvent<IClientRequestEventPayload>
  ): Promise<void> {
    const _functionName: string = 'sendExtensionEvent';
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);

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
        new ProviderEventAddedMessage(event.id)
      );
    }

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}(): main app window not open, opening background app window for "${event.type}" event`
    );

    await this.appWindowManagerService.createWindow({
      searchParams: new URLSearchParams({
        eventId: encodeURIComponent(event.id), // add the event id to the url search params, so the app knows which event to use
      }),
      type: AppTypeEnum.BackgroundApp,
    });
  }

  private async sendResponse(
    message: ClientResponseMessage<TResponseResults>,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'sendResponse';

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}(): sending "${message.method}" response to tab "${originTabId}"`
    );

    // send the response to the web page, via the content script
    return await browser.tabs.sendMessage(originTabId, message);
  }

  private async onClientRequestMessage(
    message: ClientRequestMessage<TRequestParams>,
    originTabId?: number
  ): Promise<void> {
    const _functionName: string = 'onClientRequestMessage';

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}: "${message.method}" message received`
    );

    if (!originTabId) {
      this.logger?.debug(
        `${BackgroundMessageHandler.name}#${_functionName}: unknown sender for "${message.method}" message, ignoring`
      );

      return;
    }

    switch (message.method) {
      case ARC0027MethodEnum.Disable:
        return await this.handleDisableRequestMessage(
          message as ClientRequestMessage<IDisableParams>,
          originTabId
        );
      case ARC0027MethodEnum.Discover:
        return await this.handleDiscoverRequestMessage(
          message as ClientRequestMessage<IDiscoverParams>,
          originTabId
        );
      case ARC0027MethodEnum.Enable:
        return await this.handleEnableRequestMessage(
          message as ClientRequestMessage<IEnableParams>,
          originTabId
        );
      case ARC0027MethodEnum.SignTransactions:
        return await this.handleSignTransactionsRequestMessage(
          message as ClientRequestMessage<ISignTransactionsParams>,
          originTabId
        );
      default:
        break;
    }
  }

  private async onProviderMessage(message: BaseProviderMessage): Promise<void> {
    const _functionName: string = 'onProviderMessage';

    this.logger?.debug(
      `${BackgroundMessageHandler.name}#${_functionName}: message "${message.reference}" received`
    );

    switch (message.reference) {
      case ProviderMessageReferenceEnum.FactoryReset:
        return await this.handleFactoryResetMessage();
      case ProviderMessageReferenceEnum.PasswordLockClear:
        return this.handlePasswordLockClearMessage();
      case ProviderMessageReferenceEnum.RegistrationCompleted:
        return await this.handleRegistrationCompletedMessage();
      default:
        break;
    }
  }

  /**
   * public functions
   */

  public async onMessage(
    message: ClientRequestMessage<TRequestParams> | BaseProviderMessage,
    sender: Runtime.MessageSender
  ): Promise<void> {
    if ((message as BaseProviderMessage).reference) {
      return await this.onProviderMessage(message as BaseProviderMessage);
    }

    return await this.onClientRequestMessage(
      message as ClientRequestMessage<TRequestParams>,
      sender.tab?.id
    );
  }
}
