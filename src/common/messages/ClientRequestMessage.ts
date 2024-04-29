import { ARC0027MethodEnum } from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientInformation, IClientRequestMessage } from '@common/types';

export default class ClientRequestMessage<Params>
  implements IClientRequestMessage<Params>
{
  public readonly clientInfo: IClientInformation;
  public readonly id: string;
  public readonly method: ARC0027MethodEnum;
  public readonly params: Params | undefined;

  constructor({
    clientInfo,
    id,
    method,
    params,
  }: IClientRequestMessage<Params>) {
    this.clientInfo = clientInfo;
    this.id = id;
    this.method = method;
    this.params = params;
  }
}
