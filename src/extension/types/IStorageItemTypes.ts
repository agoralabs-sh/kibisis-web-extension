// types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAppWindow from './IAppWindow';
import IArc200Asset from './IArc200Asset';
import IGeneralSettings from './IGeneralSettings';
import IClientEvent from './IClientEvent';
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
  | IClientEvent[]
  | IPasswordTag
  | IPrivateKey
  | ISession
  | IStandardAsset[]
  | ITransactionParams;

export default IStorageItemTypes;
