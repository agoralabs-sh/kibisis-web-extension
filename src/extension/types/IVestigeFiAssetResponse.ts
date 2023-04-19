interface IVestigeFiAssetResponse {
  burned_supply: string;
  circulating_supply: string;
  created_round: number;
  creator: string;
  decimals: number;
  has_clawback: true;
  has_freeze: boolean;
  id: number;
  name: string;
  reserve: string;
  supply: string;
  ticker: string;
  url: string;
  verified: boolean;
}

export default IVestigeFiAssetResponse;
