enum AccountsThunkEnum {
  FetchAccountsFromStorage = 'accounts/fetchAccountsFromStorage',
  RemoveAccountById = 'accounts/removeAccountById',
  SaveNewAccount = 'accounts/saveNewAccount',
  StartPollingForAccounts = 'accounts/startPollingForAccounts',
  StopPollingForAccounts = 'accounts/stopPollingForAccounts',
  UpdateAccounts = 'accounts/updateAccounts',
}

export default AccountsThunkEnum;
