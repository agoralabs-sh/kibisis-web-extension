// Types
import IAccount from './IAccount';
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import INetwork from './INetwork';
import IPksAccountStorageItem from './IPksAccountStorageItem';
import IPksPasswordTagStorageItem from './IPksPasswordTagStorageItem';
import ISession from './ISession';

type IStorageItemTypes =
  | IAccount
  | IAdvancedSettings
  | IAppearanceSettings
  | INetwork
  | IPksAccountStorageItem
  | IPksPasswordTagStorageItem
  | ISession;

export default IStorageItemTypes;