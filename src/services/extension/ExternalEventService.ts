import browser, { Runtime } from 'webextension-polyfill';

// Enums
import { ConnectionNameEnum, EventNameEnum } from '../../enums';

// Events
import {
  BridgeEnableRequestEvent,
  ExternalEnableRequestEvent,
} from '../../events';

// Types
import { IBaseOptions, IExternalRequestEvents, ILogger } from '../../types';

export default class ExternalEventService {
  // private variables
  private readonly connection: Runtime.Port;
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.connection = browser.runtime.connect({
      name: ConnectionNameEnum.BridgeConnection,
    }); // connect to the background script

    // listen to background messages
    // this.connection.onMessage.addListener(this.onBridgeMessage);
  }

  /**
   * Private functions
   */

  private onEnableRequest(event: ExternalEnableRequestEvent): void {
    // window.postMessage(
    //   new EnableResponseEvent({
    //     accounts: [],
    //     genesisId: 'testnet-v1.0',
    //     genesisHash: payload?.genesisHash || 'unknwn',
    //   })
    // );
    this.logger &&
      this.logger.debug(
        `${ExternalEventService.name}#onEnableRequest(): "${event.event}" event received in the content script`
      );

    // post the message to the background bridge
    this.connection.postMessage(
      new BridgeEnableRequestEvent({
        ...event.payload,
        host: window.location.host,
        iconUrl: null, // TODO: get favicon
      })
    );
  }

  // private onBridgeMessage(message: string): void {
  //
  // }

  /**
   * Public functions
   */

  public async onExternalMessage(
    event: MessageEvent<IExternalRequestEvents>
  ): Promise<void> {
    if (event.source !== window || !event.data) {
      return;
    }

    switch (event.data.event) {
      case EventNameEnum.ExternalEnableRequest:
        return this.onEnableRequest(event.data);
      default:
        break;
    }
  }
}
