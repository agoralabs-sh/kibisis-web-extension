import browser, { Runtime } from 'webextension-polyfill';

// Enums
import { ConnectionNameEnum, EventNameEnum } from '../../enums';

// Events
import {
  BridgeEnableRequestEvent,
  InternalEnableRequestEvent,
} from '../../events';

// Types
import { IBaseOptions, IBridgeEvents, ILogger } from '../../types';

export default class BridgeEventService {
  // private variables
  private connection: Runtime.Port;
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * Private functions
   */

  private async onEnableRequest(
    event: BridgeEnableRequestEvent
  ): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${BridgeEventService.name}#onEnableRequest(): "${event.event}" event received in the background`
      );

    // send the message to the app
    await browser.runtime.sendMessage(
      new InternalEnableRequestEvent(event.payload)
    );
  }

  private async onMessage(message: IBridgeEvents): Promise<void> {
    switch (message.event) {
      case EventNameEnum.BridgeEnableRequest:
        return await this.onEnableRequest(message as BridgeEnableRequestEvent);
      default:
        break;
    }
  }

  /**
   * Public functions
   */

  public onConnected(connection: Runtime.Port): void {
    if (connection.name === ConnectionNameEnum.BridgeConnection) {
      this.logger &&
        this.logger.debug(
          `${BridgeEventService.name}#onConnected(): "${connection.name}" connected to background bridge`
        );

      this.connection = connection;

      // register events
      this.connection.onMessage.addListener(this.onMessage.bind(this));
    }
  }
}
