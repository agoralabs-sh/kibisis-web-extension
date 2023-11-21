// enums
import { EventNameEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// events
import BaseEvent from './BaseEvent';

export default class BaseResponseEvent extends BaseEvent {
  public readonly error: BaseSerializableError | null;

  constructor(name: EventNameEnum, error: BaseSerializableError | null) {
    super(name);

    this.error = error;
  }
}
