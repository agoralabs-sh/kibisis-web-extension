/**
 * @property {boolean} updateInformation - [optional] instruct the thunk to also update the account information.
 * @property {boolean} updateTransactions - [optional] instruct the thunk to also update the account
 * transactions.
 */
interface IFetchAccountsFromStoragePayload {
  updateInformation?: boolean;
  updateTransactions?: boolean;
}

export default IFetchAccountsFromStoragePayload;
