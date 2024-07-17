// services
import StorageManager from '@extension/services/StorageManager';

// types
import { IBaseOptions } from '@common/types';

interface INewOptions extends IBaseOptions {
  storageManager?: StorageManager;
}

export default INewOptions;
