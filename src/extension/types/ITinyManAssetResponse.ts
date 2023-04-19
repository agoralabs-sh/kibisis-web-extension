interface IITinyManAssetLogo {
  png: string;
  svg: string;
}

interface ITinyManAssetResponse {
  decimals: number;
  deleted: boolean;
  id: string;
  logo: IITinyManAssetLogo;
  name: string;
  total_amount: string;
  unit_name: string;
  url: string;
}

export default ITinyManAssetResponse;
