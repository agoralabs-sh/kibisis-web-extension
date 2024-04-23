import browser from 'webextension-polyfill';

// messages
import {
  BaseARC0027RequestMessage,
  BaseARC0027ResponseMessage,
  ClientRequestMessage,
  ClientResponseMessage,
} from '@common/messages';

// types
import type {
  IARC0027ParamTypes,
  IARC0027ResultTypes,
  IBaseOptions,
  ILogger,
} from '@common/types';
import type { IInitOptions } from './types';

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

    this.channel.onmessage = this.onARC0027RequestMessage.bind(this);
  }

  /**
   * public functions
   */

  public static init(options: IBaseOptions): LegacyClientMessageBroker {
    const channel: BroadcastChannel = new BroadcastChannel(
      'arc0027:channel:name'
    );
    const legacyClientMessageBroker: LegacyClientMessageBroker =
      new LegacyClientMessageBroker({
        ...options,
        channel,
      });

    // listen to requests from the webpage
    channel.onmessage = legacyClientMessageBroker.onARC0027RequestMessage.bind(
      legacyClientMessageBroker
    );

    // listen to incoming extension messages (from the background script / popup)
    browser.runtime.onMessage.addListener(
      legacyClientMessageBroker.onARC0027ResponseMessage.bind(
        legacyClientMessageBroker
      )
    );

    return legacyClientMessageBroker;
  }

  public async onARC0027RequestMessage(
    message: MessageEvent<BaseARC0027RequestMessage<IARC0027ParamTypes>>
  ): Promise<void> {
    const _functionName: string = 'onARC0027RequestMessage';

    switch (message.data.reference) {
      case 'arc0027:get_providers:request':
      case 'arc0027:sign_txns:request':
        this.logger?.debug(
          `${LegacyClientMessageBroker.name}#${_functionName}: legacy request message "${message.data.reference}" received`
        );

        // send the message to the main app (popup) or the background service
        return await browser.runtime.sendMessage({
          clientInfo: createClientInformation(),
          data: message.data,
        });
      default:
        break;
    }
  }

  public onARC0027ResponseMessage(
    message: BaseARC0027ResponseMessage<IARC0027ResultTypes>
  ): void {
    const _functionName: string = 'onARC0027ResponseMessage';

    switch (message.reference) {
      case 'arc0027:get_providers:response':
      case 'arc0027:sign_txns:response':
        this.logger?.debug(
          `${LegacyClientMessageBroker.name}#${_functionName}: legacy response message "${message.reference}" received`
        );

        // broadcast the response to the webpage
        return this.channel.postMessage(message);
      default:
        break;
    }
  }
}
