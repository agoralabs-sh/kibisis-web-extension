// types
import IArc0013Account from './IArc0013Account';

interface IArc0013EnableResult {
  accounts: IArc0013Account[];
  genesisHash: string;
  genesisId: string;
  providerId: string;
  sessionId?: string;
}

export default IArc0013EnableResult;
