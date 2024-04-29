import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

type TSignTransactionsAction = (
  transactions: IARC0001Transaction[]
) => Promise<(string | null)[]> | (string | null)[];

export default TSignTransactionsAction;
