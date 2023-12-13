// types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAppWindow from './IAppWindow';
import IArc200Asset from './IArc200Asset';
import IGeneralSettings from './IGeneralSettings';
import IEvent from './IEvent';
import IPasswordTag from './IPasswordTag';
import IPrivateKey from './IPrivateKey';
import ISession from './ISession';
import IStandardAsset from './IStandardAsset';
import ITransactionParams from './ITransactionParams';

type IStorageItemTypes =
  | IAccount
  | IAdvancedSettings
  | IAppearanceSettings
  | IAppWindow
  | IArc200Asset[]
  | IGeneralSettings
  | IEvent[]
  | IPasswordTag
  | IPrivateKey
  | ISession
  | IStandardAsset[]
  | ITransactionParams;

export default IStorageItemTypes;
