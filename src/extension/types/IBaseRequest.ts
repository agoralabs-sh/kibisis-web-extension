interface IBaseRequest {
  appName: string;
  authorizedAddresses: string[];
  host: string;
  iconUrl: string | null;
  tabId: number;
}

export default IBaseRequest;
