// services
import AppWindowManagerService from '@extension/services/AppWindowManagerService';
import EventQueueService from '@extension/services/EventQueueService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';
import type { TEvents } from '@extension/types';

interface IOptions extends IBaseOptions {
  appWindowManagerService?: AppWindowManagerService;
  event: TEvents;
  eventQueueService?: EventQueueService;
  privateKeyService?: PrivateKeyService;
}

export default IOptions;
