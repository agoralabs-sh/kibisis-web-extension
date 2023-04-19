import browser from 'webextension-polyfill';

// Enums
import { EventNameEnum } from '@common/enums';

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

// Types
import {
  IBaseOptions,
  IExtensionEvents,
  IExternalRequestEvents,
  ILogger,
} from '@common/types';

export default class ExternalEventService {
  // private variables
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * Private functions
   */

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

  private handleExtensionEnableResponse(
    message: ExtensionEnableResponseEvent
  ): void {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExtensionEnableResponse(): extension message "${message.event}" received`
      );

    // send the response to the web page
    return window.postMessage(
      new ExternalEnableResponseEvent(message.payload, message.error)
    );
  }

  private handleExtensionSignBytesResponse(
    message: ExtensionSignBytesResponseEvent
  ): void {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExtensionSignBytesResponse(): extension message "${message.event}" received`
      );

    // send the response to the web page
    return window.postMessage(
      new ExternalSignBytesResponseEvent(message.payload, message.error)
    );
  }

  private handleExtensionSignTxnsResponse(
    message: ExtensionSignTxnsResponseEvent
  ): void {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExtensionSignTxnsResponse(): extension message "${message.event}" received`
      );

    // send the response to the web page
    return window.postMessage(
      new ExternalSignTxnsResponseEvent(message.payload, message.error)
    );
  }

  private async handleExternalEnableRequest(
    message: ExternalEnableRequestEvent
  ): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExternalEnableRequest(): external message "${message.event}" received`
      );

    // send the message to the extension (popup)
    return await browser.runtime.sendMessage(
      new ExtensionEnableRequestEvent({
        ...message.payload,
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
      })
    );
  }

  private async handleExternalSignBytesRequest(
    message: ExternalSignBytesRequestEvent
  ): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExternalSignBytesRequest(): external message "${message.event}" received`
      );

    // send the message to the extension (popup)
    return await browser.runtime.sendMessage(
      new ExtensionSignBytesRequestEvent({
        ...message.payload,
        appName:
          document
            .querySelector('meta[name="application-name"]')
            ?.getAttribute('content') || document.title,
        host: `${window.location.protocol}//${window.location.host}`,
        iconUrl: this.extractFaviconUrl(),
      })
    );
  }

  private async handleExternalSignTxnsRequest(
    message: ExternalSignTxnsRequestEvent
  ): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#handleExternalSignTxnsRequest(): external message "${message.event}" received`
      );

    // send the message to the extension (popup)
    return await browser.runtime.sendMessage(
      new ExtensionSignTxnsRequestEvent({
        ...message.payload,
        host: `${window.location.protocol}//${window.location.host}`,
      })
    );
  }

  /**
   * Public functions
   */

  public onExtensionMessage(message: IExtensionEvents): void {
    switch (message.event) {
      case EventNameEnum.ExtensionEnableResponse:
        return this.handleExtensionEnableResponse(
          message as ExtensionEnableResponseEvent
        );
      case EventNameEnum.ExtensionSignBytesResponse:
        return this.handleExtensionSignBytesResponse(
          message as ExtensionSignBytesResponseEvent
        );
      case EventNameEnum.ExtensionSignTxnsResponse:
        return this.handleExtensionSignTxnsResponse(
          message as ExtensionSignTxnsResponseEvent
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
