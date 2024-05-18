// types
import type IApplicationTransactionTypes from './IApplicationTransactionTypes';
import type IBaseTransaction from './IBaseTransaction';
import type ITransactions from './ITransactions';

/**
 * @property {string[] | null} accounts - (apat) a list of accounts in addition to the sender that may be accessed
 * from the application's approval-program and clear-state-program.
 * @property {string[] | null} applicationArgs - (apaa) transaction specific arguments accessed from the
 * application's approval-program and clear-state-program.
 * @property {string | null} applicationId - (apid) the ID of the application being configured or empty if creating.
 * @property {string | null} approvalProgram - [apap] the base64 encoded teal program executed for every application
 * transaction, except when on-completion is set to "clear". It can read and write global state for the application, as
 * well as account-specific local state. Approval programs may reject the transaction.
 * @property {string | null} clearStateProgram - (apsu) the base64 encoded teal program executed for application
 * transactions with on-completion set to "clear". It can read and write global state for the application, as well as
 * account-specific local state. Clear state programs cannot reject the transaction.
 * @property {number | null} extraProgramPages - (epp) specifies the additional app program len requested in pages.
 * @property {string[] | null} foreignApps - (apfa) a list of applications in addition to the application-id whose
 * global states may be accessed by this application's approval-program and clear-state-program. The access is read-only.
 * @property {string[] | null} foreignAssets - (apas) a list of the assets whose parameters may be accessed by this application's
 * ApprovalProgram and ClearStateProgram. The access is read-only.
 * @property {ITransactions[] | null} innerTransactions - inner transactions produced by application execution.
 */
interface IApplicationTransaction<T = IApplicationTransactionTypes>
  extends IBaseTransaction {
  accounts: string[] | null;
  applicationArgs: string[] | null;
  applicationId: string | null;
  approvalProgram: string | null;
  clearStateProgram: string | null;
  extraProgramPages: number | null;
  foreignApps: string[] | null;
  foreignAssets: string[] | null;
  innerTransactions: ITransactions[] | null;
  type: T;
}

export default IApplicationTransaction;
