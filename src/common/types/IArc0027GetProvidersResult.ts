// types
import IArc0027NetworkConfiguration from './IArc0027NetworkConfiguration';

interface IArc0027GetProvidersResult {
  host: string;
  icon: string;
  name: string;
  networks: IArc0027NetworkConfiguration[];
  providerId: string;
}

export default IArc0027GetProvidersResult;
