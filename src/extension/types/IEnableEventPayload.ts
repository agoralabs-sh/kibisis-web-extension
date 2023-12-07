// types
import { IBaseRequestPayload } from '@common/types';
import INetwork from './INetwork';

interface IEnableEventPayload extends IBaseRequestPayload {
  network: INetwork;
}

export default IEnableEventPayload;
