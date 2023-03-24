import { BaseError } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

export default class BaseResponseEvent extends BaseEvent {
  public readonly error: BaseError | null;

  constructor(name: EventNameEnum, error: BaseError | null) {
    super(name);

    this.error = error;
  }
}
