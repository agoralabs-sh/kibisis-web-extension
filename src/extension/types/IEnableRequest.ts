// Types
import IBaseRequest from './IBaseRequest';

interface IEnableRequest extends IBaseRequest {
  description: string | null;
  genesisHash: string;
  genesisId: string;
}

export default IEnableRequest;
