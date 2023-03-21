// Types
import IPksAccountStorageItem from './IPksAccountStorageItem';
import IPksPasswordTagStorageItem from './IPksPasswordTagStorageItem';
import ISession from './ISession';

type IStorageItemTypes =
  | IPksAccountStorageItem
  | IPksPasswordTagStorageItem
  | ISession;

export default IStorageItemTypes;
