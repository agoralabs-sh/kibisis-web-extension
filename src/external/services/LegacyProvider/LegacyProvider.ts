import {
  BaseError,
  BaseWalletManager,
  FailedToPostSomeTransactionsError,
  IEnableOptions,
  IEnableResult,
  InvalidGroupIdError,
  InvalidInputError,
  IPostTxnsResult,
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
  ARC0027FailedToPostSomeTransactionsError,
  ARC0027MethodNotSupportedError,
  ARC0027NetworkNotSupportedError,
  ARC0027UnauthorizedSignerError,
  AVMWebClient,
  BaseARC0027Error,
  UPPER_REQUEST_TIMEOUT,
} from '@agoralabs-sh/avm-web-provider';

// constants
import { LEGACY_WALLET_ID } from '@external/constants';

export default class LegacyProvider extends BaseWalletManager {
  private readonly avmWebClient: AVMWebClient;

  constructor() {
    super({
      id: LEGACY_WALLET_ID,
    });

    this.avmWebClient = AVMWebClient.init();
  }

  /**
   * public static functions
   */

  private static mapARC0027ErrorToLegacyError(
    error: BaseARC0027Error
  ): BaseError {
    switch (error.code) {
      case ARC0027ErrorCodeEnum.FailedToPostSomeTransactionsError:
        return new FailedToPostSomeTransactionsError(
          (
            error as ARC0027FailedToPostSomeTransactionsError
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
          (error as ARC0027MethodNotSupportedError).data.method,
          error.message
        );
      case ARC0027ErrorCodeEnum.NetworkNotSupportedError:
        return new NetworkNotSupportedError(
          (error as ARC0027NetworkNotSupportedError).data.genesisHashes[0],
          error.message
        );
      case ARC0027ErrorCodeEnum.UnauthorizedSignerError:
        return new UnauthorizedSignerError(
          (error as ARC0027UnauthorizedSignerError).data.signer || '',
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
    return new Promise<IEnableResult>((resolve, reject) => {
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        // remove the listener, it is not needed
        if (listenerId) {
          this.avmWebClient.removeListener(listenerId);
        }

        return reject(
          new OperationCanceledError(`operation "enable" timed out`)
        );
      }, UPPER_REQUEST_TIMEOUT);
      listenerId = this.avmWebClient.onEnable(({ error, result }) => {
        // remove the listener, it is not needed
        this.avmWebClient.removeListener(listenerId);

        if (error) {
          window.clearTimeout(timeoutId);

          return reject(LegacyProvider.mapARC0027ErrorToLegacyError(error));
        }

        if (result) {
          window.clearTimeout(timeoutId);

          return resolve({
            accounts: result.accounts.map(({ address, name }) => ({
              address,
              name,
            })),
            genesisHash: result.genesisHash,
            genesisId: result.genesisId,
            sessionId: result.sessionId,
          });
        }
      });

      this.avmWebClient.enable({
        genesisHash: options?.genesisHash,
        providerId: __PROVIDER_ID__,
      });
    });
  }

  public async postTxns(): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes(): Promise<ISignBytesResult> {
    throw new WalletOperationNotSupportedError(this.id, 'signBytes');
  }

  public async signTxns({ txns }: ISignTxnsOptions): Promise<ISignTxnsResult> {
    return new Promise<ISignTxnsResult>((resolve, reject) => {
      let listenerId: string;
      let timeoutId = window.setTimeout(() => {
        // remove the listener, it is not needed
        if (listenerId) {
          this.avmWebClient.removeListener(listenerId);
        }

        return reject(
          new OperationCanceledError(`operation "signTxns" timed out`)
        );
      }, UPPER_REQUEST_TIMEOUT);
      listenerId = this.avmWebClient.onSignTransactions(({ error, result }) => {
        // remove the listener, it is not needed
        this.avmWebClient.removeListener(listenerId);

        if (error) {
          window.clearTimeout(timeoutId);

          return reject(LegacyProvider.mapARC0027ErrorToLegacyError(error));
        }

        if (result) {
          window.clearTimeout(timeoutId);

          return resolve({
            stxns: result.stxns,
          });
        }
      });

      this.avmWebClient.signTransactions({
        providerId: __PROVIDER_ID__,
        txns,
      });
    });
  }
}
