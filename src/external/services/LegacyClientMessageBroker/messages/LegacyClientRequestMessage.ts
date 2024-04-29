// enums
import { LegacyMessageReferenceEnum } from '../enums';

// types
import type { ILegacyClientRequestMessage } from '../types';

export default class LegacyClientRequestMessage<Params>
  implements ILegacyClientRequestMessage<Params>
{
  public readonly id: string;
  public readonly params: Params | null;
  public readonly reference: LegacyMessageReferenceEnum;

  constructor({ id, params, reference }: ILegacyClientRequestMessage<Params>) {
    this.id = id;
    this.params = params;
    this.reference = reference;
  }
}
