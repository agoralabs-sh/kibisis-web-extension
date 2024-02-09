import { ARC0027ErrorCodeEnum } from '@common/enums';

export default abstract class BaseSerializableARC0027Error {
  public readonly code: ARC0027ErrorCodeEnum;
  public message: string;
  public readonly name: string;
  public readonly providerId: string;

  public constructor(message: string, providerId: string) {
    this.message = message.toLowerCase();
    this.providerId = providerId;
  }
}
