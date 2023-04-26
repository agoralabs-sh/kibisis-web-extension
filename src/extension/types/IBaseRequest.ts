interface IBaseRequest {
  appName: string;
  authorizedAddresses: string[];
  host: string;
  iconUrl: string | null;
  requestEventId: string;
  tabId: number;
}

export default IBaseRequest;
