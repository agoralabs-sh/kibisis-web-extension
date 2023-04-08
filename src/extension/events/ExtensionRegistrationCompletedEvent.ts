// Enums
import { EventNameEnum } from '@common/enums';

// Events
import { BaseEvent } from '@common/events';

export default class ExtensionRegistrationCompletedEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.ExtensionRegistrationCompleted);
  }
}
