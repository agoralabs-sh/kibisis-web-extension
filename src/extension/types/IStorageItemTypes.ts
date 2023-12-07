// types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAppWindow from './IAppWindow';
import IAsset from './IAsset';
import IGeneralSettings from './IGeneralSettings';
import IEvent from './IEvent';
import IPasswordTag from './IPasswordTag';
import IPrivateKey from './IPrivateKey';
import ISession from './ISession';
import ITransactionParams from './ITransactionParams';

type IStorageItemTypes =
  | IAccount
  | IAdvancedSettings
  | IAppearanceSettings
  | IAppWindow
  | IAsset[]
  | IGeneralSettings
  | IEvent[]
  | IPasswordTag
  | IPrivateKey
  | ISession
  | ITransactionParams;

export default IStorageItemTypes;
