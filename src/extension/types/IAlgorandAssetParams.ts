interface IAlgorandAssetParams {
  clawback?: string;
  creator: string;
  decimals: bigint;
  ['default-frozen']?: true;
  freeze?: string;
  manager?: string;
  ['metadata-hash']?: string;
  name?: string;
  ['name-b64']?: string;
  reserve?: string;
  total: bigint;
  ['unit-name']?: string;
  ['unit-name-b64']?: string;
  url?: string;
  ['url-b64']?: string;
}

export default IAlgorandAssetParams;
