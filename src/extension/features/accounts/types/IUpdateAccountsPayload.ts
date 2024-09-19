/**
 * @property {string[]} accountIDs - A list of account IDs to update.
 * @property {boolean} forceInformationUpdate - [optional] Forces an account information update regardless of the
 * updatedAt date. Defaults to false. This is ignored if `information` is set to false.
 * @property {boolean} information - [optional] Updates the account information. Defaults to true.
 * @property {boolean} notifyOnNewTransactions - [optional] Sends a notification when new transactions have been received. Defaults
 * to false.
 * @property {boolean} refreshTransactions - [optional] Fetches the latest transactions as opposed to older
 * transactions. Defaults to false. This is ignored if `transactions` is set to false.
 * @property {boolean} transactions - [optional] Updates the account transaction. Defaults to true.
 */
interface IUpdateAccountsPayload {
  accountIDs: string[];
  forceInformationUpdate?: boolean;
  information?: boolean;
  notifyOnNewTransactions?: boolean;
  refreshTransactions?: boolean;
  transactions?: boolean;
}

export default IUpdateAccountsPayload;
