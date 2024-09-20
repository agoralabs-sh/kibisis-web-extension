import { encode as encodeHex } from '@stablelib/hex';
import { EncodedTransaction, OnApplicationComplete } from 'algosdk';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import { IAccount, IAccountInformation, INetwork } from '@extension/types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

interface IOptions {
  network: INetwork | null;
  sender: IAccount | null;
}

/**
 * Parses an encoded transaction to determine its true type. This function contains the logic to correctly determine the
 * transaction type from the variables in the supplied transaction.
 * @param {EncodedTransaction} encodedTransaction - an encoded transaction to parse.
 * @param {IOptions} options - [optional] the account of the sender and the network for this transaction. This is to
 * perform more in-depth parsing, namely determine if an "axfer" is an opt-in.
 * @returns {TransactionTypeEnum} the transaction type. If the transaction is invalid, or the transaction is not known,
 * the moniker "TransactionTypeEnum.Unknown" is returned.
 */
export default function parseTransactionType(
  encodedTransaction: EncodedTransaction,
  { network, sender }: IOptions = { network: null, sender: null }
): TransactionTypeEnum {
  let accountInformation: IAccountInformation | null;
  let senderAddress: string;

  // asset config
  if (encodedTransaction.type === 'acfg') {
    // if there is an asset id, it is a destruction/modification
    if (encodedTransaction.caid) {
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
  if (encodedTransaction.type === 'afrz') {
    return encodedTransaction.afrz
      ? TransactionTypeEnum.AssetFreeze
      : TransactionTypeEnum.AssetUnfreeze;
  }

  // application calls
  if (encodedTransaction.type === 'appl') {
    // if there is no app oncomplete (should be zero, but will be omitted due to weird algosdk parsing), it could be either a noop or creation
    if (!encodedTransaction.apan) {
      // if there is an app index, it will be a no-op
      if (encodedTransaction.apid) {
        return TransactionTypeEnum.ApplicationNoOp;
      }

      return TransactionTypeEnum.ApplicationCreate;
    }

    // otherwise, just use the application on complete
    switch (encodedTransaction.apan) {
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
  if (encodedTransaction.type === 'axfer') {
    // if we have a sender, we can determine if this "axfer" is an opt-in
    // https://developer.algorand.org/docs/get-details/transactions/#opt-in-to-an-asset
    if (network && sender) {
      accountInformation =
        AccountRepository.extractAccountInformationForNetwork(sender, network);
      senderAddress = convertPublicKeyToAVMAddress(sender.publicKey);

      // to test if this an opt-in:
      if (
        // if the sender does not hold the asset, and
        !accountInformation?.standardAssetHoldings.find(
          (value) => value.id === String(encodedTransaction.xaid)
        ) &&
        // if there is no amount, or the amount is zero (any amount will be a transfer, albeit a failed transfer), and
        (!encodedTransaction.aamt || encodedTransaction.aamt <= 0) &&
        encodeHex(encodedTransaction.snd).toUpperCase() === senderAddress &&
        // the sender and receiver address, are the same
        encodedTransaction.arcv &&
        encodeHex(encodedTransaction.arcv).toUpperCase() === senderAddress
      ) {
        return TransactionTypeEnum.AssetOptIn;
      }
    }

    return TransactionTypeEnum.AssetTransfer;
  }

  // key registration
  if (encodedTransaction.type === 'keyreg') {
    return encodedTransaction.selkey &&
      encodedTransaction.votefst &&
      encodedTransaction.votekey &&
      encodedTransaction.votekd &&
      encodedTransaction.votelst
      ? TransactionTypeEnum.KeyRegistrationOnline
      : TransactionTypeEnum.KeyRegistrationOffline;
  }

  // payment
  if (encodedTransaction.type === 'pay') {
    return TransactionTypeEnum.Payment;
  }

  return TransactionTypeEnum.Unknown;
}
