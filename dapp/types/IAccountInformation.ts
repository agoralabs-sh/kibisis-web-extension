import BigNumber from 'bignumber.js';

// Types
import IAssetInformation from './IAssetInformation';

interface IAccountInformation {
  address: string;
  assets: IAssetInformation[];
  balance: BigNumber;
  name: string | null;
}

export default IAccountInformation;
