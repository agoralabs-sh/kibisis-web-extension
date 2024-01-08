import { Arc0013ErrorCodeEnum } from '@common/enums';

export default abstract class BaseSerializableArc0013Error {
  public readonly code: Arc0013ErrorCodeEnum;
  public message: string;
  public readonly name: string;
  public readonly providerId: string;

  public constructor(message: string, providerId: string) {
    this.message = message.toLowerCase();
    this.providerId = providerId;
  }
}
