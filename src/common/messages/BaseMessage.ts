import { v4 as uuid } from 'uuid';

export default class BaseMessage<Reference> {
  public readonly id: string;
  public readonly reference: Reference;

  constructor(reference: Reference) {
    this.id = uuid();
    this.reference = reference;
  }
}
