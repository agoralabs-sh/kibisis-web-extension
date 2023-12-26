interface IQueryStandardAssetPayload {
  accountId: string;
  assetId: string | null;
  nameOrUnit: string | null;
  refresh: boolean;
}

export default IQueryStandardAssetPayload;
