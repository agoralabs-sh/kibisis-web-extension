interface IConnectRequest {
  appName: string;
  authorizedAddresses: string[];
  genesisHash: string;
  genesisId: string;
  host: string;
  iconUrl: string | null;
  tabId: number;
}

export default IConnectRequest;
