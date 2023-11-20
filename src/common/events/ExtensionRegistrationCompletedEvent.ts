// enums
import { EventNameEnum } from '@common/enums';

// events
import { BaseEvent } from '@common/events';

export default class ExtensionRegistrationCompletedEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.ExtensionRegistrationCompleted);
  }
}
