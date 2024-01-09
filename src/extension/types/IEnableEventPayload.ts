// types
import { IClientInformation } from '@common/types';
import INetwork from './INetwork';

interface IEnableEventPayload extends IClientInformation {
  network: INetwork;
}

export default IEnableEventPayload;
