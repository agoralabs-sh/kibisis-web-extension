import { AlgorandProvider } from '@agoralabs-sh/algorand-provider';
import { encode as encodeBase64 } from '@stablelib/base64';
import { encodeUnsignedTransaction, Transaction } from 'algosdk';

// types
import { IWindow } from '@external/types';

export default async function algorandProviderSignTxns(
  txns: Transaction[]
): Promise<(string | null)[] | null> {
  const algorand: AlgorandProvider | undefined = (window as IWindow).algorand;

  if (!algorand) {
    return null;
  }

  const { stxns } = await algorand.signTxns({
    txns: txns.map((value) => ({
      txn: encodeBase64(encodeUnsignedTransaction(value)),
    })),
  });

  return stxns;
}
