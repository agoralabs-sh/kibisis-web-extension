// Types
import IAssetInformation from './IAssetInformation';

interface IAccountInformation {
  address: string;
  assets: IAssetInformation[];
  name: string | null;
}

export default IAccountInformation;
