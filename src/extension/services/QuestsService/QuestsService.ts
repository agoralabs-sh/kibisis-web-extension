import BigNumber from 'bignumber.js';
import { PostHog } from 'posthog-node';

// constants
import { QUESTS_COMPLETED_KEY } from '@extension/constants';

// enums
import { QuestNameEnum } from './enums';

// services
import SettingsService from '@extension/services/SettingsService';
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
  private readonly _settingsService: SettingsService;
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
    this._settingsService = new SettingsService({
      logger,
      storageManager: _storageManager,
    });
    this._storageManager = _storageManager;
  }

  /**
   * private functions
   */

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
    const items = await this.allCompletedQuests();

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
    const { privacy } = await this._settingsService.getAll();

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
    await this._completeQuestByName(QuestNameEnum.AcquireARC0072Action);

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
    await this._completeQuestByName(QuestNameEnum.AddARC0200AssetAction);

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
    await this._completeQuestByName(QuestNameEnum.AddStandardAssetAction);

    return await this._track({
      account: fromAddress,
      data,
      name: QuestNameEnum.AddStandardAssetAction,
    });
  }

  /**
   * Gets all the completed quest items.
   * @returns {Promise<IQuestItem[]>} a promise that resolves to all the quest items.
   */
  public async allCompletedQuests(): Promise<IQuestItem[]> {
    return (await this._storageManager.getItem(QUESTS_COMPLETED_KEY)) || [];
  }

  /**
   * Tracks an import account via QR code quest.
   * @param {string} account - the address of the account that was imported.
   * @returns {Promise<boolean>} a promise that resolves to whether the quest was tracked or not.
   */
  public async importAccountViaQRCodeQuest(account: string): Promise<boolean> {
    await this._completeQuestByName(QuestNameEnum.ImportAccountViaQRCodeAction);

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
   * Gets the completed quest by name.
   * @param {QuestNameEnum} name - the name of the quest.
   * @returns {Promise<IQuestItem | null>} a promise that resolves to the completed quest item, or null if it hasn't
   * been completed.
   */
  public async questCompletedByName(
    name: QuestNameEnum
  ): Promise<IQuestItem | null> {
    const allCompletedQuests = await this.allCompletedQuests();

    return allCompletedQuests.find((value) => value.name === name) || null;
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

    await this._completeQuestByName(QuestNameEnum.SendARC0200AssetAction);

    return await this._track({
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

    await this._completeQuestByName(QuestNameEnum.SendNativeCurrencyAction);

    return await this._track({
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

    await this._completeQuestByName(QuestNameEnum.SendStandardAssetAction);

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
    await this._completeQuestByName(QuestNameEnum.SignAMessageAction);

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
