// actions
import { Action } from './actions';

// enums
import { ActionNameEnum } from './enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { INetwork } from '@extension/types';
import type {
  IImportAccountViaQRCodeActionData,
  ISendARC0200AssetActionData,
  ISendNativeCurrencyActionData,
  ISendStandardAssetActionData,
  ITrackOptions,
} from './types';

export default class ActionTrackingService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly settingsService: SettingsService;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.settingsService = new SettingsService({
      logger,
    });
  }

  /**
   * private functions
   */

  /**
   * Convenience function that checks if the action tracking has been enabled in the settings.
   * @returns {Promise<boolean>} a promise that resolves to true if action tacking is enabled, false otherwise.
   * @private
   */
  private async isTrackingAllowed(): Promise<boolean> {
    const { privacy } = await this.settingsService.getAll();

    return privacy.allowActionTracking;
  }

  private async track({ data, name, network }: ITrackOptions): Promise<void> {
    const __functionName: string = 'track';

    // check if it there is a config
    if (!network.umami) {
      this.logger?.debug(
        `${ActionTrackingService.name}#${__functionName}: action tracking not initialized for "${network.canonicalName}", ignoring`
      );

      return;
    }

    // check whether tracking is allowed
    if (!(await this.isTrackingAllowed())) {
      this.logger?.debug(
        `${ActionTrackingService.name}#${__functionName}: tracking not enabled, ignoring`
      );

      return;
    }

    try {
      await fetch(`${network.umami.url}/api/send`, {
        body: JSON.stringify({
          payload: new Action({
            data,
            hostname: network.umami.domain,
            language: window.navigator.language,
            name,
            website: network.umami.websiteID,
          }),
          type: 'event',
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.logger?.debug(
        `${ActionTrackingService.name}#${__functionName}: successfully sent action "${name}"`
      );
    } catch (error) {
      this.logger?.error(
        `${ActionTrackingService.name}#${__functionName}:`,
        error
      );
    }
  }

  /**
   * public functions
   */

  public async importAccountViaQRCodeAction(
    network: INetwork,
    data: IImportAccountViaQRCodeActionData
  ): Promise<void> {
    return await this.track({
      data,
      name: ActionNameEnum.ImportAccountViaQRCodeAction,
      network,
    });
  }
  public async sendARC0200AssetAction(
    network: INetwork,
    data: ISendARC0200AssetActionData
  ): Promise<void> {
    return await this.track({
      data,
      name: ActionNameEnum.SendARC0200AssetAction,
      network,
    });
  }

  public async sendNativeCurrencyAction(
    network: INetwork,
    data: ISendNativeCurrencyActionData
  ): Promise<void> {
    return await this.track({
      data,
      name: ActionNameEnum.SendNativeCurrencyAction,
      network,
    });
  }

  public async sendStandardAssetAction(
    network: INetwork,
    data: ISendStandardAssetActionData
  ): Promise<void> {
    return await this.track({
      data,
      name: ActionNameEnum.SendStandardAssetAction,
      network,
    });
  }
}
