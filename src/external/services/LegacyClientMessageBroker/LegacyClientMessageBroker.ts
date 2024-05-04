import {
  ARC0027MethodEnum,
  IDiscoverResult,
  TRequestParams,
} from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// enums
import { LegacyMessageReferenceEnum } from './enums';

// messages
import { ClientRequestMessage, ClientResponseMessage } from '@common/messages';
import {
  LegacyClientRequestMessage,
  LegacyClientResponseMessage,
} from './messages';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import {
  IInitOptions,
  ILegacyDiscoverResult,
  INetworkConfigurationWithLegacyMethods,
  TLegacyResponseResults,
} from './types';

// utils
import createClientInformation from '@external/utils/createClientInformation';

/**
 * @deprecated will be phased out in favour of the avm-web-provider
 */
export default class LegacyClientMessageBroker {
  // private variables
  private readonly channel: BroadcastChannel;
  private readonly logger: ILogger | null;

  private constructor({ channel, logger }: IInitOptions) {
    this.channel = channel;
    this.logger = logger || null;
    this.channel.onmessage = this.onClientRequestMessage.bind(this);
  }

  private convertToLegacyResponse({
    error,
    id,
    method,
    requestId,
    result,
  }: ClientResponseMessage<TLegacyResponseResults>): LegacyClientResponseMessage<TLegacyResponseResults> | null {
    const reference: LegacyMessageReferenceEnum | null =
      this.createResponseMessageReference(method);

    if (!reference) {
      return null;
    }

    // use the legacy method names for discover messages
    if (method === ARC0027MethodEnum.Discover && result) {
      return new LegacyClientResponseMessage<ILegacyDiscoverResult>({
        error: null,
        id,
        reference,
        requestId,
        result: {
          ...result,
          networks: (result as IDiscoverResult).networks.map(
            ({ methods, ...otherProps }) => ({
              ...otherProps,
              methods: methods.map((method) =>
                method === ARC0027MethodEnum.SignTransactions
                  ? 'signTxns'
                  : method
              ),
            })
          ) as INetworkConfigurationWithLegacyMethods[],
        } as ILegacyDiscoverResult,
      });
    }

    return new LegacyClientResponseMessage<TLegacyResponseResults>({
      error: error || null,
      id,
      reference,
      requestId,
      result: result || null,
    });
  }

  private createResponseMessageReference(
    method: ARC0027MethodEnum
  ): LegacyMessageReferenceEnum | null {
    switch (method) {
      case ARC0027MethodEnum.Discover:
        return LegacyMessageReferenceEnum.GetProvidersResponse;
      case ARC0027MethodEnum.Enable:
        return LegacyMessageReferenceEnum.EnableResponse;
      case ARC0027MethodEnum.SignTransactions:
        return LegacyMessageReferenceEnum.SignTxnsResponse;
      default:
        return null;
    }
  }

  /**
   * public functions
   */

  public static init(options: IBaseOptions): LegacyClientMessageBroker {
    const channel: BroadcastChannel = new BroadcastChannel('arc0027:channel');
    const legacyClientMessageBroker: LegacyClientMessageBroker =
      new LegacyClientMessageBroker({
        ...options,
        channel,
      });

    // listen to requests from the webpage
    channel.onmessage = legacyClientMessageBroker.onClientRequestMessage.bind(
      legacyClientMessageBroker
    );

    // listen to incoming messages from the background script/popups
    browser.runtime.onMessage.addListener(
      legacyClientMessageBroker.onProviderResponseMessage.bind(
        legacyClientMessageBroker
      )
    );

    return legacyClientMessageBroker;
  }

  public async onClientRequestMessage(
    message: MessageEvent<LegacyClientRequestMessage<TRequestParams>>
  ): Promise<void> {
    const _functionName: string = 'onClientRequestMessage';
    let method: ARC0027MethodEnum | null = null;

    switch (message.data.reference) {
      case 'arc0027:enable:request':
        method = ARC0027MethodEnum.Enable;
        break;
      case 'arc0027:get_providers:request':
        method = ARC0027MethodEnum.Discover;
        break;
      case 'arc0027:sign_txns:request':
        method = ARC0027MethodEnum.SignTransactions;
        break;
      default:
        break;
    }

    if (method) {
      this.logger?.debug(
        `${LegacyClientMessageBroker.name}#${_functionName}: legacy request message "${message.data.reference}" received`
      );

      // send the message to the background script/popups
      return await browser.runtime.sendMessage(
        new ClientRequestMessage({
          clientInfo: createClientInformation(),
          id: message.data.id,
          method,
          params: message.data.params,
        })
      );
    }
  }

  public onProviderResponseMessage(
    message: ClientResponseMessage<TLegacyResponseResults>
  ): void {
    const _functionName: string = 'onProviderResponseMessage';
    let legacyResponse: LegacyClientResponseMessage<TLegacyResponseResults> | null;

    switch (message.method) {
      case ARC0027MethodEnum.Discover:
      case ARC0027MethodEnum.Enable:
      case ARC0027MethodEnum.SignTransactions:
        this.logger?.debug(
          `${LegacyClientMessageBroker.name}#${_functionName}: legacy response message "${message.method}" received`
        );

        legacyResponse = this.convertToLegacyResponse(message);

        // broadcast to the webpage
        if (legacyResponse) {
          this.channel.postMessage(legacyResponse);
        }

        break;
      default:
        break;
    }
  }
}
