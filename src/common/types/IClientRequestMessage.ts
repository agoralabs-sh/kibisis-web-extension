import {
  ARC0027MethodEnum,
  TRequestParams,
} from '@agoralabs-sh/avm-web-provider';

// messages
import { IClientInformation } from '@common/types';

interface IClientRequestMessage<Params = TRequestParams> {
  clientInfo: IClientInformation;
  id: string;
  method: ARC0027MethodEnum;
  params?: Params;
}

export default IClientRequestMessage;
