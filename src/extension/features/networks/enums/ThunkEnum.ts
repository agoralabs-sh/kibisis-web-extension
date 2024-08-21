enum ThunkEnum {
  FetchCustomNodesFromStorage = 'networks/fetchCustomNodesFromStorageThunk',
  FetchTransactionParamsFromStorageThunk = 'networks/fetchTransactionParamsFromStorageThunk',
  RemoveCustomNodeByIDFromStorage = 'networks/removeCustomNodeByIDFromStorageThunk',
  SaveCustomNodeToStorage = 'networks/saveCustomNodeToStorageThunk',
  StartPollingForTransactionParams = 'networks/startPollingForTransactionParams',
  StopPollingForTransactionParams = 'networks/stopPollingForTransactionParams',
  UpdateNodesThunk = 'networks/updateNodesThunk',
  UpdateTransactionParamsForSelectedNetworkThunk = 'networks/updateTransactionParamsForSelectedNetworkThunk',
}

export default ThunkEnum;
