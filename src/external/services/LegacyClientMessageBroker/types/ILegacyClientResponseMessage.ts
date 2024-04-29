import { BaseARC0027Error } from '@agoralabs-sh/avm-web-provider';

// enums
import { LegacyMessageReferenceEnum } from '../enums';

interface ILegacyClientResponseMessage<Result> {
  error: BaseARC0027Error | null;
  id: string;
  reference: LegacyMessageReferenceEnum;
  result: Result | null;
  requestId: string;
}

export default ILegacyClientResponseMessage;
