import BigNumber from 'bignumber.js';
import { PostHog } from 'posthog-node';

// constants
import { QUESTS_COMPLETED_KEY } from '@extension/constants';

// enums
import { QuestNameEnum } from './enums';

// repositories
import SettingsRepository from '@extension/repositories/SettingsRepository';
import StorageManager from '@extension/services/StorageManager';

// types
import type { ILogger } from '@common/types';
import type {
  IAcquireARC0072QuestData,
  IAddARC0200AssetQuestData,
  IAddStandardAssetQuestData,
  INewQuestServiceOptions,
  IQuestItem,
  ISendARC0200AssetQuestData,
  ISendNativeCurrencyQuestData,
  ISendStandardAssetQuestData,
  ITrackOptions,
} from './types';

export default class QuestsService {
  // private variables
  private readonly _logger: ILogger | null;
  private readonly _posthog: PostHog | null;
  private readonly _settingsRepository: SettingsRepository;
  private readonly _storageManager: StorageManager;

  constructor({ logger, storageManager }: INewQuestServiceOptions) {
    const _storageManager = storageManager || new StorageManager();

    this._logger = logger || null;
    this._posthog =
      __POSTHOG_API_HOST__ && __POSTHOG_PROJECT_ID__
        ? new PostHog(__POSTHOG_PROJECT_ID__, {
            host: __POSTHOG_API_HOST__,
          })
        : null;
    this._settingsRepository = new SettingsRepository();
    this._storageManager = _storageManager;
  }

  /**
   * private functions
   */

  /**
   * Gets all the completed quest items.
   * @returns {Promise<IQuestItem[]>} a promise that resolves to all the quest items.
   * @private
   */
  public async _allCompletedQuests(): Promise<IQuestItem[]> {
    return (await this._storageManager.getItem(QUESTS_COMPLETED_KEY)) || [];
  }

  /**
   * Adds (or updates) a completed quest by name. This function uses the current time for the completed timestamp.
   * @param {QuestNameEnum} name - the name of the quest to complete.
   * @private
   */
  private async _completeQuestByName(name: QuestNameEnum): Promise<IQuestItem> {
    const item: IQuestItem = {
      lastCompletedAt: new Date().getTime(),
      name,
    };
    const items = await this._allCompletedQuests();

    // if the item doesn't exist, just add it
    if (!items.find((value) => value.name === name)) {
      await this._storageManager.setItems({
        [QUESTS_COMPLETED_KEY]: [...items, item],
      });

      return item;
    }

    await this._storageManager.setItems({
      [QUESTS_COMPLETED_KEY]: items.map((value) =>
        value.name === item.name ? item : value
      ),
    });

    return item;
  }

  /**
   * Convenience function that checks if the action tracking has been enabled in the settings.
   * @returns {Promise<boolean>} a promise that resolves to true if action tacking is enabled, false otherwise.
   * @private
   */
  private async _isTrackingAllowed(): Promise<boolean> {
    const { privacy } = await this._settingsRepository.fetch();

    return privacy.allowActionTracking;
  }

  private async _track({
    account,
    data,
    name,
  }: ITrackOptions): Promise<boolean> {
    const __functionName: string = 'track';

    if (!this._posthog) {
      this._logger?.debug(
        `${QuestsService.name}#${__functionName}: tracking not initialized, ignoring`
      );

      return false;
    }

    // check whether tracking is allowed
    if (!(await this._isTrackingAllowed())) {
      this._logger?.debug(
        `${QuestsService.name}#${__functionName}: tracking not enabled, ignoring`
      );

      return false;
    }

    try {
      this._posthog.capture({
        disableGeoip: true,
        distinctId: account,
        event: name,
        ...(data && {
          properties: data,
        }),
      });

      this._logger?.debug(
        `${QuestsService.name}#${__functionName}: successfully sent action "${name}"`
      );

      // record the quest as completed
      await this._completeQuestByName(name);

      return true;
    } catch (error) {
      this._logger?.error(`${QuestsService.name}#${__functionName}:`, error);

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
    return await this._track({
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
    return await this._track({
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
    return await this._track({
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
    return await this._track({
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
   * Determines if a quest has been completed today. Today is defined as whether a quest has been completed between
   * 00:00 UTC and now.
   * @param {QuestNameEnum} name - the name of the quest.
   * @returns {Promise<boolean>} a promise that resolves to true if the quest has been completed between 00:00 UTC and
   * now, false otherwise.
   */
  public async hasQuestBeenCompletedTodayByName(
    name: QuestNameEnum
  ): Promise<boolean> {
    const allCompletedQuests = await this._allCompletedQuests();
    const completedQuest =
      allCompletedQuests.find((value) => value.name === name) || null;
    const timestampOfMidnightUTC = new Date().setUTCHours(0, 0, 0, 0);

    // true, if the last completed quest was greater than or equal to midnight UTC.
    return (
      !!completedQuest &&
      completedQuest.lastCompletedAt >= timestampOfMidnightUTC
    );
  }

  /**
   * Tracks a send ARC-0200 asset quest. This quest is only tracked when >0 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the asset was sent from.
   * @param {string} toAddress - the address of the account the asset was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetQuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest has been tracked or not.
   */
  public async sendARC0200AssetQuest(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendARC0200AssetQuestData
  ): Promise<boolean> {
    if (
      fromAddress === toAddress ||
      new BigNumber(amountInStandardUnits).lte(new BigNumber('0'))
    ) {
      return false;
    }

    return await this._track({
      account: fromAddress,
      data,
      name: QuestNameEnum.SendARC0200AssetAction,
    });
  }

  /**
   * Tracks a send native currency quest. This quest is only tracked when >0 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the amount was sent from.
   * @param {string} toAddress - the address of the account the amount was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetQuestData} data - the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest has been tracked or not.
   */
  public async sendNativeCurrencyQuest(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendNativeCurrencyQuestData
  ): Promise<boolean> {
    if (
      fromAddress === toAddress ||
      new BigNumber(amountInStandardUnits).lte(new BigNumber('0'))
    ) {
      return false;
    }

    return await this._track({
      account: fromAddress,
      data,
      name: QuestNameEnum.SendNativeCurrencyAction,
    });
  }

  /**
   * Tracks a send standard asset quest. This quest is only tracked when >0 unit is sent to a different account.
   * @param {string} fromAddress - the address of the account the asset was sent from.
   * @param {string} toAddress - the address of the account the asset was sent to.
   * @param {string} amountInStandardUnits - the amount that was sent in standard units.
   * @param {ISendARC0200AssetQuestData} data - the ID of the asset and the network.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest has been tracked or not.
   */
  public async sendStandardAssetQuest(
    fromAddress: string,
    toAddress: string,
    amountInStandardUnits: string,
    data: ISendStandardAssetQuestData
  ): Promise<boolean> {
    if (
      fromAddress === toAddress ||
      new BigNumber(amountInStandardUnits).lte(new BigNumber('0'))
    ) {
      return false;
    }

    return await this._track({
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
    return await this._track({
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
