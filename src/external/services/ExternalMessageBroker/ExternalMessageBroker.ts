import browser from 'webextension-polyfill';

// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// messages
import {
  BaseArc0013RequestMessage,
  BaseArc0013ResponseMessage,
} from '@common/messages';

// types
import type {
  IArc0013ParamTypes,
  IArc0013ResultTypes,
  IBaseOptions,
  ILogger,
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
      case Arc0013MessageReferenceEnum.EnableRequest:
      case Arc0013MessageReferenceEnum.GetProvidersRequest:
      case Arc0013MessageReferenceEnum.SignBytesRequest:
      case Arc0013MessageReferenceEnum.SignTxnsRequest:
        this.logger &&
          this.logger.debug(
            `${ExternalMessageBroker.name}#${_functionName}(): request message "${message.data.reference}" received`
          );

        // send the message to the main app (popup) or the background service
        return await browser.runtime.sendMessage(message.data);
      default:
        break;
    }
  }

  public onArc0013ResponseMessage(
    message: BaseArc0013ResponseMessage<IArc0013ResultTypes>
  ): void {
    const _functionName: string = 'onResponseMessage';

    switch (message.reference) {
      case Arc0013MessageReferenceEnum.EnableResponse:
      case Arc0013MessageReferenceEnum.GetProvidersResponse:
      case Arc0013MessageReferenceEnum.SignBytesResponse:
      case Arc0013MessageReferenceEnum.SignTxnsResponse:
        this.logger &&
          this.logger.debug(
            `${ExternalMessageBroker.name}#${_functionName}(): response message "${message.reference}" received`
          );

        // broadcast the response to the webpage
        return this.channel.postMessage(message);
      default:
        break;
    }
  }
}
