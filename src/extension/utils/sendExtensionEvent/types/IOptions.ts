// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';

// services
import EventQueueService from '@extension/services/EventQueueService';

// types
import type { TEvents } from '@extension/types';

interface IOptions {
  appWindowRepository?: AppWindowRepository;
  event: TEvents;
  eventQueueService?: EventQueueService;
}

export default IOptions;
