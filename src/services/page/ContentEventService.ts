import { IEnableOptions, IEnableResult } from '@agoralabs-sh/algorand-provider';
import browser, { Windows } from 'webextension-polyfill';

// Events
import { EnableResponseEvent } from '../../events';

// Types
import { IBaseOptions, ILogger } from '../../types';

export default class ContentEventService {
  // private variables
  private readonly logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * Public functions
   */
  public async onEnableRequest(payload: IEnableOptions | null): Promise<void> {
    window.postMessage(
      new EnableResponseEvent({
        accounts: [],
        genesisId: 'testnet-v1.0',
        genesisHash: payload?.genesisHash || 'unknwn',
      })
    );
  }
}
