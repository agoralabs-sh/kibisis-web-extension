// Enums
import { EventNameEnum } from '@common/enums';

// Events
import { BaseEvent } from '@common/events';

export default class ExtensionResetEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.ExtensionReset);
  }
}
