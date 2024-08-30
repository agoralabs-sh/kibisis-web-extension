// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

// messages
import BaseProviderMessage from './BaseProviderMessage';

// types
import type { ISession } from '@extension/types';

interface IPayload {
  sessions: ISession[];
}

export default class ProviderSessionsUpdatedMessage extends BaseProviderMessage {
  public readonly payload: IPayload;

  constructor(sessions: ISession[]) {
    super(ProviderMessageReferenceEnum.SessionsUpdated);

    this.payload = {
      sessions,
    };
  }
}
