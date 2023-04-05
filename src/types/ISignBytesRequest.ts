interface ISignBytesRequest {
  appName: string;
  authorizedAddresses: string[];
  encodedData: string;
  host: string;
  iconUrl: string | null;
  signer: string | null;
  tabId: number;
}

export default ISignBytesRequest;
