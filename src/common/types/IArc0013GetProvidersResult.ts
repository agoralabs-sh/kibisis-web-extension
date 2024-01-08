// types
import IArc0013NetworkConfiguration from './IArc0013NetworkConfiguration';

interface IArc0013GetProvidersResult {
  host: string;
  icon: string;
  name: string;
  networks: IArc0013NetworkConfiguration[];
  providerId: string;
}

export default IArc0013GetProvidersResult;
