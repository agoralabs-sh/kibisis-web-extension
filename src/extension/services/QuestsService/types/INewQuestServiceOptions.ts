// services
import StorageManager from '@extension/services/StorageManager';

// types
import type { IBaseOptions } from '@common/types';

interface INewQuestServiceOptions extends IBaseOptions {
  storageManager?: StorageManager;
}

export default INewQuestServiceOptions;
