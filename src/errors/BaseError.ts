// Enums
import { ErrorCodeEnum } from '../enums';

export default abstract class BaseError extends Error {
  public readonly code: ErrorCodeEnum;
  public message: string;
  public readonly name: string;

  public constructor(message: string) {
    super(message.toLowerCase());
  }
}
