interface ITokenResult {
  approved: string;
  contractId: number;
  metadataURI: string;
  metadata: string;
  ['mint-round']: number;
  owner: string;
  tokenId: number;
}

export default ITokenResult;
