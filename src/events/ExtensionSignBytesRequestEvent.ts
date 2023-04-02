// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

// Types
import { IBaseSignBytesRequestPayload } from '../types';

/**
 * @property {string} host - used in the identity of the dapp.
 */
interface IPayload extends IBaseSignBytesRequestPayload {
  host: string;
}

export default class ExtensionSignBytesRequestEvent extends BaseEvent {
  public readonly payload: IPayload;

  constructor(payload: IPayload) {
    super(EventNameEnum.ExtensionSignBytesRequest);

    this.payload = payload;
  }
}
