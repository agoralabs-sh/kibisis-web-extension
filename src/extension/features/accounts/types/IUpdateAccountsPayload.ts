/**
 * @property {string[]} accountIds - [optional] a list of account IDs to update. If this is omitted, all accounts are
 * updated.
 * @property {boolean} forceInformationUpdate - [optional] forces an account information update regardless of the
 * updatedAt date. Defaults to false.
 * @property {boolean} informationOnly - [optional] only updates the account information. Defaults to true.
 * @property {boolean} refreshTransactions - [optional] fetches the latest transactions as opposed to older
 * transactions. Defaults to false.
 */
interface IUpdateAccountsPayload {
  accountIds?: string[];
  forceInformationUpdate?: boolean;
  informationOnly?: boolean;
  refreshTransactions?: boolean;
}

export default IUpdateAccountsPayload;
