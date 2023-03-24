interface IConnectRequest {
  authorizedAddresses: string[];
  appName: string;
  genesisHash: string;
  host: string;
  iconUrl: string | null;
  tabId: number;
}

export default IConnectRequest;
