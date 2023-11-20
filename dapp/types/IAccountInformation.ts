import BigNumber from 'bignumber.js';

// types
import IAssetInformation from './IAssetInformation';

interface IAccountInformation {
  address: string;
  assets: IAssetInformation[];
  balance: BigNumber;
  name: string | null;
}

export default IAccountInformation;
