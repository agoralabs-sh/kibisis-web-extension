// Enums
import { EventNameEnum } from '@common/enums';

// Errors
import { BaseSerializableError } from '@common/errors';

// Events
import BaseResponseEvent from './BaseResponseEvent';

export default class BaseExtensionResponseEvent extends BaseResponseEvent {
  public readonly requestEventId: string;

  constructor(
    name: EventNameEnum,
    requestEventId: string,
    error: BaseSerializableError | null
  ) {
    super(name, error);

    this.requestEventId = requestEventId;
  }
}
