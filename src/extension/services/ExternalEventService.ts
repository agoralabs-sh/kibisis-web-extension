import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { decodeUnsignedTransaction, Transaction } from 'algosdk';
import browser from 'webextension-polyfill';

// Config
import { networks } from '@extension/config';

// Constants
import { SETTINGS_GENERAL_KEY } from '@extension/constants';

// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import {
  SerializableInvalidGroupIdError,
  SerializableInvalidInputError,
  SerializableNetworkNotSupportedError,
  SerializableUnauthorizedSignerError,
} from '@common/errors';

// Events
import {
  ExtensionEnableRequestEvent,
  ExtensionEnableResponseEvent,
  ExtensionSignBytesRequestEvent,
  ExtensionSignBytesResponseEvent,
  ExtensionSignTxnsRequestEvent,
  ExtensionSignTxnsResponseEvent,
  ExternalEnableRequestEvent,
  ExternalEnableResponseEvent,
  ExternalSignBytesRequestEvent,
  ExternalSignBytesResponseEvent,
  ExternalSignTxnsRequestEvent,
  ExternalSignTxnsResponseEvent,
} from '@common/events';

// Services
import AccountService from './AccountService';
import SessionService from './SessionService';
import StorageManager from './StorageManager';

// Types
import {
  IBaseExtensionRequestPayload,
  IBaseOptions,
  IExtensionResponseEvents,
  IExternalRequestEvents,
  ILogger,
  IExternalResponseEvents,
} from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IGeneralSettings,
  INetwork,
  ISession,
  IStorageItemTypes,
} from '@extension/types';

// Utils
import { computeGroupId } from '@common/utils';
import {
  getAuthorizedAddressesForHost,
  mapAddressToWalletAccount,
  selectDefaultNetwork,
  verifyTransactionGroupId,
} from '@extension/utils';

export default class ExternalEventService {
  // private variables
  private readonly accountService: AccountService;
  private readonly logger: ILogger | null;
  private readonly sessionService: SessionService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.accountService = new AccountService({
      logger,
    });
    this.sessionService = new SessionService({
      logger,
    });
    this.storageManager = new StorageManager();
  }

  /**
   * Private functions
   */

  /**
   * Convenience function that constructs the base extension request properties.
   * * appName - uses the content of the "application-name" meta tag, if this doesn't exist, it falls back to the document title.
   * * description - uses the content of the "description" meta tag, if it exists.
   * * host - uses host of the web page.
   * * iconUrl - uses the favicon of the web page.
   * @returns {IBaseExtensionRequestPayload} the base extension payload properties.
   * @private
   */
  private createBaseExtensionRequestPayload(): IBaseExtensionRequestPayload {
    return {
      appName:
        document
          .querySelector('meta[name="application-name"]')
          ?.getAttribute('content') || document.title,
      description:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content') || null,
      host: `${window.location.protocol}//${window.location.host}`,
      iconUrl: this.extractFaviconUrl(),
    };
  }

  /**
   * Utility function to extract the favicon URL.
   * @returns {string} the favicon URL or null if no favicon is found.
   * @see {@link https://stackoverflow.com/a/16844961}
   * @private
   */
  private extractFaviconUrl(): string | null {
    const links: HTMLCollectionOf<HTMLElementTagNameMap['link']> =
      document.getElementsByTagName('link');
    const iconUrls: string[] = [];

    for (const link of Array.from(links)) {
      const rel: string | null = link.getAttribute('rel');
      let href: string | null;
      let origin: string;

      // if the link is not an icon; a favicon, ignore
      if (!rel || !rel.toLowerCase().includes('icon')) {
        continue;
      }

      href = link.getAttribute('href');

      // if there is no href attribute there is no url
      if (!href) {
        continue;
      }

      // if it is an absolute url, just use it
      if (
        href.toLowerCase().indexOf('https:') === 0 ||
        href.toLowerCase().indexOf('http:') === 0
      ) {
        iconUrls.push(href);

        continue;
      }

      // if is an absolute url without a protocol,add the protocol
      if (href.toLowerCase().indexOf('//') === 0) {
        iconUrls.push(`${window.location.protocol}${href}`);

        continue;
      }

      // whats left is relative urls
      origin = `${window.location.protocol}//${window.location.host}`;

      // if there is no forward slash prepended, the favicon is relative to the page
      if (href.indexOf('/') === -1) {
        href = window.location.pathname
          .split('/')
          .map((value, index, array) =>
            !href || index < array.length - 1 ? value : href
          ) // replace the current path with the href
          .join('/');
      }

      iconUrls.push(`${origin}${href}`);
    }

    return (
      iconUrls.find((value) => value.match(/\.(jpg|jpeg|png|gif)$/i)) || // favour image files over ico
      iconUrls[0] ||
      null
    );
  }

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

  private async handleExternalEnableRequest({
    event,
    payload,
  }: ExternalEnableRequestEvent): Promise<void> {
    const { genesisHash } = payload;
    let accounts: IAccount[];
    let baseExtensionPayload: IBaseExtensionRequestPayload;
    let network: INetwork | null = await this.fetchSelectedNetwork(); // get the selected network from storage
    let session: ISession | null;
    let sessionFilterPredicate: ((value: ISession) => boolean) | undefined;
    let sessionNetwork: INetwork | null;
    let sessions: ISession[];

    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExternalEnableRequest(): external message "${event}" received`
      );

    // get the network if a genesis hash is present
    if (genesisHash) {
      network =
        networks.find((value) => value.genesisHash === genesisHash) || null;

      // if there is no network for the genesis hash, it isn't supported
      if (!network) {
        this.logger &&
          this.logger.debug(
            `${ExternalEventService.name}#handleExternalEnableRequest(): genesis hash "${genesisHash}" is not supported`
          );

        // send the response to the web page
        return this.sendExternalResponse(
          new ExternalEnableResponseEvent(
            null,
            new SerializableNetworkNotSupportedError(genesisHash)
          )
        );
      }

      // filter the sessions by the specified genesis hash
      sessionFilterPredicate = (value) => value.genesisHash === genesisHash;
    }

    baseExtensionPayload = this.createBaseExtensionRequestPayload();
    sessions = await this.fetchSessions(sessionFilterPredicate);
    session =
      sessions.find((value) => value.host === baseExtensionPayload.host) ||
      null;

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
            `${ExternalEventService.name}#handleExternalEnableRequest(): found session "${session.id}" updating`
          );

        session = await this.sessionService.save(session);

        // send the response to the web page
        return this.sendExternalResponse(
          new ExternalEnableResponseEvent(
            {
              accounts: session.authorizedAddresses.map((address) =>
                mapAddressToWalletAccount(address, {
                  account:
                    accounts.find(
                      (value) =>
                        AccountService.convertPublicKeyToAlgorandAddress(
                          value.publicKey
                        ) === address
                    ) || null,
                  network: sessionNetwork,
                })
              ),
              genesisHash: session.genesisHash,
              genesisId: session.genesisId,
              sessionId: session.id,
            },
            null
          )
        );
      }

      // if the network is unrecognized, remove the session, it is no longer valid
      await this.sessionService.removeById(session.id);
    }

    // send the message to the main app (popup) or the background service
    return await browser.runtime.sendMessage(
      new ExtensionEnableRequestEvent({
        ...baseExtensionPayload,
        network: network || selectDefaultNetwork(networks),
      })
    );
  }

  private async handleExternalSignBytesRequest({
    event,
    id,
    payload,
  }: ExternalSignBytesRequestEvent): Promise<void> {
    const { signer } = payload;
    let authorizedAddresses: string[];
    let baseExtensionPayload: IBaseExtensionRequestPayload;
    let filteredSessions: ISession[];

    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExternalSignBytesRequest(): external message "${event}" received`
      );

    baseExtensionPayload = this.createBaseExtensionRequestPayload();
    filteredSessions = await this.fetchSessions(
      (value) => value.host === baseExtensionPayload.host
    );

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${ExternalEventService.name}#handleExternalSignBytesRequest(): no sessions found for sign bytes request`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignBytesResponseEvent(
          null,
          new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
            '',
            'app has not been authorized'
          )
        )
      );
    }

    authorizedAddresses = getAuthorizedAddressesForHost(
      baseExtensionPayload.host,
      filteredSessions
    );

    // if the requested signer has not been authorized
    if (signer && !authorizedAddresses.find((value) => value === signer)) {
      this.logger &&
        this.logger.debug(
          `${ExternalEventService.name}#handleExternalSignBytesRequest(): signer "${signer}" is not authorized`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignBytesResponseEvent(
          null,
          new SerializableUnauthorizedSignerError(signer)
        )
      );
    }

    // send the message to the main app (popup) or the background service
    return await browser.runtime.sendMessage(
      new ExtensionSignBytesRequestEvent({
        ...baseExtensionPayload,
        ...payload,
        authorizedAddresses,
      })
    );
  }

  private async handleExternalSignTxnsRequest({
    event,
    payload,
  }: ExternalSignTxnsRequestEvent): Promise<void> {
    let authorizedAddresses: string[];
    let baseExtensionPayload: IBaseExtensionRequestPayload;
    let decodedUnsignedTransactions: Transaction[];
    let encodedComputedGroupId: string;
    let errorMessage: string;
    let filteredSessions: ISession[];
    let genesisHashes: string[];
    let genesisHash: string;
    let network: INetwork | null;

    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExternalSignTxnsRequest(): external message "${event}" received`
      );

    // attempt to decode the transactions
    try {
      decodedUnsignedTransactions = payload.txns.map((value) =>
        decodeUnsignedTransaction(decodeBase64(value.txn))
      );
    } catch (error) {
      errorMessage = `failed to decode transactions: ${error.message}`;

      this.logger &&
        this.logger.debug(
          `${ExternalEventService.name}#handleExternalSignTxnsRequest(): ${errorMessage}`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignTxnsResponseEvent(
          null,
          new SerializableInvalidInputError(errorMessage)
        )
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
          `${ExternalEventService.name}#handleExternalSignTxnsRequest(): ${errorMessage}`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignTxnsResponseEvent(
          null,
          new SerializableInvalidGroupIdError(
            encodedComputedGroupId,
            errorMessage
          )
        )
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
          `${ExternalEventService.name}#handleExternalSignTxnsRequest(): ${errorMessage}`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignTxnsResponseEvent(
          null,
          new SerializableInvalidInputError(errorMessage)
        )
      );
    }

    genesisHash = genesisHashes[0];
    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      this.logger &&
        this.logger.debug(
          `${ExternalEventService.name}#handleExternalSignTxnsRequest(): genesis hash "${genesisHash}" is not supported`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignTxnsResponseEvent(
          null,
          new SerializableNetworkNotSupportedError(genesisHash)
        )
      );
    }

    baseExtensionPayload = this.createBaseExtensionRequestPayload();
    filteredSessions = await this.fetchSessions(
      (value) =>
        value.host === baseExtensionPayload.host &&
        value.genesisHash === genesisHashes[0]
    );

    // if the app has not been enabled
    if (filteredSessions.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${ExternalEventService.name}#handleExternalSignTxnsRequest(): no sessions found for sign txns request`
        );

      // send the response to the web page
      return this.sendExternalResponse(
        new ExternalSignTxnsResponseEvent(
          null,
          new SerializableUnauthorizedSignerError( // TODO: use a more relevant error
            '',
            'app has not been authorized'
          )
        )
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

    // send the message to the main app (popup) or the background service
    return await browser.runtime.sendMessage(
      new ExtensionSignTxnsRequestEvent({
        ...baseExtensionPayload,
        authorizedAddresses,
        network,
        txns: payload.txns,
      })
    );
  }

  private sendExternalResponse(message: IExternalResponseEvents): void {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#sendExternalResponse(): sending "${message.event}" to the web page`
      );

    // send the response to the web page
    return window.postMessage(message);
  }

  /**
   * Public functions
   */

  public onExtensionMessage(message: IExtensionResponseEvents): void {
    switch (message.event) {
      case EventNameEnum.ExtensionEnableResponse:
        return this.sendExternalResponse(
          new ExternalEnableResponseEvent(
            (message as ExtensionEnableResponseEvent).payload,
            message.error
          )
        );
      case EventNameEnum.ExtensionSignBytesResponse:
        return this.sendExternalResponse(
          new ExternalSignBytesResponseEvent(
            (message as ExtensionSignBytesResponseEvent).payload,
            message.error
          )
        );
      case EventNameEnum.ExtensionSignTxnsResponse:
        return this.sendExternalResponse(
          new ExternalSignTxnsResponseEvent(
            (message as ExtensionSignTxnsResponseEvent).payload,
            message.error
          )
        );
      default:
        break;
    }
  }

  public async onExternalMessage(
    message: MessageEvent<IExternalRequestEvents>
  ): Promise<void> {
    if (message.source !== window || !message.data) {
      return;
    }

    switch (message.data.event) {
      case EventNameEnum.ExternalEnableRequest:
        return await this.handleExternalEnableRequest(
          message.data as ExternalEnableRequestEvent
        );
      case EventNameEnum.ExternalSignBytesRequest:
        return await this.handleExternalSignBytesRequest(
          message.data as ExternalSignBytesRequestEvent
        );
      case EventNameEnum.ExternalSignTxnsRequest:
        return await this.handleExternalSignTxnsRequest(
          message.data as ExternalSignTxnsRequestEvent
        );
      default:
        break;
    }
  }
}
