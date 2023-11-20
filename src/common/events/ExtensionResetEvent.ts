// enums
import { EventNameEnum } from '@common/enums';

// events
import { BaseEvent } from '@common/events';

export default class ExtensionResetEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.ExtensionReset);
  }
}
