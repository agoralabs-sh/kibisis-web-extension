// Types
import INetwork from './INetwork';
import IPksAccountStorageItem from './IPksAccountStorageItem';
import IPksPasswordTagStorageItem from './IPksPasswordTagStorageItem';
import ISession from './ISession';

type IStorageItemTypes =
  | INetwork
  | IPksAccountStorageItem
  | IPksPasswordTagStorageItem
  | ISession;

export default IStorageItemTypes;
