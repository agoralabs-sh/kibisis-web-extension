import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';

// enums
import { LegacyMessageReferenceEnum } from '../enums';

// types
import type { ILegacyClientResponseMessage } from '../types';

export default class LegacyClientResponseMessage<Result>
  implements ILegacyClientResponseMessage<Result>
{
  public readonly error: BaseARC0027Error | null;
  public readonly id: string;
  public readonly reference: LegacyMessageReferenceEnum;
  public readonly requestId: string;
  public readonly result: Result | null;

  constructor({
    error,
    id,
    reference,
    requestId,
    result,
  }: ILegacyClientResponseMessage<Result>) {
    this.error = error;
    this.id = id;
    this.reference = reference;
    this.requestId = requestId;
    this.result = result;
  }
}
