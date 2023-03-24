interface IConnectRequest {
  authorizedAddresses: string[];
  appName: string;
  genesisHash: string;
  genesisId: string;
  host: string;
  iconUrl: string | null;
  tabId: number;
}

export default IConnectRequest;
