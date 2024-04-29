import {
  ARC0027MethodEnum,
  BaseARC0027Error,
  TResponseResults,
} from '@agoralabs-sh/avm-web-provider';

interface IClientResponseMessage<Result = TResponseResults> {
  error?: BaseARC0027Error;
  id: string;
  method: ARC0027MethodEnum;
  result?: Result;
  requestId: string;
}

export default IClientResponseMessage;
