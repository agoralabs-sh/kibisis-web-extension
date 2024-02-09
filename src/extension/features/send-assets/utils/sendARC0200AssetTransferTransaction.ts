import { Algodv2, Indexer } from 'algosdk';
import Arc200Contract from 'arc200js';

// errors
import { FailedToSendTransactionError } from '@extension/errors';

// types
import { IBaseOptions } from '@common/types';
import { IARC0200Asset } from '@extension/types';

interface IOptions extends IBaseOptions {
  algodClient: Algodv2;
  amount: string;
  asset: IARC0200Asset;
  fromAddress: string;
  indexerClient: Indexer;
  note: string | null;
  privateKey: Uint8Array;
  toAddress: string;
}

interface IResult {
  success: boolean;
  txId?: string;
  txns?: string[];
}

/**
 * Convenience function that calls the ARC-200 contract to transfer the tokens.
 * @param {IOptions} options - the fields needed to create a transaction
 * @returns {IResult} the result of the transaction.
 */
export default async function sendARC0200AssetTransferTransaction({
  algodClient,
  amount,
  asset,
  fromAddress,
  indexerClient,
  privateKey,
  toAddress,
}: IOptions): Promise<string> {
  const contract: Arc200Contract = new Arc200Contract(
    parseInt(asset.id),
    algodClient,
    indexerClient,
    {
      acc: {
        addr: fromAddress,
        sk: privateKey,
      },
    }
  );
  const result: IResult = await contract.arc200_transfer(
    toAddress,
    BigInt(amount),
    false,
    true
  );

  if (result.success && result.txId) {
    return result.txId;
  }

  throw new FailedToSendTransactionError(
    'arc200 transaction was not successful'
  );
}
