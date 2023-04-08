interface IEnableRequest {
  appName: string;
  authorizedAddresses: string[];
  description: string | null;
  genesisHash: string;
  genesisId: string;
  host: string;
  iconUrl: string | null;
  tabId: number;
}

export default IEnableRequest;
