import { ErrorCodeEnum } from '../enums';

export default class ActionError extends Error {
  public readonly code: ErrorCodeEnum;

  constructor(code: ErrorCodeEnum, message: string) {
    super(message);

    this.code = code;
  }
}
