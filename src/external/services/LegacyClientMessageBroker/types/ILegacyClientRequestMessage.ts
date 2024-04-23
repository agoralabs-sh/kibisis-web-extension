// enums
import { LegacyMessageReferenceEnum } from '../enums';

interface ILegacyClientRequestMessage<Params> {
  id: string;
  params: Params | null;
  reference: LegacyMessageReferenceEnum;
}

export default ILegacyClientRequestMessage;
