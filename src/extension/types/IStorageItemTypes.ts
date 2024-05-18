// types
import type { INewsItem } from '@extension/services/NewsService';
import type TEvents from './events/TEvents';
import type IAccount from './IAccount';
import type IActiveAccountDetails from './IActiveAccountDetails';
import type IAdvancedSettings from './IAdvancedSettings';
import type IAppearanceSettings from './IAppearanceSettings';
import type IAppWindow from './IAppWindow';
import type IARC0072Asset from './IARC0072Asset';
import type IARC0200Asset from './IARC0200Asset';
import type IGeneralSettings from './IGeneralSettings';
import type IPasswordLock from './IPasswordLock';
import type IPasswordTag from './IPasswordTag';
import type IPrivacySettings from './IPrivacySettings';
import type IPrivateKey from './IPrivateKey';
import type ISecuritySettings from './ISecuritySettings';
import type ISession from './ISession';
import type IStandardAsset from './IStandardAsset';
import type ITransactionParams from './ITransactionParams';

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
