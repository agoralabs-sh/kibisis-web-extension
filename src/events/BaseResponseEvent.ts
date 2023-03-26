// Enums
import { EventNameEnum } from '../enums';

// Errors
import { BaseSerializableError } from '../errors';

// Events
import BaseEvent from './BaseEvent';

export default class BaseResponseEvent extends BaseEvent {
  public readonly error: BaseSerializableError | null;

  constructor(name: EventNameEnum, error: BaseSerializableError | null) {
    super(name);

    this.error = error;
  }
}
