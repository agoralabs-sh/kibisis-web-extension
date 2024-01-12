import { Arc0027ErrorCodeEnum } from '@common/enums';

export default abstract class BaseSerializableArc0027Error {
  public readonly code: Arc0027ErrorCodeEnum;
  public message: string;
  public readonly name: string;
  public readonly providerId: string;

  public constructor(message: string, providerId: string) {
    this.message = message.toLowerCase();
    this.providerId = providerId;
  }
}
