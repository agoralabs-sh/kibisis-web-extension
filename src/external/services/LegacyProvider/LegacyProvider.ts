import {
  BaseError,
  BaseWalletManager,
  FailedToPostSomeTransactionsError,
  IEnableOptions,
  IEnableResult,
  InvalidGroupIdError,
  InvalidInputError,
  IPostTxnsOptions,
  IPostTxnsResult,
  ISignBytesOptions,
  ISignBytesResult,
  ISignTxnsOptions,
  ISignTxnsResult,
  NetworkNotSupportedError,
  OperationCanceledError,
  UnauthorizedSignerError,
  UnknownError,
  WalletOperationNotSupportedError,
} from '@agoralabs-sh/algorand-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';

// constants
import {
  ARC_0013_CHANNEL_NAME,
  ARC_0013_DEFAULT_REQUEST_TIMEOUT,
  ARC_0013_UPPER_REQUEST_TIMEOUT,
} from '@common/constants';
import { LEGACY_WALLET_ID } from '@external/constants';

// enums
import { Arc0013ErrorCodeEnum, Arc0013ProviderMethodEnum } from '@common/enums';

// errors
import {
  BaseSerializableArc0013Error,
  SerializableArc0013FailedToPostSomeTransactionsError,
  SerializableArc0013InvalidGroupIdError,
  SerializableArc0013MethodNotSupportedError,
  SerializableArc0013MethodTimedOutError,
  SerializableArc0013NetworkNotSupportedError,
  SerializableArc0013UnauthorizedSignerError,
  SerializableArc0013UnknownError,
} from '@common/errors';

// messages
import {
  Arc0013EnableRequestMessage,
  Arc0013SignBytesRequestMessage,
  Arc0013SignTxnsRequestMessage,
  BaseArc0013RequestMessage,
  BaseArc0013ResponseMessage,
} from '@common/messages';

// types
import type {
  IArc0013EnableParams,
  IArc0013EnableResult,
  IArc0013SignBytesParams,
  IArc0013SignBytesResult,
  IArc0013SignTxnsParams,
  IArc0013SignTxnsResult,
  IBaseOptions,
  IBaseRequestPayload,
  ILogger,
} from '@common/types';

export default class LegacyProvider extends BaseWalletManager {
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    super({
      id: LEGACY_WALLET_ID,
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

  private async handleEvent<Params, Result>(
    method: Arc0013ProviderMethodEnum,
    message: BaseArc0013RequestMessage<Params>,
    timeout?: number
  ): Promise<Result> {
    const _functionName: string = 'handleEvent';

    return new Promise<Result>((resolve, reject) => {
      const channel = new BroadcastChannel(ARC_0013_CHANNEL_NAME);
      let timer: number;

      this.logger &&
        this.logger.debug(
          `${LegacyProvider.name}#${_functionName}(): handling event "${message.reference}"`
        );

      channel.onmessage = (
        event: MessageEvent<BaseArc0013ResponseMessage<Result>>
      ) => {
        if (
          event.source !== window ||
          !event.data ||
          event.data.requestId !== message.id
        ) {
          return;
        }

        this.logger &&
          this.logger.debug(
            `${LegacyProvider.name}#${_functionName}(): handling response event "${event.data.reference}"`
          );

        // clear the timer, we can handle it from here
        window.clearTimeout(timer);

        // if there was an error, throw it
        if (event.data.error) {
          reject(event.data.error);

          // close the channel, we are done here
          return channel.close();
        }

        if (!event.data.result) {
          reject(
            new SerializableArc0013UnknownError(
              'no result was returned from the provider and no error was thrown',
              __PROVIDER_ID__
            )
          );

          // close the channel, we are done here
          return channel.close();
        }

        // return the payload
        resolve(event.data.result);

        // close the channel, we are done here
        channel.close();
      };

      // close at the requested timeout, or after 3 minutes
      timer = window.setTimeout(() => {
        // close the channel, we are done here
        channel.close();

        this.logger &&
          this.logger.debug(
            `${LegacyProvider.name}#${_functionName}(): event "${message.reference}" timed out`
          );

        reject(
          new SerializableArc0013MethodTimedOutError(
            method,
            __PROVIDER_ID__,
            `no response from wallet for "${message.reference}"`
          )
        );
      }, timeout || ARC_0013_DEFAULT_REQUEST_TIMEOUT);

      // send the event
      channel.postMessage(message);
    });
  }

  private static mapArc0013ErrorToLegacyError(
    error: BaseSerializableArc0013Error
  ): BaseError {
    switch (error.code) {
      case Arc0013ErrorCodeEnum.FailedToPostSomeTransactionsError:
        return new FailedToPostSomeTransactionsError(
          (
            error as SerializableArc0013FailedToPostSomeTransactionsError
          ).data.successTxnIDs,
          error.message
        );
      case Arc0013ErrorCodeEnum.InvalidGroupIdError:
        return new InvalidGroupIdError(
          (
            error as SerializableArc0013InvalidGroupIdError
          ).data.computedGroupId,
          error.message
        );
      case Arc0013ErrorCodeEnum.InvalidInputError:
        return new InvalidInputError(error.message);
      case Arc0013ErrorCodeEnum.MethodCanceledError:
      case Arc0013ErrorCodeEnum.MethodTimedOutError:
        return new OperationCanceledError(error.message);
      case Arc0013ErrorCodeEnum.MethodNotSupportedError:
        return new WalletOperationNotSupportedError(
          (error as SerializableArc0013MethodNotSupportedError).data.method,
          error.message
        );
      case Arc0013ErrorCodeEnum.NetworkNotSupportedError:
        return new NetworkNotSupportedError(
          (
            error as SerializableArc0013NetworkNotSupportedError
          ).data.genesisHash,
          error.message
        );
      case Arc0013ErrorCodeEnum.UnauthorizedSignerError:
        return new UnauthorizedSignerError(
          (error as SerializableArc0013UnauthorizedSignerError).data.signer,
          error.message
        );
      default:
        return new UnknownError(error.message);
    }
  }

  /**
   * public functions
   */

  public async enable(options?: IEnableOptions): Promise<IEnableResult> {
    let result: IArc0013EnableResult;

    try {
      result = await this.handleEvent<
        IArc0013EnableParams,
        IArc0013EnableResult
      >(
        Arc0013ProviderMethodEnum.Enable,
        new Arc0013EnableRequestMessage({
          providerId: __PROVIDER_ID__,
          genesisHash: options?.genesisHash || null,
        })
      );

      return {
        accounts: result.accounts.map(({ address, name }) => ({
          address,
          name,
        })),
        genesisHash: result.genesisHash,
        genesisId: result.genesisId,
        sessionId: result.sessionId,
      };
    } catch (error) {
      throw LegacyProvider.mapArc0013ErrorToLegacyError(error);
    }
  }

  public async postTxns(options: IPostTxnsOptions): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes({
    data,
    signer,
  }: ISignBytesOptions): Promise<ISignBytesResult> {
    let result: IArc0013SignBytesResult;

    try {
      result = await this.handleEvent<
        IArc0013SignBytesParams,
        IArc0013SignBytesResult
      >(
        Arc0013ProviderMethodEnum.SignTxns,
        new Arc0013SignBytesRequestMessage({
          data: encodeBase64(data),
          providerId: __PROVIDER_ID__,
          signer,
        }),
        ARC_0013_UPPER_REQUEST_TIMEOUT
      );

      return {
        signature: decodeBase64(result.signature),
      };
    } catch (error) {
      throw LegacyProvider.mapArc0013ErrorToLegacyError(error);
    }
  }

  public async signTxns({ txns }: ISignTxnsOptions): Promise<ISignTxnsResult> {
    let result: IArc0013SignTxnsResult;

    try {
      result = await this.handleEvent<
        IArc0013SignTxnsParams,
        IArc0013SignTxnsResult
      >(
        Arc0013ProviderMethodEnum.SignBytes,
        new Arc0013SignTxnsRequestMessage({
          providerId: __PROVIDER_ID__,
          txns,
        }),
        ARC_0013_UPPER_REQUEST_TIMEOUT
      );

      return {
        stxns: result.stxns,
      };
    } catch (error) {
      throw LegacyProvider.mapArc0013ErrorToLegacyError(error);
    }
  }
}
