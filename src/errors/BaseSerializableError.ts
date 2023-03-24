import { ErrorCodeEnum } from '@agoralabs-sh/algorand-provider';

export default abstract class BaseSerializableError {
  public readonly code: ErrorCodeEnum;
  public message: string;
  public readonly name: string;

  public constructor(message: string) {
    this.message = message.toLowerCase();
  }
}
