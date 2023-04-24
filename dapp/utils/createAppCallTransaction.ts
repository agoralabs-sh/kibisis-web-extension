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

// Constants
import { TESTNET_APP_INDEX } from '../constants';

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import randomNotPureStakeNode from './randomNotPureStakeNode';

interface IOptions {
  from: string;
  network: INetwork;
  note: string | null;
  type: OnApplicationComplete | null;
}

export default async function createAppCallTransaction({
  from,
  network,
  note,
  type,
}: IOptions): Promise<Transaction> {
  const appArgs: Uint8Array[] = [Uint8Array.from([0]), Uint8Array.from([0, 1])];
  const encodedApprovalProgram: string = 'BIEBMgkxABIxGYEED01D';
  const encodedClearProgram: string = 'BIEB';
  const node: INode = randomNotPureStakeNode(network);
  const client: Algodv2 = new Algodv2('', node.url, node.port);
  const encoder: TextEncoder = new TextEncoder();
  const suggestedParams: SuggestedParams = await client
    .getTransactionParams()
    .do();

  switch (type) {
    case OnApplicationComplete.ClearStateOC:
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
    case OnApplicationComplete.CloseOutOC:
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
    case OnApplicationComplete.DeleteApplicationOC:
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
    case OnApplicationComplete.NoOpOC:
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
    case OnApplicationComplete.OptInOC:
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
    case OnApplicationComplete.UpdateApplicationOC:
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
  }
}
