// types
import type { INewsItem } from '@extension/services/NewsService';
import type { IQuestItem } from '@extension/services/QuestsService';
import type { IAccount, IActiveAccountDetails } from '../accounts';
import type { IARC0072Asset, IARC0200Asset, IStandardAsset } from '../assets';
import type {
  IPasskeyCredential,
  IPasswordTag,
  IPrivateKey,
} from '../authentication';
import type { TEvents } from '../events';
import type { IAppWindow } from '../layout';
import type { IPasswordLock } from '../password-lock';
import type { ITransactionParams } from '../networks';
import type { ISession } from '../sessions';
import type {
  IAdvancedSettings,
  IAppearanceSettings,
  IGeneralSettings,
  IPrivacySettings,
  ISecuritySettings,
} from '../settings';
import type { ISystemInfo } from '../system';

type IStorageItemTypes =
  | IAccount
  | IActiveAccountDetails
  | IAdvancedSettings
  | IAppearanceSettings
  | IAppWindow
  | IARC0072Asset[]
  | IARC0200Asset[]
  | IGeneralSettings
  | TEvents[]
  | INewsItem[]
  | IPasskeyCredential
  | IPasswordLock
  | IPasswordTag
  | IPrivacySettings
  | IPrivateKey
  | IQuestItem[]
  | ISecuritySettings
  | ISession
  | IStandardAsset[]
  | ISystemInfo
  | ITransactionParams;

export default IStorageItemTypes;
