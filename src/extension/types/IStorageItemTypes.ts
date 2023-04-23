// Types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAsset from './IAsset';
import IGeneralSettings from './IGeneralSettings';
import IPksAccountStorageItem from './IPksAccountStorageItem';
import IPksPasswordTagStorageItem from './IPksPasswordTagStorageItem';
import ISession from './ISession';

type IStorageItemTypes =
  | IAccount
  | IAdvancedSettings
  | IAppearanceSettings
  | IAsset[]
  | IGeneralSettings
  | IPksAccountStorageItem
  | IPksPasswordTagStorageItem
  | ISession;

export default IStorageItemTypes;
