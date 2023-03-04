// Constants
import { DEFAULT_PANEL_HEIGHT, DEFAULT_PANEL_WIDTH } from '../constants';

// Services
import PrivateKeyService from './PrivateKeyService';

// Types
import { IBaseOptions, ILogger } from '../types';

export default class BackgroundService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private onBoardingWindow: browser.windows.Window | null;

  // public variables
  public readonly name: string = 'BackgroundService';

  constructor(options: IBaseOptions) {
    this.logger = options?.logger || null;
    this.onBoardingWindow = null;
    this.privateKeyService = new PrivateKeyService(options);
  }

  /**
   * Public functions
   */

  public async onExtensionClick(): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();

    if (!isInitialized && !this.onBoardingWindow) {
      this.logger &&
        this.logger.debug(
          `${this.name}#onExtensionClick(): on-boarding new user`
        );

      this.onBoardingWindow = await browser.windows.create({
        height: DEFAULT_PANEL_HEIGHT,
        type: 'popup',
        url: 'onboard.html',
        width: DEFAULT_PANEL_WIDTH,
      });
    }
  }
}
