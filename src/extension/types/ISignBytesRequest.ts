// Types
import IBaseRequest from './IBaseRequest';

interface ISignBytesRequest extends IBaseRequest {
  encodedData: string;
  signer: string | null;
}

export default ISignBytesRequest;
