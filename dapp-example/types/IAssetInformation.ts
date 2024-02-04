import BigNumber from 'bignumber.js';

interface IAssetInformation {
  balance: BigNumber;
  decimals: number;
  id: string;
  name: string | null;
  symbol: string | null;
}

export default IAssetInformation;
