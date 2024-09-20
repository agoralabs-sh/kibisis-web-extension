// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';
import EventQueueRepository from '@extension/repositories/EventQueueRepository';

// types
import type { TEvents } from '@extension/types';

interface IOptions {
  appWindowRepository?: AppWindowRepository;
  event: TEvents;
  eventQueueRepository?: EventQueueRepository;
}

export default IOptions;
