// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

export default class ExtensionRegistrationCompletedEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.ExtensionRegistrationCompleted);
  }
}
