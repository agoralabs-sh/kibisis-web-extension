// enums
import { LegacyMessageReferenceEnum } from '../enums';

// types
import type { ILegacyUseWalletRequestMessage } from '../types';

export default class LegacyUseWalletRequestMessage<Params>
  implements ILegacyUseWalletRequestMessage<Params>
{
  public readonly id: string;
  public readonly params: Params | null;
  public readonly reference: LegacyMessageReferenceEnum;

  constructor({
    id,
    params,
    reference,
  }: ILegacyUseWalletRequestMessage<Params>) {
    this.id = id;
    this.params = params;
    this.reference = reference;
  }
}
