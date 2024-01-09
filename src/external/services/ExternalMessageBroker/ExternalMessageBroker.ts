import browser from 'webextension-polyfill';

// enums
import { Arc0013MessageReferenceEnum, MessageTypeEnum } from '@common/enums';

// messages
import { BaseArc0013RequestMessage } from '@common/messages';

// types
import type {
  IArc0013ParamTypes,
  IBaseOptions,
  ILogger,
  IRequestMessages,
  IResponseMessages,
} from '@common/types';

interface IOptions extends IBaseOptions {
  channel: BroadcastChannel;
}

export default class ExternalMessageBroker {
  // private variables
  private readonly channel: BroadcastChannel;
  private readonly logger: ILogger | null;

  constructor({ channel, logger }: IOptions) {
    this.channel = channel;
    this.logger = logger || null;
  }

  /**
   * public functions
   */

  public async onArc0013RequestMessage(
    message: MessageEvent<BaseArc0013RequestMessage<IArc0013ParamTypes>>
  ): Promise<void> {
    const _functionName: string = 'onArc0013RequestMessage';

    switch (message.data.reference) {
      case Arc0013MessageReferenceEnum.GetProvidersRequest:
        break;
      default:
        break;
    }
  }

  public onResponseMessage(message: IResponseMessages): void {
    const _functionName: string = 'onResponseMessage';

    switch (message.type) {
      case MessageTypeEnum.EnableResponse:
      case MessageTypeEnum.SignBytesResponse:
      case MessageTypeEnum.SignTxnsResponse:
        this.logger &&
          this.logger.debug(
            `${ExternalMessageBroker.name}#${_functionName}(): response message "${message.type}" received`
          );

        // send the response to the web page
        return window.postMessage(message);
      default:
        break;
    }
  }

  public async onLegacyRequestMessage(
    message: MessageEvent<IRequestMessages>
  ): Promise<void> {
    const _functionName: string = 'onLegacyRequestMessage';

    if (message.source !== window || !message.data) {
      return;
    }

    switch (message.data.type) {
      case MessageTypeEnum.EnableRequest:
      case MessageTypeEnum.SignBytesRequest:
      case MessageTypeEnum.SignTxnsRequest:
        this.logger &&
          this.logger.debug(
            `${ExternalMessageBroker.name}#${_functionName}(): request message "${message.data.type}" received`
          );

        // send the message to the main app (popup) or the background service
        return await browser.runtime.sendMessage(message.data);
      default:
        break;
    }
  }
}
