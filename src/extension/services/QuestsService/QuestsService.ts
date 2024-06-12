import BigNumber from 'bignumber.js';
import { PostHog } from 'posthog-node';

// enums
import { QuestNameEnum } from './enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type {
  IAcquireARC0072QuestData,
  IAddARC0200AssetQuestData,
  IAddStandardAssetQuestData,
  ISendARC0200AssetQuestData,
  ISendNativeCurrencyQuestData,
  ISendStandardAssetQuestData,
  ITrackOptions,
} from './types';

export default class QuestsService {
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
        `${QuestsService.name}#${__functionName}: tracking not initialized, ignoring`
      );

      return false;
    }

    // check whether tracking is allowed
    if (!(await this.isTrackingAllowed())) {
      this.logger?.debug(
        `${QuestsService.name}#${__functionName}: tracking not enabled, ignoring`
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
        `${QuestsService.name}#${__functionName}: successfully sent action "${name}"`
      );

      return true;
    } catch (error) {
      this.logger?.error(`${QuestsService.name}#${__functionName}:`, error);

      return false;
    }
  }

  /**
   * public functions
   */

  /**
   * Tracks an acquire ARC-0072 quest.
   * @param {string} fromAddress - the address of the account that added the asset.
   * @param {IAcquireARC0072QuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async acquireARC0072Quest(
    fromAddress: string,
    data: IAcquireARC0072QuestData
  ): Promise<boolean> {
    return await this.track({
      account: fromAddress,
      data,
      name: QuestNameEnum.AcquireARC0072Action,
    });
  }

  /**
   * Tracks an add ARC-0200 asset quest.
   * @param {string} fromAddress - the address of the account that added the asset.
   * @param {IAddARC0200AssetQuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async addARC0200AssetQuest(
    fromAddress: string,
    data: IAddARC0200AssetQuestData
  ): Promise<boolean> {
    return await this.track({
      account: fromAddress,
      data,
      name: QuestNameEnum.AddARC0200AssetAction,
    });
  }

  /**
   * Tracks an add standard asset quest.
   * @param {string} fromAddress - the address of the account that added the asset.
   * @param {IAddStandardAssetQuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async addStandardAssetQuest(
    fromAddress: string,
    data: IAddStandardAssetQuestData
  ): Promise<boolean> {
    return await this.track({
      account: fromAddress,
      data,
      name: QuestNameEnum.AddStandardAssetAction,
    });
  }

  /**
   * Tracks an import account via QR code quest.
   * @param {string} account - the address of the account that was imported.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async importAccountViaQRCodeQuest(account: string): Promise<boolean> {
    return await this.track({
      account,
      data: {
        $set_once: {
          featOfStrengthImportWalletViaQRCode: true,
        },
      },
      name: QuestNameEnum.ImportAccountViaQRCodeAction,
    });
  }

  /**
   * Tracks a send ARC-0200 asset quest. This quest is only tracked when >=1 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the asset was sent from.
   * @param {string} toAddress - the address of the account the asset was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetQuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async sendARC0200AssetQuest(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendARC0200AssetQuestData
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
      name: QuestNameEnum.SendARC0200AssetAction,
    });
  }

  /**
   * Tracks a send native currency quest. This quest is only tracked when >=0.1 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the amount was sent from.
   * @param {string} toAddress - the address of the account the amount was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetQuestData} data - the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async sendNativeCurrencyQuest(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendNativeCurrencyQuestData
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
      name: QuestNameEnum.SendNativeCurrencyAction,
    });
  }

  /**
   * Tracks a send standard asset quest. This quest is only tracked when >=1 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the asset was sent from.
   * @param {string} toAddress - the address of the account the asset was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetQuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async sendStandardAssetQuest(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendStandardAssetQuestData
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
      name: QuestNameEnum.SendStandardAssetAction,
    });
  }

  /**
   * Tracks a sign message quest.
   * @param {string} account - the address of the account that was as a signer.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async signMessageQuest(account: string): Promise<boolean> {
    return await this.track({
      account,
      data: {
        $set_once: {
          featOfStrengthSignMessage: true,
        },
      },
      name: QuestNameEnum.SignAMessageAction,
    });
  }
}
