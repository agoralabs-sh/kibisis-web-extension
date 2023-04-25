import {
  encodeAddress,
  EncodedTransaction,
  OnApplicationComplete,
  Transaction,
} from 'algosdk';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import { IAccount } from '@extension/types';

/**
 * Parses the transaction type. This function contains the logic to correctly determine the transaction type from the
 * variables in the supplied transaction.
 * @param {Transaction} transaction - the transaction to parse.
 * @param {IAccount} sender - [optional] the account of the sender of the transaction. This is to perform more in-depth
 * parsing, namely determine if an "axfer" is an opt-in.
 * @returns {TransactionTypeEnum} the transaction type. If the transaction is invalid, or the transaction is not known,
 * the moniker "TransactionTypeEnum.Unknown" is returned.
 */
export default function parseTransactionType(
  transaction: Transaction,
  sender?: IAccount
): TransactionTypeEnum {
  const encodedTransaction: EncodedTransaction =
    transaction.get_obj_for_encoding();

  // asset config
  if (transaction.type === 'acfg') {
    // if there is an asset id, it is a destruction/modification
    if (encodedTransaction.apid) {
      // if there are no asset params, this is an asset destruction
      if (!encodedTransaction.apar) {
        return TransactionTypeEnum.AssetDestroy;
      }

      // an asset configuration must have the manager, freeze, clawback, and reserve addresses present in the params
      // https://developer.algorand.org/docs/get-details/transactions/#reconfigure-an-asset
      return encodedTransaction.apar.c && // clawback address
        encodedTransaction.apar.f && // freeze address
        encodedTransaction.apar.m && // manager address
        encodedTransaction.apar.r // reserve address
        ? TransactionTypeEnum.AssetConfig
        : TransactionTypeEnum.Unknown;
    }

    // if there is no asset id, but we have params, it is an asset creation
    // https://developer.algorand.org/docs/get-details/transactions/#create-an-asset
    if (encodedTransaction.apar) {
      return TransactionTypeEnum.AssetCreate;
    }
  }

  // asset freeze
  if (transaction.type === 'afrz') {
    return encodedTransaction.afrz
      ? TransactionTypeEnum.AssetFreeze
      : TransactionTypeEnum.AssetUnFreeze;
  }

  // application calls
  if (transaction.type === 'appl') {
    // if there is no app oncomplete, it could be either a noop or creation
    if (!transaction.appOnComplete) {
      // if there is an app index, it will be a no-op
      if (transaction.appIndex) {
        return TransactionTypeEnum.ApplicationNoOp;
      }

      return TransactionTypeEnum.ApplicationCreate;
    }

    // otherwise, just use the application on complete
    switch (transaction.appOnComplete) {
      case OnApplicationComplete.ClearStateOC:
        return TransactionTypeEnum.ApplicationClearState;
      case OnApplicationComplete.CloseOutOC:
        return TransactionTypeEnum.ApplicationCloseOut;
      case OnApplicationComplete.DeleteApplicationOC:
        return TransactionTypeEnum.ApplicationDelete;
      case OnApplicationComplete.OptInOC:
        return TransactionTypeEnum.ApplicationOptIn;
      case OnApplicationComplete.UpdateApplicationOC:
        return TransactionTypeEnum.ApplicationUpdate;
      default:
        return TransactionTypeEnum.Unknown;
    }
  }

  // asset transfer
  if (transaction.type === 'axfer') {
    // if we have a sender, we can determine if this "axfer" is an opt-in
    // https://developer.algorand.org/docs/get-details/transactions/#opt-in-to-an-asset
    if (sender) {
      if (
        !sender.assets.find(
          (value) => value.id === String(encodedTransaction.apid)
        ) && // if the sender does not hold the asset
        (!transaction.amount || transaction.amount <= 0) && // if there is no amount, or the amount is zero (any amount will be a transfer, albeit a failed transfer)
        encodeAddress(transaction.from.publicKey) === sender.address &&
        encodeAddress(transaction.to.publicKey) === sender.address // the sender and receiver address, are the same
      ) {
        return TransactionTypeEnum.AssetOptIn;
      }
    }

    return TransactionTypeEnum.AssetTransfer;
  }

  // key registration
  if (transaction.type === 'keyreg') {
    return encodedTransaction.selkey &&
      encodedTransaction.votefst &&
      encodedTransaction.votekey &&
      encodedTransaction.votekd &&
      encodedTransaction.votelst
      ? TransactionTypeEnum.KeyRegistrationOnline
      : TransactionTypeEnum.KeyRegistrationOffline;
  }

  // payment
  if (transaction.type === 'pay') {
    return TransactionTypeEnum.Payment;
  }

  return TransactionTypeEnum.Unknown;
}
