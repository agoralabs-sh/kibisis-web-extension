import { IWalletAccount } from '@agoralabs-sh/algorand-provider';
import { Algodv2 } from 'algosdk';
import Contract from 'arc200js';

// types
import { INetwork } from '@extension/types';

// utils
import getNotPureStakeAlgodClient from './getNotPureStakeAlgodClient';

export default async function getArc200AssetClient(
  account: IWalletAccount,
  network: INetwork,
  tokenId: number
): Promise<any> {
  // TODO: type this contract instance
  const client: Algodv2 = getNotPureStakeAlgodClient(network);
  const ci = new Contract(tokenId, client, {
    addr: account.address,
    simulate: true,
    formatBytes: true,
    waitForConfirmation: false,
  });
  return ci;
}
