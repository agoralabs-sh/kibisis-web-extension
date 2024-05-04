// enums
import { LegacyMessageReferenceEnum } from '../enums';

interface ILegacyUseWalletRequestMessage<Params> {
  id: string;
  params: Params | null;
  reference: LegacyMessageReferenceEnum;
}

export default ILegacyUseWalletRequestMessage;
