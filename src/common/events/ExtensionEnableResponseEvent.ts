import { BaseError, IEnableResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '@common/enums';

// Events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = IEnableResult;

export default class ExtensionEnableResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;

  constructor(payload: IPayload | null, error: BaseError | null) {
    super(EventNameEnum.ExtensionEnableResponse, error);

    this.payload = payload;
  }
}
