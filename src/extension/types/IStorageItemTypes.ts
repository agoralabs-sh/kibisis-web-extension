// types
import IAccount from './IAccount';
import IActiveAccountDetails from './IActiveAccountDetails';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAppWindow from './IAppWindow';
import IARC0200Asset from './IARC0200Asset';
import IEvent from './IEvent';
import IGeneralSettings from './IGeneralSettings';
import IPasswordLock from './IPasswordLock';
import IPasswordTag from './IPasswordTag';
import IPrivateKey from './IPrivateKey';
import ISecuritySettings from './ISecuritySettings';
import ISession from './ISession';
import IStandardAsset from './IStandardAsset';
import ITransactionParams from './ITransactionParams';

type IStorageItemTypes =
  | IAccount
  | IActiveAccountDetails
  | IAdvancedSettings
  | IAppearanceSettings
  | IAppWindow
  | IARC0200Asset[]
  | IGeneralSettings
  | IEvent[]
  | IPasswordLock
  | IPasswordTag
  | IPrivateKey
  | ISecuritySettings
  | ISession
  | IStandardAsset[]
  | ITransactionParams;

export default IStorageItemTypes;
