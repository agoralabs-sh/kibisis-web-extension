import {
  ARC0027MethodEnum,
  ARC0027MethodNotSupportedError,
  ARC0027UnknownError,
  IAVMWebProviderListenerOptions as IAVMWebProviderRequestMessage,
  DEFAULT_REQUEST_TIMEOUT,
  TResponseResults,
} from '@agoralabs-sh/avm-web-provider';
import browser from 'webextension-polyfill';

// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

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
  IClientInformation,
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
   * private functions
   */

  /**
   * Convenience function create the client information content for the webpage.
   * * appName - uses the content of the "application-name" meta tag, if this doesn't exist, it falls back to the document title.
   * * description - uses the content of the "description" meta tag, if it exists.
   * * host - uses host of the web page.
   * * iconUrl - uses the favicon of the web page.
   * @returns {IClientInformation} the client information.
   * @private
   */
  private createClientInformation(): IClientInformation {
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
          clientInfo: this.createClientInformation(),
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
      `${ExternalMessageBroker.name}#${_functionName} "${message.method}" request received`
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

  /**
   * deprecated - will be phased out in favour of the avm-web-provider
   */

  public async onARC0027RequestMessage(
    message: MessageEvent<BaseARC0027RequestMessage<IARC0027ParamTypes>>
  ): Promise<void> {
    const _functionName: string = 'onARC0027RequestMessage';

    switch (message.data.reference) {
      case ARC0027MessageReferenceEnum.DisableRequest:
      case ARC0027MessageReferenceEnum.EnableRequest:
      case ARC0027MessageReferenceEnum.GetProvidersRequest:
      case ARC0027MessageReferenceEnum.SignBytesRequest:
      case ARC0027MessageReferenceEnum.SignTxnsRequest:
        this.logger?.debug(
          `${ExternalMessageBroker.name}#${_functionName} request message "${message.data.reference}" received`
        );

        // send the message to the main app (popup) or the background service
        return await browser.runtime.sendMessage({
          clientInfo: this.createClientInformation(),
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
      case ARC0027MessageReferenceEnum.DisableResponse:
      case ARC0027MessageReferenceEnum.EnableResponse:
      case ARC0027MessageReferenceEnum.GetProvidersResponse:
      case ARC0027MessageReferenceEnum.SignBytesResponse:
      case ARC0027MessageReferenceEnum.SignTxnsResponse:
        this.logger?.debug(
          `${ExternalMessageBroker.name}#${_functionName} response message "${message.reference}" received`
        );

        // broadcast the response to the webpage
        return this.channel.postMessage(message);
      default:
        break;
    }
  }
}
