import { v4 as uuid } from 'uuid';

// enums
import { Arc0027MessageReferenceEnum } from '@common/enums';

export default class BaseArc0027Message {
  public readonly id: string;
  public readonly reference: Arc0027MessageReferenceEnum;

  constructor(reference: Arc0027MessageReferenceEnum) {
    this.id = uuid();
    this.reference = reference;
  }
}
