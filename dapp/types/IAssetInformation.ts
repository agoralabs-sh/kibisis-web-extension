import BigNumber from 'bignumber.js';

interface IAssetInformation {
  amount: BigNumber;
  decimals: number;
  id: string;
  name: string | null;
  symbol: string | null;
}

export default IAssetInformation;
