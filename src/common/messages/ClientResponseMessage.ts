import {
  ARC0027MethodEnum,
  BaseARC0027Error,
} from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientResponseMessage } from '@common/types';

export default class ClientResponseMessage<Result>
  implements IClientResponseMessage<Result>
{
  public readonly error: BaseARC0027Error | undefined;
  public readonly id: string;
  public readonly method: ARC0027MethodEnum;
  public readonly requestId: string;
  public readonly result: Result | undefined;

  constructor({
    error,
    id,
    method,
    requestId,
    result,
  }: IClientResponseMessage<Result>) {
    this.error = error;
    this.id = id;
    this.method = method;
    this.requestId = requestId;
    this.result = result;
  }
}
