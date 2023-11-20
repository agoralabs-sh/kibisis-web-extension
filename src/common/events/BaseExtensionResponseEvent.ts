// enums
import { EventNameEnum } from '@common/enums';

// errors
import { BaseSerializableError } from '@common/errors';

// events
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
