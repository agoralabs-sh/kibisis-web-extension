import BigNumber from 'bignumber.js';
import { PostHog } from 'posthog-node';

// enums
import { ActionNameEnum } from './enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type {
  IAcquireARC0072ActionData,
  IAddARC0200AssetActionData,
  IAddStandardAssetActionData,
  ISendARC0200AssetActionData,
  ISendNativeCurrencyActionData,
  ISendStandardAssetActionData,
  ITrackOptions,
} from './types';

export default class ActionTrackingService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly posthog: PostHog | null;
  private readonly settingsService: SettingsService;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.posthog =
      __POSTHOG_API_HOST__ && __POSTHOG_PROJECT_ID__
        ? new PostHog(__POSTHOG_PROJECT_ID__, {
            host: __POSTHOG_API_HOST__,
          })
        : null;
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

  private async track({
    account,
    data,
    name,
  }: ITrackOptions): Promise<boolean> {
    const __functionName: string = 'track';

    if (!this.posthog) {
      this.logger?.debug(
        `${ActionTrackingService.name}#${__functionName}: tracking not initialized, ignoring`
      );

      return false;
    }

    // check whether tracking is allowed
    if (!(await this.isTrackingAllowed())) {
      this.logger?.debug(
        `${ActionTrackingService.name}#${__functionName}: tracking not enabled, ignoring`
      );

      return false;
    }

    try {
      this.posthog.capture({
        disableGeoip: true,
        distinctId: account,
        event: name,
        ...(data && {
          properties: data,
        }),
      });

      this.logger?.debug(
        `${ActionTrackingService.name}#${__functionName}: successfully sent action "${name}"`
      );

      return true;
    } catch (error) {
      this.logger?.error(
        `${ActionTrackingService.name}#${__functionName}:`,
        error
      );

      return false;
    }
  }

  /**
   * public functions
   */

  /**
   * Tracks an acquire ARC-0072 action.
   * @param {string} fromAddress - the address of the account that added the asset.
   * @param {IAcquireARC0072ActionData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async acquireARC0072Action(
    fromAddress: string,
    data: IAcquireARC0072ActionData
  ): Promise<boolean> {
    return await this.track({
      account: fromAddress,
      data,
      name: ActionNameEnum.AcquireARC0072Action,
    });
  }

  /**
   * Tracks an add ARC-0200 asset action.
   * @param {string} fromAddress - the address of the account that added the asset.
   * @param {IAddARC0200AssetActionData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async addARC0200AssetAction(
    fromAddress: string,
    data: IAddARC0200AssetActionData
  ): Promise<boolean> {
    return await this.track({
      account: fromAddress,
      data,
      name: ActionNameEnum.AddARC0200AssetAction,
    });
  }

  /**
   * Tracks an add standard asset action.
   * @param {string} fromAddress - the address of the account that added the asset.
   * @param {IAddStandardAssetActionData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async addStandardAssetAction(
    fromAddress: string,
    data: IAddStandardAssetActionData
  ): Promise<boolean> {
    return await this.track({
      account: fromAddress,
      data,
      name: ActionNameEnum.AddStandardAssetAction,
    });
  }

  /**
   * Tracks an import account via QR code action.
   * @param {string} account - the address of the account that was imported.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async importAccountViaQRCodeAction(account: string): Promise<boolean> {
    return await this.track({
      account,
      data: {
        $set_once: {
          featOfStrengthImportWalletViaQRCode: true,
        },
      },
      name: ActionNameEnum.ImportAccountViaQRCodeAction,
    });
  }

  /**
   * Tracks a send ARC-0200 asset action. This action is only tracked when >=1 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the asset was sent from.
   * @param {string} toAddress - the address of the account the asset was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetActionData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async sendARC0200AssetAction(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendARC0200AssetActionData
  ): Promise<boolean> {
    if (
      fromAddress === toAddress ||
      new BigNumber(amountInStandardUnits).lt(new BigNumber('1'))
    ) {
      return false;
    }

    return await this.track({
      account: fromAddress,
      data,
      name: ActionNameEnum.SendARC0200AssetAction,
    });
  }

  /**
   * Tracks a send native currency action. This action is only tracked when >=0.1 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the amount was sent from.
   * @param {string} toAddress - the address of the account the amount was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetActionData} data - the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async sendNativeCurrencyAction(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendNativeCurrencyActionData
  ): Promise<boolean> {
    if (
      fromAddress === toAddress ||
      new BigNumber(amountInStandardUnits).lt(new BigNumber('0.1'))
    ) {
      return false;
    }

    return await this.track({
      account: fromAddress,
      data,
      name: ActionNameEnum.SendNativeCurrencyAction,
    });
  }

  /**
   * Tracks a send standard asset action. This action is only tracked when >=1 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the asset was sent from.
   * @param {string} toAddress - the address of the account the asset was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetActionData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async sendStandardAssetAction(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendStandardAssetActionData
  ): Promise<boolean> {
    if (
      fromAddress === toAddress ||
      new BigNumber(amountInStandardUnits).lt(new BigNumber('1'))
    ) {
      return false;
    }

    return await this.track({
      account: fromAddress,
      data,
      name: ActionNameEnum.SendStandardAssetAction,
    });
  }

  /**
   * Tracks a sign message action.
   * @param {string} account - the address of the account that was as a signer.
   * @returns {Promise<boolean>} a promise that resolves to whether the action was tracked or not.
   */
  public async signMessageAction(account: string): Promise<boolean> {
    return await this.track({
      account,
      data: {
        $set_once: {
          featOfStrengthSignMessage: true,
        },
      },
      name: ActionNameEnum.SignAMessageAction,
    });
  }
}
