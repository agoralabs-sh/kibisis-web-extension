// types
import IARC0027Account from './IARC0027Account';

interface IARC0027EnableResult {
  accounts: IARC0027Account[];
  genesisHash: string;
  genesisId: string;
  providerId: string;
  sessionId?: string;
}

export default IARC0027EnableResult;
