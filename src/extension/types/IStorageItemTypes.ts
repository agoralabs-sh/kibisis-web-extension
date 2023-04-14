// Types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IAsset from './IAsset';
import INetwork from './INetwork';
import IPksAccountStorageItem from './IPksAccountStorageItem';
import IPksPasswordTagStorageItem from './IPksPasswordTagStorageItem';
import ISession from './ISession';

type IStorageItemTypes =
  | IAccount
  | IAdvancedSettings
  | IAppearanceSettings
  | IAsset[]
  | INetwork
  | IPksAccountStorageItem
  | IPksPasswordTagStorageItem
  | ISession;

export default IStorageItemTypes;
