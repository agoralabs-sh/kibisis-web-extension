// enums
import { InternalMessageReferenceEnum } from '@common/enums';

// messages
import BaseInternalMessage from './BaseInternalMessage';

interface IPayload {
  password: string | null;
}

export default class InternalPasswordLockUpdatedMessage extends BaseInternalMessage {
  public readonly payload: IPayload;

  constructor(password: string | null) {
    super(InternalMessageReferenceEnum.PasswordLockUpdated);

    this.payload = {
      password,
    };
  }
}
