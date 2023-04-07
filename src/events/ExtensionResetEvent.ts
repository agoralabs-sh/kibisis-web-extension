// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

export default class ExtensionResetEvent extends BaseEvent {
  constructor() {
    super(EventNameEnum.ExtensionReset);
  }
}
