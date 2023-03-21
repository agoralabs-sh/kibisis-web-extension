// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

export default class InternalRegistrationCompletedEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.InternalRegistrationCompleted);
  }
}
