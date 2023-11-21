import { decode as decodeBase64 } from '@stablelib/base64';
import {
  Algodv2,
  makeApplicationClearStateTxn,
  makeApplicationCloseOutTxn,
  makeApplicationCreateTxn,
  makeApplicationDeleteTxn,
  makeApplicationNoOpTxn,
  makeApplicationOptInTxn,
  makeApplicationUpdateTxn,
  SuggestedParams,
  Transaction,
  OnApplicationComplete,
} from 'algosdk';

// constants
import { TESTNET_APP_INDEX } from '../constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import { INetwork } from '@extension/types';

// utils
import getNotPureStakeAlgodClient from './getNotPureStakeAlgodClient';

interface IOptions {
  from: string;
  network: INetwork;
  note: string | null;
  type: TransactionTypeEnum;
}

export default async function createAppCallTransaction({
  from,
  network,
  note,
  type,
}: IOptions): Promise<Transaction | null> {
  const appArgs: Uint8Array[] = [Uint8Array.from([0]), Uint8Array.from([0, 1])];
  const encodedApprovalProgram: string = 'BIEBMgkxABIxGYEED01D';
  const encodedClearProgram: string = 'BIEB';
  const client: Algodv2 = getNotPureStakeAlgodClient(network);
  const encoder: TextEncoder = new TextEncoder();
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  switch (type) {
    case TransactionTypeEnum.ApplicationClearState:
      return makeApplicationClearStateTxn(
        from,
        suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationCloseOut:
      return makeApplicationCloseOutTxn(
        from,
        suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationCreate:
      return makeApplicationCreateTxn(
        from,
        suggestedParams,
        OnApplicationComplete.NoOpOC,
        decodeBase64(encodedApprovalProgram),
        decodeBase64(encodedClearProgram),
        0,
        0,
        0,
        0,
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationDelete:
      return makeApplicationDeleteTxn(
        from,
        suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationNoOp:
      return makeApplicationNoOpTxn(
        from,
        suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationOptIn:
      return makeApplicationOptInTxn(
        from,
        suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    case TransactionTypeEnum.ApplicationUpdate:
      return makeApplicationUpdateTxn(
        from,
        suggestedParams,
        parseInt(TESTNET_APP_INDEX),
        decodeBase64(encodedApprovalProgram),
        decodeBase64(encodedClearProgram),
        appArgs,
        undefined,
        undefined,
        undefined,
        note ? encoder.encode(note) : undefined
      );
    default:
      return null;
  }
}
