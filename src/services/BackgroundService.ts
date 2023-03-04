// Constants
import { DEFAULT_POPUP_HEIGHT, DEFAULT_POPUP_WIDTH } from '../constants';

// Services
import PrivateKeyService from './PrivateKeyService';

// Types
import { IBaseOptions, ILogger } from '../types';

export default class BackgroundService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private onRegisterWindow: browser.windows.Window | null;

  // public variables
  public readonly name: string = 'BackgroundService';

  constructor(options: IBaseOptions) {
    this.logger = options?.logger || null;
    this.onRegisterWindow = null;
    this.privateKeyService = new PrivateKeyService(options);
  }

  /**
   * Public functions
   */

  public async onExtensionClick(): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();

    if (!isInitialized && !this.onRegisterWindow) {
      this.logger &&
        this.logger.debug(
          `${this.name}#onExtensionClick(): on-boarding new user`
        );

      this.onRegisterWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'register.html',
        width: DEFAULT_POPUP_WIDTH,
      });
    }
  }

  public onWindowRemove(windowId: number): void {
    if (this.onRegisterWindow && this.onRegisterWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${this.name}#onWindowRemove(): removed register window`
        );

      this.onRegisterWindow = null;
    }
  }
}
