import { v4 as uuid } from 'uuid';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';

export default class BaseProviderMessage {
  public readonly id: string;
  public readonly reference: ProviderMessageReferenceEnum;

  constructor(reference: ProviderMessageReferenceEnum) {
    this.id = uuid();
    this.reference = reference;
  }
}
