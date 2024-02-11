import { v4 as uuid } from 'uuid';

// enums
import { ARC0027MessageReferenceEnum } from '@common/enums';

export default class BaseARC0027Message {
  public readonly id: string;
  public readonly reference: ARC0027MessageReferenceEnum;

  constructor(reference: ARC0027MessageReferenceEnum) {
    this.id = uuid();
    this.reference = reference;
  }
}
