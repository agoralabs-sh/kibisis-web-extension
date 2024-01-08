import browser from 'webextension-polyfill';

// enums
import { MessageTypeEnum } from '@common/enums';

// types
import {
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

  public async onRequestMessage(message: MessageEvent): Promise<void> {}

  public async onLegacyRequestMessage(
    message: MessageEvent<IRequestMessages>
  ): Promise<void> {
    const _functionName: string = 'onRequestMessage';

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
