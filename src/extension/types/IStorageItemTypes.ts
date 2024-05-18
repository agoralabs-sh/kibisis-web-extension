// types
import type { INewsItem } from '@extension/services/NewsService';
import type { IAccount } from './accounts';
import type { IARC0072Asset, IARC0200Asset, IStandardAsset } from './assets';
import type { TEvents } from './events';
import type { ITransactionParams } from './networks';
import type {
  IAdvancedSettings,
  IAppearanceSettings,
  IGeneralSettings,
  IPrivacySettings,
  ISecuritySettings,
} from './settings';
import type IActiveAccountDetails from './IActiveAccountDetails';
import type IAppWindow from './IAppWindow';
import type IPasswordLock from './IPasswordLock';
import type IPasswordTag from './IPasswordTag';
import type IPrivateKey from './IPrivateKey';
import type ISession from './ISession';

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
  | IPasswordLock
  | IPasswordTag
  | IPrivacySettings
  | IPrivateKey
  | ISecuritySettings
  | ISession
  | IStandardAsset[]
  | ITransactionParams;

export default IStorageItemTypes;
