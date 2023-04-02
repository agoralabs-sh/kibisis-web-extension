// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseSignDataRequestPayload } from '../types';

/**
 * @property {string} host - used in the identity of the dapp.
 */
interface IPayload extends IBaseSignDataRequestPayload {
  host: string;
}

export default class ExtensionSignDataRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignDataRequest);

    this.payload = payload;
  }
}
