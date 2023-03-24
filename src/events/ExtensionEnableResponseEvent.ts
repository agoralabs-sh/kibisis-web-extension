import { BaseError, IEnableResult } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseResponseEvent from './BaseResponseEvent';

type IPayload = IEnableResult;

export default class ExtensionEnableResponseEvent extends BaseResponseEvent {
  public readonly payload: IPayload | null;
  public readonly tabId: number;

  constructor(
    tabId: number,
    payload: IPayload | null,
    error: BaseError | null
  ) {
    super(EventNameEnum.ExtensionEnableResponse, error);

    this.payload = payload;
    this.tabId = tabId;
  }
}
