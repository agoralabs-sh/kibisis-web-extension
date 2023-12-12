enum AccountsThunkEnum {
  FetchAccountsFromStorage = 'accounts/fetchAccountsFromStorage',
  RemoveAccountById = 'accounts/removeAccountById',
  SaveNewAccount = 'accounts/saveNewAccount',
  StartPollingForAccountInformation = 'accounts/startPollingForAccountInformation',
  StopPollingForAccountInformation = 'accounts/stopPollingForAccountInformation',
  UpdateAccountInformation = 'accounts/updateAccountInformation',
  UpdateAccounts = 'accounts/updateAccounts',
  UpdateAccountTransactions = 'accounts/updateAccountTransactions',
}

export default AccountsThunkEnum;
