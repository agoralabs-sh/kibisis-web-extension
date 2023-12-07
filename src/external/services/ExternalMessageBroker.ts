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

export default class ExternalMessageBroker {
  // private variables
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * public functions
   */

  public onResponseMessage(message: IResponseMessages): void {
    const _functionName: string = 'onResponseMessage';

    this.logger &&
      this.logger.debug(
        `${ExternalMessageBroker.name}#${_functionName}(): extension message "${message.type}" received`
      );

    switch (message.type) {
      case MessageTypeEnum.EnableResponse:
      case MessageTypeEnum.SignBytesResponse:
      case MessageTypeEnum.SignTxnsResponse:
        // send the response to the web page
        return window.postMessage(message);
      default:
        this.logger &&
          this.logger.debug(
            `${ExternalMessageBroker.name}#${_functionName}(): unknown message sent from the extension, ignoring`
          );

        break;
    }
  }

  public async onRequestMessage(
    message: MessageEvent<IRequestMessages>
  ): Promise<void> {
    const _functionName: string = 'onRequestMessage';

    if (message.source !== window || !message.data) {
      return;
    }

    this.logger &&
      this.logger.debug(
        `${ExternalMessageBroker.name}#${_functionName}(): webpage message "${message.data.type}" received`
      );

    switch (message.data.type) {
      case MessageTypeEnum.EnableRequest:
      case MessageTypeEnum.SignBytesRequest:
      case MessageTypeEnum.SignTxnsRequest:
        // send the message to the main app (popup) or the background service
        return await browser.runtime.sendMessage(message.data);
      default:
        this.logger &&
          this.logger.debug(
            `${ExternalMessageBroker.name}#${_functionName}(): unknown message sent from the webpage, ignoring`
          );

        break;
    }
  }
}
