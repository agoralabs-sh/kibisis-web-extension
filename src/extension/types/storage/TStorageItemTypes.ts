// types
import type { ISerializableNetworkWithTransactionParams } from '@extension/services/NetworksService';
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
import type { ISession } from '../sessions';
import type {
  IAdvancedSettings,
  IAppearanceSettings,
  IGeneralSettings,
  IPrivacySettings,
  ISecuritySettings,
} from '../settings';
import type { ISystemInfo } from '../system';

type TStorageItemTypes =
  | IAccount
  | IActiveAccountDetails
  | IAdvancedSettings
  | IAppearanceSettings
  | IAppWindow
  | IARC0072Asset[]
  | IARC0200Asset[]
  | IGeneralSettings
  | TEvents[]
  | IPasskeyCredential
  | IPasswordTag
  | IPrivacySettings
  | IPrivateKey
  | IQuestItem[]
  | ISerializableNetworkWithTransactionParams[]
  | ISecuritySettings
  | ISession
  | IStandardAsset[]
  | ISystemInfo;

export default TStorageItemTypes;
