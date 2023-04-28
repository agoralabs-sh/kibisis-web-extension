// Types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAsset from './IAsset';
import IGeneralSettings from './IGeneralSettings';
import IPasswordTag from './IPasswordTag';
import IPrivateKey from './IPrivateKey';
import ISession from './ISession';

type IStorageItemTypes =
  | IAccount
  | IAdvancedSettings
  | IAppearanceSettings
  | IAsset[]
  | IGeneralSettings
  | IPasswordTag
  | IPrivateKey
  | ISession;

export default IStorageItemTypes;
