import { IEnableOptions } from '@agoralabs-sh/algorand-provider';

// Enums
import { EventNameEnum } from '../enums';

// Events
import BaseEvent from './BaseEvent';

type IPayload = IEnableOptions;

export default class EnableRequestEvent extends BaseEvent {
  public readonly payload: IPayload | null;

  constructor(payload?: IPayload) {
    super(EventNameEnum.EnableRequest);

    this.payload = payload || null;
  }
}
