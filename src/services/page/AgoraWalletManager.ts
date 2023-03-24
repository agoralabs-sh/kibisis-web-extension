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
  WalletOperationNotSupportedError,
} from '@agoralabs-sh/algorand-provider';

// Constants
import { REQUEST_TIMEOUT, WALLET_ID } from '../../constants';

// Enums
import { EventNameEnum } from '../../enums';

// Events
import { BaseEvent, ExternalEnableRequestEvent } from '../../events';

// Types
import type {
  IBaseOptions,
  IExternalResponseEvents,
  ILogger,
} from '../../types';

// Utils
import { mapSerializableErrors } from '../../utils';

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

  private async handleEvent<ResponsePayload>(
    message: BaseEvent,
    responseEvent?: string,
    timeout?: number
  ): Promise<ResponsePayload> {
    return new Promise<ResponsePayload>((resolve, reject) => {
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
    return await this.handleEvent<IEnableResult>(
      new ExternalEnableRequestEvent({
        genesisHash: options?.genesisHash || null,
      }),
      EventNameEnum.ExternalEnableResponse
    );
  }

  public async postTxns(options: IPostTxnsOptions): Promise<IPostTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'postTxns');
  }

  public async signBytes(
    options: ISignBytesOptions
  ): Promise<ISignBytesResult> {
    throw new WalletOperationNotSupportedError(this.id, 'signBytes');
  }

  public async signTxns(options: ISignTxnsOptions): Promise<ISignTxnsResult> {
    throw new WalletOperationNotSupportedError(this.id, 'signTxns');
  }
}
