import { BaseError } from '@agoralabs-sh/algorand-provider';

// Events
import BaseEvent from './BaseEvent';

export default class BaseResponseEvent extends BaseEvent {
  public readonly error: BaseError | null;

  constructor(name: string, error?: BaseError) {
    super(name);

    this.error = error || null;
  }
}
