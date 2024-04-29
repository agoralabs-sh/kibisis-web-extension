import {
  ARC0027MethodNotSupportedError,
  ARC0027MethodTimedOutError,
  ARC0027UnknownError,
  IAVMWebProviderCallbackOptions,
  DEFAULT_REQUEST_TIMEOUT,
  TResponseResults,
} from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// constants
import { SUPPORTED_METHODS } from '@common/constants';

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
    requestMessage: IAVMWebProviderCallbackOptions
  ): Promise<TResponseResults> {
    return new Promise<TResponseResults>((resolve, reject) => {
      const listener = (message: ClientResponseMessage<TResponseResults>) => {
        // if the response's request id does not match the intended request, just ignore
        if (message.requestId !== requestMessage.id) {
          return;
        }

        // clear the timer, we can handle it from here
        window.clearTimeout(timer);

        if (message.error) {
          return reject(message.error);
        }

        if (!message.result) {
          return reject(
            new ARC0027UnknownError({
              message: `failed to get a result from "${message.method}" request`,
              providerId: __PROVIDER_ID__,
            })
          );
        }

        resolve(message.result);

        // clean up
        browser.runtime.onMessage.removeListener(listener.bind(this));
      };
      let timer: number;

      // listen to responses
      browser.runtime.onMessage.addListener(listener.bind(this));

      // remove listener after a timeout
      timer = window.setTimeout(() => {
        browser.runtime.onMessage.removeListener(listener.bind(this));

        return reject(
          new ARC0027MethodTimedOutError({
            method: requestMessage.method,
            providerId: __PROVIDER_ID__,
          })
        );
      }, DEFAULT_REQUEST_TIMEOUT);

      // send the message to the background script/popups
      browser.runtime.sendMessage(
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
    message: IAVMWebProviderCallbackOptions
  ): Promise<TResponseResults> {
    const _functionName: string = 'onRequestMessage';

    this.logger?.debug(
      `${ClientMessageBroker.name}#${_functionName} "${message.method}" request received`
    );

    if (!SUPPORTED_METHODS.includes(message.method)) {
      throw new ARC0027MethodNotSupportedError({
        method: message.method,
        providerId: __PROVIDER_ID__,
      });
    }

    return await this.sendRequestToExtensionWithTimeout(message);
  }
}
