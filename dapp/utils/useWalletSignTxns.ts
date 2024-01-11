import { encode as encodeBase64 } from '@stablelib/base64';

export default async function useWalletSignTxns(
  signTransactionsFunction: (
    transactions: Uint8Array[] | Uint8Array[][],
    indexesToSign?: number[],
    returnGroup?: boolean
  ) => Promise<Uint8Array[]>,
  indexesToSign: number[],
  encodedTxns: Uint8Array[]
): Promise<(string | null)[]> {
  const result: Uint8Array[] = await signTransactionsFunction(
    encodedTxns,
    indexesToSign,
    true
  );

  return result.map((value) => encodeBase64(value));
}
