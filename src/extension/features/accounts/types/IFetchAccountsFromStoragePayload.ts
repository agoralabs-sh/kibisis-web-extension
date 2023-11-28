/**
 * @property {boolean} updateAccountInformation - [optional] instruct the thunk to also update the account information.
 * @property {boolean} updateAccountTransactions - [optional] instruct the thunk to also update the account
 * transactions.
 */
interface IFetchAccountsFromStoragePayload {
  updateAccountInformation?: boolean;
  updateAccountTransactions?: boolean;
}

export default IFetchAccountsFromStoragePayload;
