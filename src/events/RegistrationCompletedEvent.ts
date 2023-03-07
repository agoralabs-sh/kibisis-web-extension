// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

export default class RegistrationCompletedEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.RegistrationCompleted);
  }
}
