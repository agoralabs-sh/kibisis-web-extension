// types
import IARC0027NetworkConfiguration from './IARC0027NetworkConfiguration';

interface IARC0027GetProvidersResult {
  host: string;
  icon: string;
  name: string;
  networks: IARC0027NetworkConfiguration[];
  providerId: string;
}

export default IARC0027GetProvidersResult;
