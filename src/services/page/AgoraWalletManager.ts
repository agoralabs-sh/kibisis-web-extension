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

// Constants
import { REQUEST_TIMEOUT, WALLET_ID } from '../../constants';

// Enums
import { EventNameEnum } from '../../enums';

// Events
import {
  BaseEvent,
  ExternalEnableRequestEvent,
  ExternalSignBytesRequestEvent,
} from '../../events';

// Types
import type {
  IBaseOptions,
  IBaseSignBytesResponsePayload,
  IExternalResponseEvents,
  ILogger,
} from '../../types';

// Utils
import { mapSerializableErrors } from '../../utils';

type IResults = IEnableResult | IBaseSignBytesResponsePayload;

interface INewOptions extends IBaseOptions {
  extensionId: string;
}

export default class AgoraWalletManager extends BaseWalletManager {
  private readonly extensionId: string;
  private readonly logger: ILogger | null;

  constructor({ extensionId, logger }: INewOptions) {
    super({
      id: WALLET_ID,
    });

    this.extensionId = extensionId;
    this.logger = logger || null;
  }

  /**
   * Private functions
   */

  private async handleEvent(
    message: BaseEvent,
    responseEvent?: string,
    timeout?: number
  ): Promise<IResults> {
    return new Promise<IResults>((resolve, reject) => {
      const controller: AbortController = new AbortController();
      let eventListener: (event: MessageEvent<IExternalResponseEvents>) => void;
      let timer: number;

      this.logger &&
        this.logger.debug(
          `${AgoraWalletManager.name}#handleEvent(): handling event "${message.event}"`
        );

      eventListener = (event: MessageEvent<IExternalResponseEvents>) => {
        if (
          event.source !== window ||
          !event.data ||
          event.data.event !== responseEvent
        ) {
          return;
        }

        this.logger &&
          this.logger.debug(
            `${AgoraWalletManager.name}#handleEvent(): handling response event "${event.data.event}"`
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
            `${AgoraWalletManager.name}#handleEvent(): event "${message.event}" timed out`
          );

        window.removeEventListener('message', eventListener);

        reject(
          new OperationCanceledError(
            `no response from wallet for "${message.event}"`
          )
        );
      }, timeout || REQUEST_TIMEOUT);

      // send the event
      window.postMessage(message);
    });
  }

  /**
   * Public functions
   */

  public async enable(options?: IEnableOptions): Promise<IEnableResult> {
    return (await this.handleEvent(
      new ExternalEnableRequestEvent({
        genesisHash: options?.genesisHash || null,
      }),
      EventNameEnum.ExternalEnableResponse
    )) as IEnableResult;
  }

  public async postTxns(options: IPostTxnsOptions): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes(
    options: ISignBytesOptions
  ): Promise<ISignBytesResult> {
    const decoder: TextDecoder = new TextDecoder();
    const encoder: TextEncoder = new TextEncoder();
    const encodedBase64Data: string = window.btoa(decoder.decode(options.data));
    const result: IBaseSignBytesResponsePayload = (await this.handleEvent(
      new ExternalSignBytesRequestEvent({
        encodedData: encodedBase64Data,
        signer: options.signer || null,
      }),
      EventNameEnum.ExternalSignBytesResponse
    )) as IBaseSignBytesResponsePayload;
    const decodedBase64Signature: string = window.atob(result.encodedSignature);

    return {
      signature: encoder.encode(decodedBase64Signature),
    };
  }

  public async signTxns(options: ISignTxnsOptions): Promise<ISignTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'signTxns');
  }
}
