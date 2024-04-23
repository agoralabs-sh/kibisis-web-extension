import {
  BaseError,
  BaseWalletManager,
  FailedToPostSomeTransactionsError,
  IEnableOptions,
  IEnableResult,
  InvalidGroupIdError,
  InvalidInputError,
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
  ARC0027ErrorCodeEnum,
  DEFAULT_REQUEST_TIMEOUT,
  UPPER_REQUEST_TIMEOUT,
} from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';

// constants
import { LEGACY_WALLET_ID } from '@external/constants';

// enums
import { ARC0027ProviderMethodEnum } from '@common/enums';

// errors
import {
  BaseSerializableARC0027Error,
  SerializableARC0027FailedToPostSomeTransactionsError,
  SerializableARC0027MethodNotSupportedError,
  SerializableARC0027MethodTimedOutError,
  SerializableARC0027NetworkNotSupportedError,
  SerializableARC0027UnauthorizedSignerError,
  SerializableARC0027UnknownError,
} from '@common/errors';

// messages
import {
  ARC0027EnableRequestMessage,
  ARC0027SignBytesRequestMessage,
  ARC0027SignTxnsRequestMessage,
  BaseARC0027RequestMessage,
  BaseARC0027ResponseMessage,
} from '@common/messages';

// types
import type {
  IARC0027EnableParams,
  IARC0027EnableResult,
  IARC0027SignBytesParams,
  IARC0027SignBytesResult,
  IARC0027SignTxnsParams,
  IARC0027SignTxnsResult,
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
    method: ARC0027ProviderMethodEnum,
    message: BaseARC0027RequestMessage<Params>,
    timeout?: number
  ): Promise<Result> {
    const _functionName: string = 'handleEvent';

    return new Promise<Result>((resolve, reject) => {
      const channel = new BroadcastChannel(`arc0027:channel:name`);
      let timer: number;

      this.logger &&
        this.logger.debug(
          `${LegacyProvider.name}#${_functionName}: handling event "${message.reference}"`
        );

      channel.onmessage = (
        event: MessageEvent<BaseARC0027ResponseMessage<Result>>
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
            new SerializableARC0027UnknownError(
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
          new SerializableARC0027MethodTimedOutError(
            method,
            __PROVIDER_ID__,
            `no response from wallet for "${message.reference}"`
          )
        );
      }, timeout || DEFAULT_REQUEST_TIMEOUT);

      // send the event
      channel.postMessage(message);
    });
  }

  private static mapARC0027ErrorToLegacyError(
    error: BaseSerializableARC0027Error
  ): BaseError {
    switch (error.code) {
      case ARC0027ErrorCodeEnum.FailedToPostSomeTransactionsError:
        return new FailedToPostSomeTransactionsError(
          (
            error as SerializableARC0027FailedToPostSomeTransactionsError
          ).data.successTxnIDs,
          error.message
        );
      case ARC0027ErrorCodeEnum.InvalidGroupIdError:
        return new InvalidGroupIdError('', error.message);
      case ARC0027ErrorCodeEnum.InvalidInputError:
        return new InvalidInputError(error.message);
      case ARC0027ErrorCodeEnum.MethodCanceledError:
      case ARC0027ErrorCodeEnum.MethodTimedOutError:
        return new OperationCanceledError(error.message);
      case ARC0027ErrorCodeEnum.MethodNotSupportedError:
        return new WalletOperationNotSupportedError(
          (error as SerializableARC0027MethodNotSupportedError).data.method,
          error.message
        );
      case ARC0027ErrorCodeEnum.NetworkNotSupportedError:
        return new NetworkNotSupportedError(
          (
            error as SerializableARC0027NetworkNotSupportedError
          ).data.genesisHashes[0],
          error.message
        );
      case ARC0027ErrorCodeEnum.UnauthorizedSignerError:
        return new UnauthorizedSignerError(
          (error as SerializableARC0027UnauthorizedSignerError).data.signer ||
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
    let result: IARC0027EnableResult;

    try {
      result = await this.handleEvent<
        IARC0027EnableParams,
        IARC0027EnableResult
      >(
        ARC0027ProviderMethodEnum.Enable,
        new ARC0027EnableRequestMessage({
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
      throw LegacyProvider.mapARC0027ErrorToLegacyError(error);
    }
  }

  public async postTxns(): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes({
    data,
    signer,
  }: ISignBytesOptions): Promise<ISignBytesResult> {
    let result: IARC0027SignBytesResult;

    try {
      result = await this.handleEvent<
        IARC0027SignBytesParams,
        IARC0027SignBytesResult
      >(
        ARC0027ProviderMethodEnum.SignBytes,
        new ARC0027SignBytesRequestMessage({
          data: encodeBase64(data),
          providerId: __PROVIDER_ID__,
          signer,
        }),
        UPPER_REQUEST_TIMEOUT
      );

      return {
        signature: decodeBase64(result.signature),
      };
    } catch (error) {
      throw LegacyProvider.mapARC0027ErrorToLegacyError(error);
    }
  }

  public async signTxns({ txns }: ISignTxnsOptions): Promise<ISignTxnsResult> {
    let result: IARC0027SignTxnsResult;

    try {
      result = await this.handleEvent<
        IARC0027SignTxnsParams,
        IARC0027SignTxnsResult
      >(
        ARC0027ProviderMethodEnum.SignTxns,
        new ARC0027SignTxnsRequestMessage({
          providerId: __PROVIDER_ID__,
          txns,
        }),
        UPPER_REQUEST_TIMEOUT
      );

      return {
        stxns: result.stxns,
      };
    } catch (error) {
      throw LegacyProvider.mapARC0027ErrorToLegacyError(error);
    }
  }
}
