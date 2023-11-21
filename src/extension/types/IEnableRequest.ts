// types
import IBaseRequest from './IBaseRequest';
import INetwork from './INetwork';

interface IEnableRequest extends IBaseRequest {
  description: string | null;
  network: INetwork;
}

export default IEnableRequest;
