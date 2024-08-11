interface INetworkConnectivity {
  checking: boolean;
  online: boolean;
  pollingID: number | null;
}

export default INetworkConnectivity;
