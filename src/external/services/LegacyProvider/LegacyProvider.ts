import {
  BaseWalletManager,
  IEnableOptions,
  IEnableResult,
  IPostTxnsOptions,
  IPostTxnsResult,
  ISignBytesOptions,
  ISignBytesResult,
  ISignTxnsOptions,
  ISignTxnsResult,
  OperationCanceledError,
  UnknownError,
  WalletOperationNotSupportedError,
} from '@agoralabs-sh/algorand-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';

// constants
import {
  EXTERNAL_MESSAGE_REQUEST_TIMEOUT,
  WALLET_ID,
} from '@external/constants';

// enums
import { MessageTypeEnum } from '@common/enums';

// messages
import {
  BaseMessage,
  EnableRequestMessage,
  SignBytesRequestMessage,
  SignTxnsRequestMessage,
} from '@common/messages';

// types
import type {
  IBaseOptions,
  IBaseSignBytesResponsePayload,
  IBaseRequestPayload,
  ILogger,
  IResponseMessages,
} from '@common/types';

// utils
import mapSerializableErrors from '@common/utils/mapSerializableErrors';

type IResults = IBaseSignBytesResponsePayload | IEnableResult | ISignTxnsResult;

export default class LegacyProvider extends BaseWalletManager {
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    super({
      id: WALLET_ID,
    });

    this.logger = logger || null;
  }

  /**
   * private functions
   */

  /**
   * Convenience function that constructs the base request properties.
   * * appName - uses the content of the "application-name" meta tag, if this doesn't exist, it falls back to the document title.
   * * description - uses the content of the "description" meta tag, if it exists.
   * * host - uses host of the web page.
   * * iconUrl - uses the favicon of the web page.
   * @returns {IBaseRequestPayload} the base extension payload properties.
   * @private
   */
  private createBaseRequestPayload(): IBaseRequestPayload {
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

  private async handleEvent(
    message: BaseMessage,
    responseEvent?: string,
    timeout?: number
  ): Promise<IResults> {
    const _functionName: string = 'handleEvent';

    return new Promise<IResults>((resolve, reject) => {
      const controller: AbortController = new AbortController();
      let eventListener: (event: MessageEvent<IResponseMessages>) => void;
      let timer: number;

      this.logger &&
        this.logger.debug(
          `${LegacyProvider.name}#${_functionName}(): handling event "${message.type}"`
        );

      eventListener = (event: MessageEvent<IResponseMessages>) => {
        if (
          event.source !== window ||
          !event.data ||
          event.data.type !== responseEvent
        ) {
          return;
        }

        this.logger &&
          this.logger.debug(
            `${LegacyProvider.name}#${_functionName}(): handling response event "${event.data.type}"`
          );

        // clear the timer, we can handle it from here
        window.clearTimeout(timer);

        // if there was an error, throw it
        if (event.data.error) {
          reject(mapSerializableErrors(event.data.error));

          // remove the event
          return controller.abort();
        }

        if (!event.data.payload) {
          reject(
            new UnknownError(
              'no result was returned from the wallet and no error was thrown'
            )
          );

          // remove the event
          return controller.abort();
        }

        // return the payload
        resolve(event.data.payload);

        // remove the event
        return controller.abort();
      };

      // create a listener for response messages
      window.addEventListener('message', eventListener, {
        signal: controller.signal,
      });

      // remove the listener at the requested timeout, or after 10 minutes
      timer = window.setTimeout(() => {
        this.logger &&
          this.logger.debug(
            `${LegacyProvider.name}#${_functionName}(): event "${message.type}" timed out`
          );

        window.removeEventListener('message', eventListener);

        reject(
          new OperationCanceledError(
            `no response from wallet for "${message.type}"`
          )
        );
      }, timeout || EXTERNAL_MESSAGE_REQUEST_TIMEOUT);

      // send the event
      window.postMessage(message);
    });
  }

  /**
   * Public functions
   */

  public async enable(options?: IEnableOptions): Promise<IEnableResult> {
    return (await this.handleEvent(
      new EnableRequestMessage({
        ...this.createBaseRequestPayload(),
        genesisHash: options?.genesisHash || null,
      }),
      MessageTypeEnum.EnableResponse
    )) as IEnableResult;
  }

  public async postTxns(options: IPostTxnsOptions): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes(
    options: ISignBytesOptions
  ): Promise<ISignBytesResult> {
    const result: IBaseSignBytesResponsePayload = (await this.handleEvent(
      new SignBytesRequestMessage({
        ...this.createBaseRequestPayload(),
        encodedData: encodeBase64(options.data),
        signer: options.signer || null,
      }),
      MessageTypeEnum.SignBytesResponse
    )) as IBaseSignBytesResponsePayload;

    return {
      signature: decodeBase64(result.encodedSignature),
    };
  }

  public async signTxns(options: ISignTxnsOptions): Promise<ISignTxnsResult> {
    return (await this.handleEvent(
      new SignTxnsRequestMessage({
        ...this.createBaseRequestPayload(),
        ...options,
      }),
      MessageTypeEnum.SignTxnsResponse
    )) as ISignTxnsResult;
  }
}
