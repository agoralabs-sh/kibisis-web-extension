import { BigNumber } from 'bignumber.js';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import {
  IAlgorandApplicationTransaction,
  IAlgorandTransaction,
  IApplicationTransaction,
  IApplicationTransactionTypes,
  IBaseTransaction,
} from '@extension/types';

// Utils
import mapAlgorandTransactionToTransaction from './mapAlgorandTransactionToTransaction';

export default function parseApplicationTransaction(
  algorandApplicationTransaction: IAlgorandApplicationTransaction,
  baseTransaction: IBaseTransaction,
  innerTransactions?: IAlgorandTransaction[]
): IApplicationTransaction {
  const applicationId: string | null =
    algorandApplicationTransaction['application-id'] > 0
      ? new BigNumber(
          String(algorandApplicationTransaction['application-id'] as bigint)
        ).toString()
      : null;
  let type: IApplicationTransactionTypes = TransactionTypeEnum.ApplicationNoOp;

  switch (algorandApplicationTransaction['on-completion']) {
    case 'clear':
      type = TransactionTypeEnum.ApplicationClearState;
      break;
    case 'closeout':
      type = TransactionTypeEnum.ApplicationCloseOut;
      break;
    case 'delete':
      type = TransactionTypeEnum.ApplicationDelete;
      break;
    case 'optin':
      type = TransactionTypeEnum.ApplicationOptIn;
      break;
    case 'update':
      type = TransactionTypeEnum.ApplicationUpdate;
      break;
    default:
      break;
  }

  // if the application id is zero, this will be an application create
  if (!applicationId) {
    type = TransactionTypeEnum.ApplicationCreate;
  }

  return {
    ...baseTransaction,
    applicationArgs: algorandApplicationTransaction['application-args'] || null,
    applicationId,
    accounts: algorandApplicationTransaction.accounts || null,
    approvalProgram: algorandApplicationTransaction['approval-program'] || null,
    clearStateProgram:
      algorandApplicationTransaction['clear-state-program'] || null,
    extraProgramPages: algorandApplicationTransaction['extra-program-pages']
      ? Number(algorandApplicationTransaction['extra-program-pages'])
      : null,
    foreignApps:
      algorandApplicationTransaction['foreign-apps']?.map((value) =>
        new BigNumber(String(value as bigint)).toString()
      ) || null,
    foreignAssets:
      algorandApplicationTransaction['foreign-assets']?.map((value) =>
        new BigNumber(String(value as bigint)).toString()
      ) || null,
    innerTransactions:
      innerTransactions?.map(mapAlgorandTransactionToTransaction) || null,
    type,
  };
}
