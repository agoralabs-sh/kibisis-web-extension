// services
import StorageManager from '@extension/services/StorageManager';

// types
import { IBaseOptions } from '@common/types';

interface ICreateOptions extends IBaseOptions {
  storageManager?: StorageManager;
}

export default ICreateOptions;
