import {
  ARC0027MethodEnum,
  ARC0027MethodNotSupportedError,
  ARC0027UnknownError,
  IAVMWebProviderListenerOptions as IAVMWebProviderRequestMessage,
  DEFAULT_REQUEST_TIMEOUT,
  TResponseResults,
} from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// messages
import { ClientRequestMessage, ClientResponseMessage } from '@common/messages';

// types
import type { IBaseOptions, ILogger } from '@common/types';

// utils
import createClientInformation from '@external/utils/createClientInformation';

export default class ClientMessageBroker {
  // private variables
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * private functions
   */

  private async sendRequestToExtensionWithTimeout(
    requestMessage: IAVMWebProviderRequestMessage
  ): Promise<TResponseResults> {
    return new Promise<TResponseResults>(async (resolve, reject) => {
      const listener = (
        message: MessageEvent<ClientResponseMessage<TResponseResults>>
      ) => {
        // if the response's request id does not match the intended request, just ignore
        if (!message.data || message.data.requestId !== requestMessage.id) {
          return;
        }

        // clear the timer, we can handle it from here
        window.clearTimeout(timer);

        if (message.data.error) {
          return reject(message.data.error);
        }

        if (!message.data.result) {
          return reject(
            new ARC0027UnknownError({
              message: `failed to get a result from "${message.data.method}" request`,
              providerId: __PROVIDER_ID__,
            })
          );
        }

        resolve(message.data.result);

        // clean up
        browser.runtime.onMessage.removeListener(listener.bind(this));
      };
      let timer: number;

      // listen to responses
      browser.runtime.onMessage.addListener(listener.bind(this));

      // remove listener after a timeout
      timer = window.setTimeout(
        () => browser.runtime.onMessage.removeListener(listener.bind(this)),
        DEFAULT_REQUEST_TIMEOUT
      );

      // send the message to the background script/popups
      await browser.runtime.sendMessage(
        new ClientRequestMessage({
          clientInfo: createClientInformation(),
          id: requestMessage.id,
          method: requestMessage.method,
          params: requestMessage.params,
        })
      );
    });
  }

  /**
   * public functions
   */

  public async onRequestMessage(
    message: IAVMWebProviderRequestMessage
  ): Promise<TResponseResults> {
    const _functionName: string = 'onRequestMessage';

    this.logger?.debug(
      `${ClientMessageBroker.name}#${_functionName} "${message.method}" request received`
    );

    switch (message.method) {
      case ARC0027MethodEnum.Disable:
      case ARC0027MethodEnum.Discover:
      case ARC0027MethodEnum.Enable:
      case ARC0027MethodEnum.SignTransactions:
        return await this.sendRequestToExtensionWithTimeout(message);
      default:
        throw new ARC0027MethodNotSupportedError({
          method: message.method,
          providerId: __PROVIDER_ID__,
        });
    }
  }
}
