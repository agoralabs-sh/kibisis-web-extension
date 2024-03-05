interface ITokenResponse {
  approved: string;
  contractId: number;
  metadataURI: string;
  metadata: string;
  ['mint-round']: number;
  owner: string;
  tokenId: number;
}

export default ITokenResponse;
