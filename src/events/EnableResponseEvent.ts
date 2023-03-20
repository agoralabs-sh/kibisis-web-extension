import { BaseError, IEnableResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = IEnableResult;

export default class EnableResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload?: IPayload, error?: BaseError) {
    super(EventNameEnum.EnableResponse, error);

    this.payload = payload || null;
  }
}
