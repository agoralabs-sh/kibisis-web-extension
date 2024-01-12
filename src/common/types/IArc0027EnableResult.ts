// types
import IArc0027Account from './IArc0027Account';

interface IArc0027EnableResult {
  accounts: IArc0027Account[];
  genesisHash: string;
  genesisId: string;
  providerId: string;
  sessionId?: string;
}

export default IArc0027EnableResult;
