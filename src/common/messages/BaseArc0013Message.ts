import { v4 as uuid } from 'uuid';

// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

export default class BaseArc0013Message {
  public readonly id: string;
  public readonly reference: Arc0013MessageReferenceEnum;

  constructor(reference: Arc0013MessageReferenceEnum) {
    this.id = uuid();
    this.reference = reference;
  }
}
