// types
import type { ISerializableNetworkWithTransactionParams } from '@extension/repositories/NetworksRepository';
import type {
  IAccount,
  IAccountGroup,
  IActiveAccountDetails,
} from '../accounts';
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
  | IAccountGroup[]
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
  | ISerializableNetworkWithTransactionParams[]
  | ISecuritySettings
  | ISession
  | IStandardAsset[]
  | ISystemInfo;

export default TStorageItemTypes;
