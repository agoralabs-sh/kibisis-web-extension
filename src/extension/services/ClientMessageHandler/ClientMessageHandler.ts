import {
  ARC0027InvalidGroupIdError,
  ARC0027InvalidInputError,
  ARC0027MethodEnum,
  ARC0027NetworkNotSupportedError,
  ARC0027UnauthorizedSignerError,
  type IAccount as IAVMProviderAccount,
  type IDisableParams,
  type IDisableResult,
  type IDiscoverParams,
  type IDiscoverResult,
  type IEnableParams,
  type IEnableResult,
  type ISignMessageParams,
  type ISignMessageResult,
  type ISignTransactionsParams,
  type ISignTransactionsResult,
  type TRequestParams,
  type TResponseResults,
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
import { EventTypeEnum } from '@extension/enums';

// events
import { ClientRequestEvent } from '@extension/events';

// messages
import {
  ClientRequestMessage,
  ClientResponseMessage,
  ProviderSessionsUpdatedMessage,
} from '@common/messages';

// repositories
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import SessionRepositoryService from '@extension/repositories/SessionRepositoryService';

// services
import EventQueueService from '../EventQueueService';
import PrivateKeyService from '../PrivateKeyService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type {
  IAccount,
  IAccountWithExtendedProps,
  IClientRequestEvent,
  INetwork,
  ISession,
} from '@extension/types';

// utils
import authorizedAccountsForHost from '@extension/utils/authorizedAccountsForHost';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import isNetworkSupportedFromSettings from '@extension/utils/isNetworkSupportedFromSettings';
import isWatchAccount from '@extension/utils/isWatchAccount';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import sendExtensionEvent from '@extension/utils/sendExtensionEvent';
import supportedNetworksFromSettings from '@extension/utils/supportedNetworksFromSettings';
import verifyTransactionGroups from '@extension/utils/verifyTransactionGroups';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

export default class ClientMessageHandler {
  // private variables
  private readonly _accountRepositoryService: AccountRepositoryService;
  private readonly _eventQueueService: EventQueueService;
  private readonly _logger: ILogger | null;
  private readonly _sessionRepositoryService: SessionRepositoryService;
  private readonly _settingsService: SettingsService;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this._accountRepositoryService = new AccountRepositoryService();
    this._eventQueueService = new EventQueueService({
      logger,
    });
    this._logger = logger || null;
    this._sessionRepositoryService = new SessionRepositoryService();
    this._settingsService = new SettingsService({
      logger,
      storageManager,
    });
  }

  /**
   * private functions
   */

  /**
   * Convenience function that fetches all accounts with the extended props.
   * @returns {Promise<IAccountWithExtendedProps[]>} a promise that resolves to all the accounts with extended props.
   * @private
   */
  private async fetchAccounts(): Promise<IAccountWithExtendedProps[]> {
    const accounts = await this._accountRepositoryService.fetchAll();

    return await Promise.all(
      accounts.map(async (value) => ({
        ...value,
        watchAccount: await isWatchAccount({
          account: value,
          logger: this._logger || undefined,
        }),
      }))
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
    const sessions: ISession[] =
      await this._sessionRepositoryService.fetchAll();

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
    const _functionName = 'handleDisableRequestMessage';
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
          id: uuid(),
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
      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: network not found`
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
          id: uuid(),
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

    this._logger?.debug(
      `${
        ClientMessageHandler.name
      }#${_functionName}: removing sessions [${sessionIds
        .map((value) => `"${value}"`)
        .join(',')}] on host "${message.clientInfo.host}" for network "${
        network.genesisId
      }"`
    );

    // remove the sessions
    await this._sessionRepositoryService.removeByIds(sessionIds);

    // send the response to the web page (via the content script)
    await this.sendResponse(
      new ClientResponseMessage<IDisableResult>({
        id: uuid(),
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

    // send a message to the popups to indicate the sessions have been updated
    return await browser.runtime.sendMessage(
      new ProviderSessionsUpdatedMessage(sessions)
    );
  }

  private async handleDiscoverRequestMessage(
    message: ClientRequestMessage<IDiscoverParams>,
    originTabId: number
  ): Promise<void> {
    const supportedNetworks = supportedNetworksFromSettings({
      networks,
      settings: await this._settingsService.fetchFromStorage(),
    });

    return await this.sendResponse(
      new ClientResponseMessage<IDiscoverResult>({
        id: uuid(),
        method: message.method,
        requestId: message.id,
        result: {
          host: HOST,
          icon: ICON_URI,
          name: __APP_TITLE__,
          networks: supportedNetworks.map(
            ({ genesisHash, genesisId, methods }) => ({
              genesisHash,
              genesisId,
              methods,
            })
          ),
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
    const _functionName = 'handleEnableRequestMessage';
    let accounts: IAccount[];
    let session: ISession | null;
    let sessionFilterPredicate: ((value: ISession) => boolean) | undefined;
    let sessionNetwork: INetwork | null;
    let sessions: ISession[];

    // get the network if a genesis hash is present
    if (message.params?.genesisHash) {
      if (
        !isNetworkSupportedFromSettings({
          genesisHash: message.params.genesisHash,
          networks,
          settings: await this._settingsService.fetchFromStorage(),
        })
      ) {
        this._logger?.debug(
          `${ClientMessageHandler.name}#${_functionName}: genesis hash "${message.params.genesisHash}" is not supported`
        );

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new ClientResponseMessage<IEnableResult>({
            error: new ARC0027NetworkNotSupportedError({
              genesisHashes: [message.params.genesisHash],
              message: `no parameters supplied`,
              providerId: __PROVIDER_ID__,
            }),
            id: uuid(),
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
        accounts = await this._accountRepositoryService.fetchAll();
        session = {
          ...session,
          usedAt: new Date().getTime(),
        };

        this._logger?.debug(
          `${ClientMessageHandler.name}#${_functionName}: found session "${session.id}" updating`
        );

        session = await this._sessionRepositoryService.save(session);

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new ClientResponseMessage<IEnableResult>({
            id: uuid(),
            method: message.method,
            requestId: message.id,
            result: {
              accounts: session.authorizedAddresses.map<IAVMProviderAccount>(
                (address) => {
                  const account: IAccount | null =
                    accounts.find(
                      (value) =>
                        convertPublicKeyToAVMAddress(
                          PrivateKeyService.decode(value.publicKey)
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
      await this._sessionRepositoryService.removeByIds([session.id]);
    }

    return await this.sendClientMessageEvent(
      new ClientRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabId,
        },
      })
    );
  }

  private async handleSignMessageRequestMessage(
    message: ClientRequestMessage<ISignMessageParams>,
    originTabId: number
  ): Promise<void> {
    const _functionName = 'handleSignMessageRequestMessage';
    const filteredSessions = await this.fetchSessions(
      (value) => value.host === message.clientInfo.host
    );
    let _error: string;
    let authorizedAccounts: IAccountWithExtendedProps[];
    let signerAccount: IAccountWithExtendedProps | null;

    if (!message.params) {
      return await this.sendResponse(
        new ClientResponseMessage<ISignMessageResult>({
          error: new ARC0027InvalidInputError({
            message: `no message or signer supplied`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: no sessions found for the "${message.method}" request`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<ISignMessageResult>({
          error: new ARC0027UnauthorizedSignerError({
            message: `"${message.clientInfo.appName}" has not been authorized`,
            providerId: __PROVIDER_ID__,
            signer: message.params.signer,
          }),
          id: uuid(),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    authorizedAccounts = authorizedAccountsForHost({
      accounts: await this.fetchAccounts(),
      host: message.clientInfo.host,
      sessions: filteredSessions,
    });

    // if the requested signer has not been authorized or is a watch account
    if (message.params.signer) {
      signerAccount =
        authorizedAccounts.find(
          (value) =>
            convertPublicKeyToAVMAddress(
              PrivateKeyService.decode(value.publicKey)
            ) === message.params?.signer
        ) || null;

      if (!signerAccount || signerAccount.watchAccount) {
        _error = `"${message.params.signer}" ${
          signerAccount?.watchAccount
            ? ` is a watch account`
            : `has not been authorized`
        }`;

        this._logger?.debug(
          `${ClientMessageHandler.name}#${_functionName}: ${_error}`
        );

        // send the response to the web page (via the content script)
        return await this.sendResponse(
          new ClientResponseMessage<ISignMessageResult>({
            error: new ARC0027UnauthorizedSignerError({
              message: _error,
              providerId: __PROVIDER_ID__,
              signer: message.params.signer,
            }),
            id: uuid(),
            method: message.method,
            requestId: message.id,
          }),
          originTabId
        );
      }
    }

    return await this.sendClientMessageEvent(
      new ClientRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabId,
        },
      })
    );
  }

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
          id: uuid(),
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

      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidInputError({
            message: errorMessage,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    // verify the transaction groups
    if (!verifyTransactionGroups(decodedUnsignedTransactions)) {
      errorMessage = `the supplied transactions are invalid and do not conform to the arc-0001 group validation, please https://arc.algorand.foundation/ARCs/arc-0001#group-validation on how to correctly build transactions`;

      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: ${errorMessage}`
      );

      // send the response to the web page (via the content script)
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027InvalidGroupIdError({
            message: errorMessage,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    supportedNetworks = supportedNetworksFromSettings({
      networks,
      settings: await this._settingsService.fetchFromStorage(),
    });
    unsupportedTransactionsByNetwork = decodedUnsignedTransactions.filter(
      (transaction) =>
        supportedNetworks.every(
          (value) => value.genesisHash !== encodeBase64(transaction.genesisHash)
        )
    ); // get any transaction that whose genesis hash is not supported

    // check if any transactions contain unsupported networks
    if (unsupportedTransactionsByNetwork.length > 0) {
      this._logger?.debug(
        `${
          ClientMessageHandler.name
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
          id: uuid(),
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
      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: no sessions found for sign txns request`
      );

      // send the response to the web page
      return await this.sendResponse(
        new ClientResponseMessage<ISignTransactionsResult>({
          error: new ARC0027UnauthorizedSignerError({
            message: `client "${message.clientInfo.appName}" has not been authorized`,
            providerId: __PROVIDER_ID__,
          }),
          id: uuid(),
          method: message.method,
          requestId: message.id,
        }),
        originTabId
      );
    }

    return await this.sendClientMessageEvent(
      new ClientRequestEvent({
        id: uuid(),
        payload: {
          message,
          originTabId,
        },
      })
    );
  }

  private async sendClientMessageEvent<Params extends TRequestParams>(
    event: IClientRequestEvent<Params>
  ): Promise<void> {
    const _functionName = 'sendClientMessageEvent';
    const events = await this._eventQueueService.getByType<
      IClientRequestEvent<TRequestParams>
    >(EventTypeEnum.ClientRequest);

    // if the client request already exists, ignore it
    if (
      events.find(
        (value) => value.payload.message.id === event.payload.message.id
      )
    ) {
      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: client request "${event.payload.message.id}" already exists, ignoring`
      );

      return;
    }

    return await sendExtensionEvent({
      event,
      eventQueueService: this._eventQueueService,
      ...(this._logger && {
        logger: this._logger,
      }),
    });
  }

  private async sendResponse(
    message: ClientResponseMessage<TResponseResults>,
    originTabId: number
  ): Promise<void> {
    const _functionName: string = 'sendResponse';

    this._logger?.debug(
      `${ClientMessageHandler.name}#${_functionName}: sending "${message.method}" response to tab "${originTabId}"`
    );

    // send the response to the web page, via the content script
    return await browser.tabs.sendMessage(originTabId, message);
  }

  /**
   * public functions
   */

  public async onMessage(
    message: ClientRequestMessage<TRequestParams>,
    sender: Runtime.MessageSender
  ): Promise<void> {
    const _functionName: string = 'onMessage';

    this._logger?.debug(
      `${ClientMessageHandler.name}#${_functionName}: "${message.method}" message received`
    );

    if (!sender.tab?.id) {
      this._logger?.debug(
        `${ClientMessageHandler.name}#${_functionName}: unknown sender for "${message.method}" message, ignoring`
      );

      return;
    }

    switch (message.method) {
      case ARC0027MethodEnum.Disable:
        return await this.handleDisableRequestMessage(
          message as ClientRequestMessage<IDisableParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.Discover:
        return await this.handleDiscoverRequestMessage(
          message as ClientRequestMessage<IDiscoverParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.Enable:
        return await this.handleEnableRequestMessage(
          message as ClientRequestMessage<IEnableParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.SignMessage:
        return await this.handleSignMessageRequestMessage(
          message as ClientRequestMessage<ISignMessageParams>,
          sender.tab.id
        );
      case ARC0027MethodEnum.SignTransactions:
        return await this.handleSignTransactionsRequestMessage(
          message as ClientRequestMessage<ISignTransactionsParams>,
          sender.tab.id
        );
      default:
        break;
    }
  }
}
