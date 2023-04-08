// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import { BaseSerializableError } from '@common/errors';

// Events
import BaseEvent from './BaseEvent';

export default class BaseResponseEvent extends BaseEvent {
  public readonly error: BaseSerializableError | null;

  constructor(name: EventNameEnum, error: BaseSerializableError | null) {
    super(name);

    this.error = error;
  }
}
