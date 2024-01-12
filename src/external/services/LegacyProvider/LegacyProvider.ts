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
  ARC_0027_CHANNEL_NAME,
  ARC_0027_DEFAULT_REQUEST_TIMEOUT,
  ARC_0027_UPPER_REQUEST_TIMEOUT,
} from '@common/constants';
import { LEGACY_WALLET_ID } from '@external/constants';

// enums
import { Arc0027ErrorCodeEnum, Arc0027ProviderMethodEnum } from '@common/enums';

// errors
import {
  BaseSerializableArc0027Error,
  SerializableArc0027FailedToPostSomeTransactionsError,
  SerializableArc0027InvalidGroupIdError,
  SerializableArc0027MethodNotSupportedError,
  SerializableArc0027MethodTimedOutError,
  SerializableArc0027NetworkNotSupportedError,
  SerializableArc0027UnauthorizedSignerError,
  SerializableArc0027UnknownError,
} from '@common/errors';

// messages
import {
  Arc0027EnableRequestMessage,
  Arc0027SignBytesRequestMessage,
  Arc0027SignTxnsRequestMessage,
  BaseArc0027RequestMessage,
  BaseArc0027ResponseMessage,
} from '@common/messages';

// types
import type {
  IArc0027EnableParams,
  IArc0027EnableResult,
  IArc0027SignBytesParams,
  IArc0027SignBytesResult,
  IArc0027SignTxnsParams,
  IArc0027SignTxnsResult,
  IBaseOptions,
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

  private async handleEvent<Params, Result>(
    method: Arc0027ProviderMethodEnum,
    message: BaseArc0027RequestMessage<Params>,
    timeout?: number
  ): Promise<Result> {
    const _functionName: string = 'handleEvent';

    return new Promise<Result>((resolve, reject) => {
      const channel = new BroadcastChannel(ARC_0027_CHANNEL_NAME);
      let timer: number;

      this.logger &&
        this.logger.debug(
          `${LegacyProvider.name}#${_functionName}(): handling event "${message.reference}"`
        );

      channel.onmessage = (
        event: MessageEvent<BaseArc0027ResponseMessage<Result>>
      ) => {
        if (!event.data || event.data.requestId !== message.id) {
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
            new SerializableArc0027UnknownError(
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
          new SerializableArc0027MethodTimedOutError(
            method,
            __PROVIDER_ID__,
            `no response from wallet for "${message.reference}"`
          )
        );
      }, timeout || ARC_0027_DEFAULT_REQUEST_TIMEOUT);

      // send the event
      channel.postMessage(message);
    });
  }

  private static mapArc0027ErrorToLegacyError(
    error: BaseSerializableArc0027Error
  ): BaseError {
    switch (error.code) {
      case Arc0027ErrorCodeEnum.FailedToPostSomeTransactionsError:
        return new FailedToPostSomeTransactionsError(
          (
            error as SerializableArc0027FailedToPostSomeTransactionsError
          ).data.successTxnIDs,
          error.message
        );
      case Arc0027ErrorCodeEnum.InvalidGroupIdError:
        return new InvalidGroupIdError(
          (
            error as SerializableArc0027InvalidGroupIdError
          ).data.computedGroupId,
          error.message
        );
      case Arc0027ErrorCodeEnum.InvalidInputError:
        return new InvalidInputError(error.message);
      case Arc0027ErrorCodeEnum.MethodCanceledError:
      case Arc0027ErrorCodeEnum.MethodTimedOutError:
        return new OperationCanceledError(error.message);
      case Arc0027ErrorCodeEnum.MethodNotSupportedError:
        return new WalletOperationNotSupportedError(
          (error as SerializableArc0027MethodNotSupportedError).data.method,
          error.message
        );
      case Arc0027ErrorCodeEnum.NetworkNotSupportedError:
        return new NetworkNotSupportedError(
          (
            error as SerializableArc0027NetworkNotSupportedError
          ).data.genesisHash,
          error.message
        );
      case Arc0027ErrorCodeEnum.UnauthorizedSignerError:
        return new UnauthorizedSignerError(
          (error as SerializableArc0027UnauthorizedSignerError).data.signer ||
            '',
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
    let result: IArc0027EnableResult;

    try {
      result = await this.handleEvent<
        IArc0027EnableParams,
        IArc0027EnableResult
      >(
        Arc0027ProviderMethodEnum.Enable,
        new Arc0027EnableRequestMessage({
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
      throw LegacyProvider.mapArc0027ErrorToLegacyError(error);
    }
  }

  public async postTxns(options: IPostTxnsOptions): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes({
    data,
    signer,
  }: ISignBytesOptions): Promise<ISignBytesResult> {
    let result: IArc0027SignBytesResult;

    try {
      result = await this.handleEvent<
        IArc0027SignBytesParams,
        IArc0027SignBytesResult
      >(
        Arc0027ProviderMethodEnum.SignTxns,
        new Arc0027SignBytesRequestMessage({
          data: encodeBase64(data),
          providerId: __PROVIDER_ID__,
          signer,
        }),
        ARC_0027_UPPER_REQUEST_TIMEOUT
      );

      return {
        signature: decodeBase64(result.signature),
      };
    } catch (error) {
      throw LegacyProvider.mapArc0027ErrorToLegacyError(error);
    }
  }

  public async signTxns({ txns }: ISignTxnsOptions): Promise<ISignTxnsResult> {
    let result: IArc0027SignTxnsResult;

    try {
      result = await this.handleEvent<
        IArc0027SignTxnsParams,
        IArc0027SignTxnsResult
      >(
        Arc0027ProviderMethodEnum.SignBytes,
        new Arc0027SignTxnsRequestMessage({
          providerId: __PROVIDER_ID__,
          txns,
        }),
        ARC_0027_UPPER_REQUEST_TIMEOUT
      );

      return {
        stxns: result.stxns,
      };
    } catch (error) {
      throw LegacyProvider.mapArc0027ErrorToLegacyError(error);
    }
  }
}
