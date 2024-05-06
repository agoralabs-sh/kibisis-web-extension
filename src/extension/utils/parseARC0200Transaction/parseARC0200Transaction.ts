import { decode as decodeBase64 } from '@stablelib/base64';
import type { ABIContract } from 'algosdk';

// contracts
import ARC0200Contract, {
  ARC0200MethodEnum,
} from '@extension/contracts/ARC0200Contract';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type {
  IApplicationTransaction,
  IARC0200AssetTransferTransaction,
} from '@extension/types';

// utils
import isByteArrayEqual from '../isByteArrayEqual';

/**
 * Convenience function that parses an application transaction to an ARC-0200 transaction.
 * @param {IApplicationTransaction} transaction - the application transaction.
 * @returns {IARC0200AssetTransferTransaction | null} the parsed ARC-0200 transaction or null if it is an unknown ARC-0200
 * transaction.
 */
export default function parseARC0200Transaction(
  transaction: IApplicationTransaction
): IARC0200AssetTransferTransaction | null {
  let abiContract: ABIContract;
  let method: Uint8Array;

  if (
    !transaction.applicationArgs ||
    transaction.applicationArgs.length <= 0 ||
    !transaction.applicationId
  ) {
    return null;
  }

  abiContract = ARC0200Contract.getABI();
  method = decodeBase64(transaction.applicationArgs[0]);

  // if it is a transfer
  if (
    isByteArrayEqual(
      method,
      abiContract.getMethodByName(ARC0200MethodEnum.Transfer).getSelector()
    )
  ) {
    return {
      ...transaction,
      amount: ARC0200Contract.formatBase64EncodedUintArg(
        transaction.applicationArgs[2],
        256
      ).toString(),
      receiver: ARC0200Contract.formatBase64EncodedAddressArg(
        transaction.applicationArgs[1]
      ),
      type: TransactionTypeEnum.ARC0200AssetTransfer,
    };
  }

  return null;
}
